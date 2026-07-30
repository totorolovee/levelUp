import { useEffect, useRef, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { BuyStockForm } from '../components/BuyStockForm';
import type { BuyDecision } from '../components/BuyStockForm';
import { InvestmentMarket } from '../components/InvestmentMarket';
import { InvestorProgress } from '../components/InvestorProgress';
import { PurchaseResearchGate } from '../components/PurchaseResearchGate';
import { usePortfolio } from '../lib/portfolio';
import { evaluateInvestment } from '../lib/investmentEvaluator';
import { formatMoney, stocks } from '../lib/stocks';
import { useLiveMarket } from '../lib/useLiveMarket';
import { useLanguage } from '../lib/language';
import { SmoothLink } from '../components/SmoothLink';

export function InvestingPage() {
  const { language } = useLanguage();
  const [notice, setNotice] = useState('');
  const [researchReadyFor, setResearchReadyFor] = useState<string | null>(null);
  const {
    marketStocks,
    selected,
    setSelected,
    status: marketStatus,
    updatedAt: marketUpdatedAt,
  } = useLiveMarket(stocks);
  const {
    addDecision,
    balance,
    decisions,
    settledCount,
    settleDueInvestments,
    status: portfolioStatus,
  } = usePortfolio();
  const settledForUpdate = useRef<string | null>(null);
  const balanceText = portfolioStatus === 'ready' ? formatMoney(balance) : '…';
  const score = Math.min(
    100,
    decisions.filter((item) => item.analysisApproved).length * 30
      + decisions.filter((item) => item.lesson).length * 20,
  );
  const ownedBySymbol = decisions.reduce<Record<string, number>>((totals, decision) => {
    if (decision.settledAt) return totals;
    totals[decision.symbol] = (totals[decision.symbol] ?? 0) + decision.quantity;
    return totals;
  }, {});

  useEffect(() => {
    if (marketStatus !== 'live' || portfolioStatus !== 'ready' || !marketUpdatedAt) return;
    const updateKey = marketUpdatedAt.toISOString();
    if (settledForUpdate.current === updateKey) return;
    settledForUpdate.current = updateKey;
    void settleDueInvestments().catch(() => {
      settledForUpdate.current = null;
    });
  }, [marketStatus, marketUpdatedAt, portfolioStatus, settleDueInvestments]);

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
      language === 'ru'
        ? `${decision.quantity} ${selected.symbol} куплено за ${formatMoney(purchaseTotal)}. Осталось ${formatMoney(remainingBalance)}. ${evaluation.feedback}`
        : `${decision.quantity} ${selected.symbol} shares bought for ${formatMoney(purchaseTotal)}. Remaining ${formatMoney(remainingBalance)}. ${evaluation.feedback}`,
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
      {settledCount > 0 && (
        <p className="success">
          {language === 'ru'
            ? `Срок завершён: закрыто позиций — ${settledCount}. Деньги возвращены на баланс по последней цене.`
            : `${settledCount} matured position(s) closed. The proceeds were returned at the latest price.`}
        </p>
      )}
      <InvestorProgress score={score} />
      <section className="investing-layout">
        <InvestmentMarket
          language={language}
          marketStatus={marketStatus}
          marketStocks={marketStocks}
          marketUpdatedAt={marketUpdatedAt}
          onResearchReady={setResearchReadyFor}
          onSelect={setSelected}
          ownedBySymbol={ownedBySymbol}
          selected={selected}
        />
        {selected && portfolioStatus === 'ready' && (
          researchReadyFor === selected.symbol
            ? <BuyStockForm balance={balance} onBuy={buyStock} stock={selected} />
            : <PurchaseResearchGate isRussian={language === 'ru'} />
        )}
      </section>
    </main>
  );
}
