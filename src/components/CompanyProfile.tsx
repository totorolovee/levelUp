import type { Stock } from '../lib/stocks';

type Props = {
  isRussian: boolean;
  stock: Stock;
};

export function CompanyProfile({ isRussian, stock }: Props) {
  return (
    <section className="company-profile">
      <div className="company-title">
        <div className="ticker-logo">{stock.symbol.slice(0, 2)}</div>
        <div>
          <span>{stock.sector}</span>
          <h2>{stock.name}</h2>
        </div>
      </div>
      <p>{stock.business}</p>
      <div className="company-facts">
        <article>
          <span>{isRussian ? 'Сильная сторона' : 'Strength'}</span>
          <p>{stock.strength}</p>
        </article>
        <article>
          <span>{isRussian ? 'Главный риск' : 'Main risk'}</span>
          <p>{stock.risk}</p>
        </article>
        <article>
          <span>{isRussian ? 'Конкуренты' : 'Competitors'}</span>
          <p>{stock.competitors}</p>
        </article>
      </div>
    </section>
  );
}
