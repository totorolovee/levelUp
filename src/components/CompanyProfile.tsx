import type { Stock } from '../lib/stocks';

export function CompanyProfile({ stock }: { stock: Stock }) {
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
          <span>Сильная сторона</span>
          <p>{stock.strength}</p>
        </article>
        <article>
          <span>Главный риск</span>
          <p>{stock.risk}</p>
        </article>
        <article>
          <span>Конкуренты</span>
          <p>{stock.competitors}</p>
        </article>
      </div>
    </section>
  );
}
