import { supabase } from './supabase';
import type { Stock } from './stocks';

type MarketQuote = {
  symbol: string;
  price: number;
  change: number;
};

type MarketResponse = {
  quotes?: unknown;
  updatedAt?: unknown;
};

export async function loadMarketPrices(stocks: Stock[]) {
  const { data, error } = await supabase.functions.invoke<MarketResponse>('market-prices', {
    body: { symbols: stocks.map(({ symbol }) => symbol) },
  });
  if (error || !Array.isArray(data?.quotes)) throw new Error('Котировки недоступны');

  const quotes = data.quotes.filter((quote): quote is MarketQuote => {
    if (!quote || typeof quote !== 'object') return false;
    const item = quote as Partial<MarketQuote>;
    return typeof item.symbol === 'string'
      && typeof item.price === 'number'
      && typeof item.change === 'number';
  });
  const quoteBySymbol = new Map(quotes.map((quote) => [quote.symbol, quote]));

  return {
    stocks: stocks.map((stock) => {
      const quote = quoteBySymbol.get(stock.symbol);
      return quote ? { ...stock, price: quote.price, change: quote.change } : stock;
    }),
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : null,
  };
}
