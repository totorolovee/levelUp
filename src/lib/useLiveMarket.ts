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
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    refresh();
    const intervalId = window.setInterval(refreshWhenVisible, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [catalog]);

  return { marketStocks, selected, setSelected, status, updatedAt };
}
