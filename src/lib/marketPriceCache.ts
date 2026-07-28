import { supabase } from './supabase';

export type MarketQuote = {
  symbol: string;
  price: number;
  change: number;
};

const CACHE_HOURS = 12;

export async function loadCachedQuotes(symbols: string[]) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const freshSince = new Date(Date.now() - CACHE_HOURS * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('market_price_cache')
    .select('symbol, price, change, updated_at')
    .in('symbol', symbols)
    .gte('updated_at', freshSince);

  if (error || !data || data.length !== symbols.length) return null;
  return {
    quotes: data.map(({ symbol, price, change }) => ({
      symbol,
      price: Number(price),
      change: Number(change),
    })),
    updatedAt: data.reduce(
      (latest, row) => row.updated_at > latest ? row.updated_at : latest,
      data[0].updated_at,
    ),
  };
}

export async function saveCachedQuotes(quotes: MarketQuote[], updatedAt: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !quotes.length) return;

  await supabase.from('market_price_cache').upsert(
    quotes.map((quote) => ({
      user_id: user.id,
      symbol: quote.symbol,
      price: quote.price,
      change: quote.change,
      updated_at: updatedAt,
    })),
    { onConflict: 'user_id,symbol' },
  );
}
