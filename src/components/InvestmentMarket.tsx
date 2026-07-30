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
  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Рынок</p>
          <h2>Кому доверишь свои первые $?</h2>
        </div>
        <span className="demo-badge">
          {marketStatus === 'live'
            ? `Finnhub · ${marketStocks.length}/${stocks.length}`
            : 'Загрузка биржи'}
        </span>
      </div>
      <aside className="market-explainer">
        <span className="market-info-icon">i</span>
        <div>
          <strong>Что означают проценты?</strong>
          <p>
            Это изменение цены акции за сегодняшний день. Зелёный процент
            означает рост, красный — снижение. Это не твоя прибыль.
          </p>
        </div>
        <div className="change-examples">
          <span className="positive">+1.8% рост</span>
          <span className="negative">−1.3% снижение</span>
        </div>
      </aside>
      {marketUpdatedAt && (
        <p className="market-update-note">
          Обновлено {marketUpdatedAt.toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })} · автоматически каждые 12 часов
        </p>
      )}
      {marketStatus === 'loading' && (
        <p className="market-status">Загружаю последние доступные цены…</p>
      )}
      {marketStatus === 'error' && (
        <p className="coach-error" role="alert">
          Биржа сейчас не вернула цены. Учебные значения не показываются.
        </p>
      )}
      {marketStatus === 'live' && marketStocks.length < stocks.length && (
        <p className="market-status">
          Показаны только котировки, которые сейчас вернула биржа.
          Учебные цены скрыты.
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
          <CompanyProfile stock={selected} />
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
