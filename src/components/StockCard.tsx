import type { Stock } from '../lib/stocks';
import { formatMoney } from '../lib/stocks';

type StockCardProps = {
  stock: Stock;
  ownedQuantity: number;
  selected: boolean;
  onSelect: (stock: Stock) => void;
};

export function StockCard({ stock, ownedQuantity, selected, onSelect }: StockCardProps) {
  const changeClass = stock.change >= 0 ? 'positive' : 'negative';

  return (
    <button
      className={`${selected ? 'stock-card selected' : 'stock-card'}${stock.quoteAvailable === false ? ' unavailable' : ''}`}
      disabled={stock.quoteAvailable === false}
      onClick={() => onSelect(stock)}
      type="button"
    >
      <span className="stock-symbol">{stock.symbol}</span>
      <span className="stock-exchange">{stock.exchange}</span>
      <span className="stock-name">{stock.name}</span>
      <span className="stock-price">
        <strong>{stock.quoteAvailable === false ? 'Нет котировки' : formatMoney(stock.price)}</strong>
        {ownedQuantity > 0 && <small>Куплено: {ownedQuantity} шт.</small>}
      </span>
      {stock.quoteAvailable !== false && <span className="stock-day-change">
        <span className={changeClass}>
          {stock.change >= 0 ? '+' : ''}
          {stock.change.toFixed(2).replace('.', ',')}%
        </span>
        <small>за сегодня</small>
      </span>}
    </button>
  );
}
