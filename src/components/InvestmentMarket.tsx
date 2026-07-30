import type { Stock } from '../lib/stocks';
import { stocks } from '../lib/stocks';
import { CompanyProfile } from './CompanyProfile';
import { ResearchHub } from './ResearchHub';
import { StockCard } from './StockCard';

type Props = {
  language: 'ru' | 'en';
  marketStocks: Stock[];
  marketStatus: 'loading' | 'live' | 'error';
  marketUpdatedAt: Date | null;
  onResearchReady: (symbol: string) => void;
  onSelect: (stock: Stock) => void;
  ownedBySymbol: Record<string, number>;
  selected: Stock | null;
};

export function InvestmentMarket({
  language,
  marketStocks,
  marketStatus,
  marketUpdatedAt,
  onResearchReady,
  onSelect,
  ownedBySymbol,
  selected,
}: Props) {
  const isRussian = language === 'ru';
  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{isRussian ? 'Рынок' : 'Market'}</p>
          <h2>{isRussian ? 'Кому доверишь свои первые $?' : 'Which business earns your first investment?'}</h2>
        </div>
        <span className="demo-badge">
          {marketStatus === 'live'
            ? `Finnhub · ${marketStocks.length}/${stocks.length}`
            : (isRussian ? 'Загрузка биржи' : 'Loading market')}
        </span>
      </div>
      <aside className="market-explainer">
        <span className="market-info-icon">i</span>
        <div>
          <strong>{isRussian ? 'Что означают проценты?' : 'What do the percentages mean?'}</strong>
          <p>
            {isRussian
              ? 'Это изменение цены акции за сегодняшний день. Зелёный процент означает рост, красный — снижение. Это не твоя прибыль.'
              : 'This is today’s share-price change. Green means growth and red means decline. It is not your profit.'}
          </p>
        </div>
        <div className="change-examples">
          <span className="positive">+1.8% {isRussian ? 'рост' : 'growth'}</span>
          <span className="negative">−1.3% {isRussian ? 'снижение' : 'decline'}</span>
        </div>
      </aside>
      {marketUpdatedAt && (
        <p className="market-update-note">
          {isRussian ? 'Обновлено' : 'Updated'} {marketUpdatedAt.toLocaleTimeString(isRussian ? 'ru-RU' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })} · {isRussian ? 'автоматически каждые 12 часов' : 'automatically every 12 hours'}
        </p>
      )}
      {marketStatus === 'loading' && (
        <p className="market-status">{isRussian ? 'Загружаю последние доступные цены…' : 'Loading the latest available prices…'}</p>
      )}
      {marketStatus === 'error' && (
        <p className="coach-error" role="alert">
          {isRussian
            ? 'Биржа сейчас не вернула цены. Учебные значения не показываются.'
            : 'The market feed did not return prices. Sample values are hidden.'}
        </p>
      )}
      {marketStatus === 'live' && marketStocks.length < stocks.length && (
        <p className="market-status">
          {isRussian
            ? 'Показаны только котировки, которые сейчас вернула биржа. Учебные цены скрыты.'
            : 'Only quotes returned by the market feed are shown. Sample prices are hidden.'}
        </p>
      )}
      <div className="stock-grid">
        {marketStocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            onSelect={onSelect}
            ownedQuantity={ownedBySymbol[stock.symbol] ?? 0}
            selected={selected?.symbol === stock.symbol}
            stock={stock}
          />
        ))}
      </div>
      {selected && (
        <>
          <CompanyProfile isRussian={isRussian} stock={selected} />
          <ResearchHub
            isRussian={language === 'ru'}
            key={selected.symbol}
            onReady={() => onResearchReady(selected.symbol)}
            stock={selected}
          />
        </>
      )}
    </div>
  );
}
