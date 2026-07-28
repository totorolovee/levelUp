const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY');
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type FinnhubQuote = {
  c?: unknown;
  dp?: unknown;
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (request.method !== 'POST') return json({ error: 'Используй POST-запрос' }, 405);
  if (!FINNHUB_API_KEY) return json({ error: 'Котировки пока не настроены.' }, 503);

  try {
    const body = (await request.json()) as { symbols?: unknown };
    const symbols = Array.isArray(body.symbols)
      ? body.symbols.filter(
        (symbol): symbol is string =>
          typeof symbol === 'string' && /^[A-Z.]{1,10}$/.test(symbol),
      ).slice(0, 20)
      : [];
    if (!symbols.length) return json({ error: 'Не переданы тикеры.' }, 400);

    const availableQuotes: Array<{ symbol: string; price: number; change: number }> = [];
    for (const symbol of symbols) {
      const url = new URL('https://finnhub.io/api/v1/quote');
      url.searchParams.set('symbol', symbol);
      url.searchParams.set('token', FINNHUB_API_KEY);
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = (await response.json()) as FinnhubQuote;
      const price = Number(data.c);
      const change = Number(data.dp);
      if (!Number.isFinite(price) || price <= 0) continue;
      availableQuotes.push({
        symbol,
        price,
        change: Number.isFinite(change) ? change : 0,
      });
    }

    if (!availableQuotes.length) {
      return json({ error: 'Finnhub не вернул котировки. Проверь лимит API.' }, 502);
    }
    return json({
      quotes: availableQuotes,
      updatedAt: new Date().toISOString(),
      freshness: 'realtime',
    });
  } catch (error) {
    console.error('Market prices failed', error);
    return json({ error: 'Не удалось загрузить рыночные цены.' }, 502);
  }
});
