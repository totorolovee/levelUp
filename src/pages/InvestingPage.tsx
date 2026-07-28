import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { BuyStockForm } from '../components/BuyStockForm';
import type { BuyDecision } from '../components/BuyStockForm';
import { CompanyProfile } from '../components/CompanyProfile';
import { InvestorProgress } from '../components/InvestorProgress';
import { StockCard } from '../components/StockCard';
import { usePortfolio } from '../lib/portfolio';
import { loadMarketPrices } from '../lib/marketPrices';
import { formatMoney, stocks, type Stock } from '../lib/stocks';

export function InvestingPage() {
  const [marketStocks, setMarketStocks] = useState<Stock[]>(stocks);
  const [selected, setSelected] = useState<Stock>(stocks[0]);
  const [notice, setNotice] = useState('');
  const [pricesAreLive, setPricesAreLive] = useState(false);
  const { addDecision, balance, decisions } = usePortfolio();
  const score = Math.min(
    100,
    decisions.length * 30 + decisions.filter((item) => item.lesson).length * 20,
  );

  useEffect(() => {
    let isActive = true;
    loadMarketPrices(stocks)
      .then(({ stocks: updatedStocks }) => {
        if (!isActive) return;
        setMarketStocks(updatedStocks);
        setSelected((current) =>
          updatedStocks.find(({ symbol }) => symbol === current.symbol) ?? current,
        );
        setPricesAreLive(true);
      })
      .catch(() => setPricesAreLive(false));
    return () => {
      isActive = false;
    };
  }, []);

  const buyStock = (decision: BuyDecision) => {
    const purchaseTotal = selected.price * decision.quantity;
    const remainingBalance = balance - purchaseTotal;
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
    setNotice(
      `${decision.quantity} ${selected.symbol} куплено за ${formatMoney(purchaseTotal)}. `
      + `Осталось ${formatMoney(remainingBalance)}.`,
    );
  };

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro">
        <div>
          <p className="eyebrow">Виртуальный портфель</p>
          <h1>Твои {formatMoney(balance)}. Твои решения. Ноль риска.</h1>
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
            <span className="demo-badge">
              {pricesAreLive ? 'Последние рыночные цены' : 'Учебные цены'}
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
          <div className="stock-grid">
            {marketStocks.map((stock) => (
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
