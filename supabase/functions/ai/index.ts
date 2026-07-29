// AI-функция на бесплатном ключе Google Gemini.
// Вызов с фронта: supabase.functions.invoke('ai', { body: { prompt, system } })
//
// Запуск (один раз):
//   1) Добавь GEMINI_API_KEY в локальный .env
//   2) Загрузи секрет:  npm run ai:secret
//   3) Задеплой:        npm run ai:deploy
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const MODEL = 'gemini-3.5-flash';
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_FILE_BYTES = 12 * 1024 * 1024;
const supportedFileTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: unknown }>;
    };
  }>;
};

type InlinePart = {
  inline_data: { mime_type: string; data: string };
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  const chunkSize = 32_768;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

async function loadPrivateFiles(req: Request, paths: string[]) {
  if (!paths.length) return [] as InlinePart[];
  const authorization = req.headers.get('Authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!authorization || !supabaseUrl || !supabaseAnonKey) {
    throw new Error('Authentication is required for file analysis');
  }
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) throw new Error('Invalid user session');

  const parts: InlinePart[] = [];
  let totalBytes = 0;
  for (const path of paths.slice(0, 3)) {
    if (!path.startsWith(`${userData.user.id}/`)) throw new Error('Invalid file path');
    const { data, error } = await client.storage.from('university-documents').download(path);
    if (error) throw error;
    if (!supportedFileTypes.has(data.type)) continue;
    if (data.size > MAX_FILE_BYTES) throw new Error('File is too large');
    totalBytes += data.size;
    if (totalBytes > MAX_TOTAL_FILE_BYTES) throw new Error('Combined files are too large');
    parts.push({
      inline_data: {
        mime_type: data.type,
        data: bytesToBase64(new Uint8Array(await data.arrayBuffer())),
      },
    });
  }
  return parts;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Используй POST-запрос' }, 405);

  try {
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return json({ error: 'AI пока не настроен. Попроси наставника проверить секрет.' }, 503);
    }

    const body = (await req.json()) as {
      prompt?: unknown;
      system?: unknown;
      filePaths?: unknown;
    };
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const system = typeof body.system === 'string' ? body.system.trim() : '';
    const filePaths = Array.isArray(body.filePaths)
      ? body.filePaths.filter((path): path is string => typeof path === 'string')
      : [];

    if (!prompt) return json({ error: 'Напиши запрос для AI.' }, 400);
    if (prompt.length > 10_000 || system.length > 5_000) {
      return json({ error: 'Запрос слишком длинный. Сделай его короче.' }, 400);
    }
    if (filePaths.length > 3) return json({ error: 'Можно проверить до трёх файлов за раз.' }, 400);

    let fileParts: InlinePart[] = [];
    try {
      fileParts = await loadPrivateFiles(req, filePaths);
    } catch (error) {
      console.error('Private file loading failed', error);
      return json({ error: 'Не удалось безопасно прочитать документ.' }, 400);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: system ? { parts: [{ text: system }] } : undefined,
          contents: [{ parts: [...fileParts, { text: prompt }] }],
        }),
      },
    );

    const data = (await response.json()) as GeminiResponse;
    if (!response.ok) {
      console.error('Gemini request failed', response.status, data);
      return json({ error: 'AI сейчас не ответил. Попробуй ещё раз чуть позже.' }, 502);
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== 'string' || !text.trim()) {
      console.error('Gemini returned an empty response', data);
      return json({ error: 'AI вернул пустой ответ. Попробуй переформулировать запрос.' }, 502);
    }

    return json({ text });
  } catch (error) {
    console.error('AI function failed', error);
    return json({ error: 'Не получилось обратиться к AI. Попробуй ещё раз.' }, 500);
  }
});
