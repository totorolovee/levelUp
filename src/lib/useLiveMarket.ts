import { useEffect, useState } from 'react';
import { loadMarketPrices } from './marketPrices';
import type { Stock } from './stocks';

export function useLiveMarket(catalog: Stock[]) {
  const [marketStocks, setMarketStocks] = useState<Stock[]>([]);
  const [selected, setSelected] = useState<Stock | null>(null);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let isActive = true;
    const refresh = () => {
      void loadMarketPrices(catalog).then((result) => {
        if (!isActive) return;
        setMarketStocks(result.stocks);
        setSelected((current) =>
          result.stocks.find(({ symbol }) => symbol === current?.symbol)
          ?? result.stocks[0]
          ?? null,
        );
        setUpdatedAt(result.updatedAt ? new Date(result.updatedAt) : new Date());
        setStatus('live');
      }).catch(() => setStatus('error'));
    };
    refresh();
    const intervalId = window.setInterval(refresh, 12 * 60 * 60 * 1000);
    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [catalog]);

  return { marketStocks, selected, setSelected, status, updatedAt };
}
