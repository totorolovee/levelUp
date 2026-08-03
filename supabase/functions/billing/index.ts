import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  createCheckout,
  createPortal,
  hasPolarConfig,
  loadPlusStatus,
  PolarApiError,
} from './polar.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

function requestOrigin(request: Request) {
  const value = request.headers.get('origin');
  if (!value) throw new Error('Request origin is missing');
  const url = new URL(value);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Invalid request origin');
  }
  return url.origin;
}

async function getCurrentUser(request: Request) {
  const authorization = request.headers.get('Authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!authorization || !supabaseUrl || !anonKey) return null;
  const client = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data, error } = await client.auth.getUser();
  return error ? null : data.user;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (request.method !== 'POST') return json({ error: 'Используй POST-запрос' }, 405);
  if (!hasPolarConfig()) return json({ error: 'Подписка Plus пока не настроена.' }, 503);

  const user = await getCurrentUser(request);
  if (!user) return json({ error: 'Сначала войди в аккаунт.' }, 401);

  try {
    const body = (await request.json()) as { action?: unknown };
    if (body.action === 'status') return json(await loadPlusStatus(user.id));

    const origin = requestOrigin(request);
    if (body.action === 'checkout') {
      if (!user.email) return json({ error: 'У аккаунта не указан email.' }, 400);
      return json({ url: await createCheckout(user.id, user.email, origin) });
    }
    if (body.action === 'portal') {
      return json({ url: await createPortal(user.id, origin) });
    }
    return json({ error: 'Неизвестное действие.' }, 400);
  } catch (error) {
    console.error('Billing function failed', error);
    if (error instanceof PolarApiError && error.status === 404) {
      return json({ error: 'Подписка Polar для этого аккаунта не найдена.' }, 404);
    }
    return json({ error: 'Не удалось связаться с Polar. Попробуй позже.' }, 502);
  }
});
