type YahooChart = {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: unknown;
        chartPreviousClose?: unknown;
      };
    }>;
  };
};

export async function loadYahooQuote(symbol: string) {
  const url = new URL(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`,
  );
  url.searchParams.set('interval', '1d');
  url.searchParams.set('range', '5d');
  const response = await fetch(url, { headers: { 'User-Agent': 'LevelUp/1.0' } });
  if (!response.ok) return null;

  const payload = await response.json() as YahooChart;
  const meta = payload.chart?.result?.[0]?.meta;
  const price = Number(meta?.regularMarketPrice);
  const previousClose = Number(meta?.chartPreviousClose);
  if (!Number.isFinite(price) || price <= 0) return null;

  const change = Number.isFinite(previousClose) && previousClose > 0
    ? ((price - previousClose) / previousClose) * 100
    : 0;
  return { symbol, price, change };
}
