const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY');

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === 'object' ? value as UnknownRecord : {};
}

function finiteNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

async function getFinnhub(path: string, params: Record<string, string>) {
  if (!FINNHUB_API_KEY) throw new Error('FINNHUB_API_KEY is missing');
  const url = new URL(`https://finnhub.io/api/v1/${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set('token', FINNHUB_API_KEY);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Finnhub ${path} returned ${response.status}`);
  return response.json() as Promise<unknown>;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function readMetric(metrics: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = finiteNumber(metrics[key]);
    if (value !== null) return value;
  }
  return null;
}

export async function loadResearch(symbol: string) {
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setUTCDate(monthAgo.getUTCDate() - 30);
  const [newsResult, recommendationResult, metricResult] = await Promise.allSettled([
    getFinnhub('company-news', {
      symbol,
      from: isoDate(monthAgo),
      to: isoDate(today),
    }),
    getFinnhub('stock/recommendation', { symbol }),
    getFinnhub('stock/metric', { symbol, metric: 'all' }),
  ]);

  const news = newsResult.status === 'fulfilled' && Array.isArray(newsResult.value)
    ? newsResult.value.slice(0, 5).flatMap((item) => {
      const row = asRecord(item);
      if (typeof row.headline !== 'string' || typeof row.url !== 'string') return [];
      return [{
        headline: row.headline.slice(0, 240),
        source: typeof row.source === 'string' ? row.source.slice(0, 80) : 'News',
        summary: typeof row.summary === 'string' ? row.summary.slice(0, 420) : '',
        url: row.url,
        publishedAt: finiteNumber(row.datetime),
      }];
    })
    : [];

  const recommendations = recommendationResult.status === 'fulfilled'
    && Array.isArray(recommendationResult.value)
    ? asRecord(recommendationResult.value[0])
    : {};
  const consensus = {
    period: typeof recommendations.period === 'string' ? recommendations.period : null,
    bullish: (finiteNumber(recommendations.strongBuy) ?? 0)
      + (finiteNumber(recommendations.buy) ?? 0),
    neutral: finiteNumber(recommendations.hold) ?? 0,
    bearish: (finiteNumber(recommendations.sell) ?? 0)
      + (finiteNumber(recommendations.strongSell) ?? 0),
  };

  const metricPayload = metricResult.status === 'fulfilled'
    ? asRecord(metricResult.value)
    : {};
  const metrics = asRecord(metricPayload.metric);
  const financials = [
    { id: 'revenue', value: readMetric(metrics, ['revenueGrowth5Y', 'revenueGrowth3Y']), unit: '%' },
    { id: 'eps', value: readMetric(metrics, ['epsTTM', 'epsNormalizedAnnual']), unit: '$' },
    { id: 'fcf', value: readMetric(metrics, ['freeCashFlowPerShareTTM', 'freeCashFlowPerShareAnnual']), unit: '$/share' },
    { id: 'margin', value: readMetric(metrics, ['operatingMarginAnnual', 'operatingMarginTTM']), unit: '%' },
    { id: 'debt', value: readMetric(metrics, ['totalDebt/totalEquityAnnual', 'totalDebt/totalEquityQuarterly']), unit: '%' },
    { id: 'roe', value: readMetric(metrics, ['roeAnnual', 'roeTTM']), unit: '%' },
  ].filter((item) => item.value !== null);

  return {
    news,
    consensus,
    financials,
    updatedAt: new Date().toISOString(),
  };
}
