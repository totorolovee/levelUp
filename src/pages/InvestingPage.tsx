import { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { BuyStockForm } from '../components/BuyStockForm';
import type { BuyDecision } from '../components/BuyStockForm';
import { CompanyProfile } from '../components/CompanyProfile';
import { InvestorProgress } from '../components/InvestorProgress';
import { StockCard } from '../components/StockCard';
import { usePortfolio } from '../lib/portfolio';
import { formatMoney, stocks, type Stock } from '../lib/stocks';

export function InvestingPage() {
  const [selected, setSelected] = useState<Stock>(stocks[0]);
  const [notice, setNotice] = useState('');
  const { addDecision, balance, decisions } = usePortfolio();
  const score = Math.min(
    100,
    decisions.length * 30 + decisions.filter((item) => item.lesson).length * 20,
  );

  const buyStock = (decision: BuyDecision) => {
    addDecision({
      symbol: selected.symbol,
      company: selected.name,
      quantity: decision.quantity,
      price: selected.price,
      reason: decision.reason,
      risk: decision.risk,
      invalidation: decision.invalidation,
      horizon: decision.horizon,
      confidence: decision.confidence,
    });
    setNotice(`${decision.quantity} ${selected.symbol} куплено. Решение добавлено в журнал.`);
  };

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro">
        <div>
          <p className="eyebrow">Виртуальный портфель</p>
          <h1>Твои $10,000. Твои решения. Ноль риска.</h1>
          <p>Не угадывай цену — научись видеть бизнес за графиком.</p>
        </div>
        <div className="balance-card">
          <span>Доступно</span>
          <strong>{formatMoney(balance)}</strong>
          <small>виртуальные деньги</small>
        </div>
      </section>

      {notice && <p className="success">{notice}</p>}
      <InvestorProgress score={score} />
      <section className="investing-layout">
        <div>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Рынок</p>
              <h2>Кому доверишь свои первые $?</h2>
            </div>
            <span className="demo-badge">Учебные цены</span>
          </div>
          <div className="stock-grid">
            {stocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                onSelect={setSelected}
                selected={selected.symbol === stock.symbol}
                stock={stock}
              />
            ))}
          </div>
          <CompanyProfile stock={selected} />
        </div>
        <BuyStockForm balance={balance} onBuy={buyStock} stock={selected} />
      </section>
    </main>
  );
}
