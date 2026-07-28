import { supabase } from './supabase';
import type { Stock } from './stocks';
import {
  loadCachedQuotes,
  saveCachedQuotes,
  type MarketQuote,
} from './marketPriceCache';

type MarketResponse = {
  quotes?: unknown;
  updatedAt?: unknown;
};

export async function loadMarketPrices(stocks: Stock[]) {
  const symbols = stocks.map(({ quoteSymbol, symbol }) => quoteSymbol ?? symbol);
  const cached = await loadCachedQuotes(symbols);
  if (cached) return mergeQuotes(stocks, cached.quotes, cached.updatedAt);

  const { data, error } = await supabase.functions.invoke<MarketResponse>('market-prices', {
    body: { symbols },
  });
  if (error || !Array.isArray(data?.quotes)) throw new Error('Котировки недоступны');

  const quotes = data.quotes.filter((quote): quote is MarketQuote => {
    if (!quote || typeof quote !== 'object') return false;
    const item = quote as Partial<MarketQuote>;
    return typeof item.symbol === 'string'
      && typeof item.price === 'number'
      && typeof item.change === 'number';
  });
  const updatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : null;
  if (updatedAt) void saveCachedQuotes(quotes, updatedAt);

  return mergeQuotes(stocks, quotes, updatedAt);
}

function mergeQuotes(stocks: Stock[], quotes: MarketQuote[], updatedAt: string | null) {
  const quoteBySymbol = new Map(quotes.map((quote) => [quote.symbol, quote]));
  return {
    stocks: stocks.flatMap((stock) => {
      const quote = quoteBySymbol.get(stock.quoteSymbol ?? stock.symbol);
      if (quote) {
        return [{ ...stock, price: quote.price, change: quote.change, quoteAvailable: true }];
      }
      return stock.displayWithoutQuote ? [{ ...stock, quoteAvailable: false }] : [];
    }),
    updatedAt,
  };
}
