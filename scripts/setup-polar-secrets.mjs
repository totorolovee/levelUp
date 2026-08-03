import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

function fail(message) {
  console.error(`Polar secret setup failed: ${message}`);
  process.exit(1);
}

function readValue(source, name) {
  const line = source
    .split(/\r?\n/)
    .map((item) => item.trim())
    .find((item) => item && !item.startsWith('#') && item.startsWith(`${name}=`));
  if (!line) return '';
  return line.slice(line.indexOf('=') + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
}

let source;
try {
  source = await readFile('.env', 'utf8');
} catch {
  fail('.env is missing');
}

const accessToken = readValue(source, 'POLAR_ACCESS_TOKEN');
const productId = readValue(source, 'POLAR_PRODUCT_ID');
const server = readValue(source, 'POLAR_SERVER') || 'production';
if (!accessToken) fail('POLAR_ACCESS_TOKEN is missing in .env');
if (!productId) fail('POLAR_PRODUCT_ID is missing in .env');
if (!['production', 'sandbox'].includes(server)) {
  fail('POLAR_SERVER must be production or sandbox');
}

const tempDirectory = await mkdtemp(join(tmpdir(), 'nfact-polar-secrets-'));
const secretFile = join(tempDirectory, 'polar.env');
const supabaseCli = fileURLToPath(
  new URL('../node_modules/supabase/dist/supabase.js', import.meta.url),
);

let uploadError = '';
try {
  const values = [
    `POLAR_ACCESS_TOKEN=${accessToken}`,
    `POLAR_PRODUCT_ID=${productId}`,
    `POLAR_SERVER=${server}`,
  ].join('\n');
  await writeFile(secretFile, `${values}\n`, { mode: 0o600 });
  const result = spawnSync(process.execPath, [supabaseCli, 'secrets', 'set', '--env-file', secretFile], {
    stdio: 'inherit',
  });
  if (result.error) uploadError = result.error.message;
  else if (result.status !== 0) uploadError = 'Supabase CLI could not upload Polar secrets';
} catch (error) {
  uploadError = error instanceof Error ? error.message : String(error);
} finally {
  await rm(tempDirectory, { recursive: true, force: true });
}

if (uploadError) fail(uploadError);
console.log('Polar secrets uploaded to Supabase.');
