import type { Stock } from '../lib/stocks';
import { formatMoney } from '../lib/stocks';

type StockCardProps = {
  stock: Stock;
  selected: boolean;
  onSelect: (stock: Stock) => void;
};

export function StockCard({ stock, selected, onSelect }: StockCardProps) {
  const changeClass = stock.change >= 0 ? 'positive' : 'negative';

  return (
    <button
      className={selected ? 'stock-card selected' : 'stock-card'}
      onClick={() => onSelect(stock)}
      type="button"
    >
      <span className="stock-symbol">{stock.symbol}</span>
      <span className="stock-name">{stock.name}</span>
      <strong>{formatMoney(stock.price)}</strong>
      <span className="stock-day-change">
        <span className={changeClass}>
          {stock.change >= 0 ? '+' : ''}
          {stock.change}%
        </span>
        <small>за сегодня</small>
      </span>
    </button>
  );
}
