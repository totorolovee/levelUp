import { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { BuyStockForm } from '../components/BuyStockForm';
import type { BuyDecision } from '../components/BuyStockForm';
import { CompanyProfile } from '../components/CompanyProfile';
import { InvestorProgress } from '../components/InvestorProgress';
import { StockCard } from '../components/StockCard';
import { usePortfolio } from '../lib/portfolio';
import { evaluateInvestment } from '../lib/investmentEvaluator';
import { formatMoney, stocks } from '../lib/stocks';
import { useLiveMarket } from '../lib/useLiveMarket';
import { useLanguage } from '../lib/language';
import { SmoothLink } from '../components/SmoothLink';

export function InvestingPage() {
  const { language } = useLanguage();
  const [notice, setNotice] = useState('');
  const {
    marketStocks,
    selected,
    setSelected,
    status: marketStatus,
    updatedAt: marketUpdatedAt,
  } = useLiveMarket(stocks);
  const { addDecision, balance, decisions, status: portfolioStatus } = usePortfolio();
  const balanceText = portfolioStatus === 'ready' ? formatMoney(balance) : '…';
  const score = Math.min(
    100,
    decisions.filter((item) => item.analysisApproved).length * 30
      + decisions.filter((item) => item.lesson).length * 20,
  );
  const ownedBySymbol = decisions.reduce<Record<string, number>>((totals, decision) => {
    totals[decision.symbol] = (totals[decision.symbol] ?? 0) + decision.quantity;
    return totals;
  }, {});

  const buyStock = async (decision: BuyDecision) => {
    if (!selected) return;
    const evaluation = await evaluateInvestment(selected.name, decision, language);
    const purchaseTotal = selected.price * decision.quantity;
    const remainingBalance = balance - purchaseTotal;
    await addDecision({
      symbol: selected.symbol,
      company: selected.name,
      quantity: decision.quantity,
      price: selected.price,
      reason: decision.reason,
      risk: decision.risk,
      invalidation: decision.invalidation,
      horizon: decision.horizon,
      confidence: decision.confidence,
      analysisApproved: evaluation.approved,
      analysisFeedback: evaluation.feedback,
    });
    setNotice(
      `${decision.quantity} ${selected.symbol} куплено за ${formatMoney(purchaseTotal)}. `
      + `Осталось ${formatMoney(remainingBalance)}. ${evaluation.feedback}`,
    );
  };

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro">
        <div>
          <p className="eyebrow">Виртуальный портфель</p>
          <h1>
            {language === 'ru'
              ? `Твои ${balanceText}. Твои решения. Ноль риска.`
              : `Your ${balanceText}. Your decisions. Zero risk.`}
          </h1>
          <p>Не угадывай цену — научись видеть бизнес за графиком.</p>
        </div>
        <div className="balance-card">
          <span>Доступно</span>
          <strong>{balanceText}</strong>
          <small>виртуальные деньги</small>
        </div>
      </section>

      {portfolioStatus === 'guest' && (
        <p className="market-status">
          <SmoothLink href="/login">{language === 'ru' ? 'Войди в аккаунт' : 'Sign in'}</SmoothLink>
          {language === 'ru' ? ', чтобы покупки сохранялись.' : ' to save purchases.'}
        </p>
      )}
      {portfolioStatus === 'error' && (
        <p className="coach-error" role="alert">
          {language === 'ru'
            ? 'Не удалось загрузить портфель. Обнови страницу и не совершай покупку, пока баланс не появится.'
            : 'Could not load your portfolio. Refresh the page and wait for the balance before buying.'}
        </p>
      )}
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
                onSelect={setSelected}
                ownedQuantity={ownedBySymbol[stock.symbol] ?? 0}
                selected={selected?.symbol === stock.symbol}
                stock={stock}
              />
            ))}
          </div>
          {selected && <CompanyProfile stock={selected} />}
        </div>
        {selected && portfolioStatus === 'ready' && (
          <BuyStockForm balance={balance} onBuy={buyStock} stock={selected} />
        )}
      </section>
    </main>
  );
}
