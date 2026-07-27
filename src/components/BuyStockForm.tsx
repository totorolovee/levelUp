import { useState } from 'react';
import type { Stock } from '../lib/stocks';
import { formatMoney } from '../lib/stocks';

type BuyStockFormProps = {
  stock: Stock;
  balance: number;
  onBuy: (decision: BuyDecision) => void;
};

export type BuyDecision = {
  quantity: number;
  reason: string;
  risk: string;
  invalidation: string;
  horizon: string;
  confidence: number;
};

export function BuyStockForm({ stock, balance, onBuy }: BuyStockFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [risk, setRisk] = useState('');
  const [invalidation, setInvalidation] = useState('');
  const [horizon, setHorizon] = useState('1 год');
  const [confidence, setConfidence] = useState(5);
  const total = stock.price * quantity;
  const answersReady = reason.trim().length >= 10 && risk.trim().length >= 10;
  const canBuy = quantity > 0 && total <= balance && answersReady && invalidation.trim().length >= 10;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canBuy) return;
    onBuy({ quantity, reason: reason.trim(), risk: risk.trim(), invalidation: invalidation.trim(), horizon, confidence });
    setReason('');
    setRisk('');
    setInvalidation('');
  };

  return (
    <form className="buy-form" onSubmit={submit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Покупка {stock.symbol}</p>
          <h2>Докажи, что это не случайная покупка</h2>
        </div>
        <strong>{formatMoney(total)}</strong>
      </div>
      <label>
        Количество акций
        <input
          min="1"
          onChange={(event) => setQuantity(Number(event.target.value))}
          type="number"
          value={quantity}
        />
      </label>
      <label>
        Почему ты хочешь купить эту компанию?
        <textarea
          minLength={10}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Например: я верю, что..."
          rows={4}
          value={reason}
        />
        <small className={reason.length >= 10 ? 'field-count ready' : 'field-count'}>
          {reason.length}/10 символов
        </small>
      </label>
      <label>
        Какой здесь главный риск?
        <textarea minLength={10} onChange={(event) => setRisk(event.target.value)} placeholder="Что может пойти не так?" rows={3} value={risk} />
        <small className={risk.length >= 10 ? 'field-count ready' : 'field-count'}>
          {risk.length}/10 символов
        </small>
      </label>
      <label>
        Когда ты признаешь решение ошибочным?
        <textarea minLength={10} onChange={(event) => setInvalidation(event.target.value)} placeholder="Я изменю мнение, если..." rows={3} value={invalidation} />
        <small className={invalidation.length >= 10 ? 'field-count ready' : 'field-count'}>
          {invalidation.length}/10 символов
        </small>
      </label>
      <div className="decision-row">
        <label>
          Срок
          <select onChange={(event) => setHorizon(event.target.value)} value={horizon}>
            <option>1 месяц</option>
            <option>1 год</option>
            <option>3–5 лет</option>
          </select>
        </label>
        <label>
          Уверенность: {confidence}/10
          <input min="1" max="10" onChange={(event) => setConfidence(Number(event.target.value))} type="range" value={confidence} />
        </label>
      </div>
      <p className="coach-question">
        <span>AI Coach</span>
        {reason.length < 10
          ? `Почему именно ${stock.name}, а не просто популярная компания?`
          : 'Ты описал возможный рост. Какие факты могут доказать обратное?'}
      </p>
      <button disabled={!canBuy} type="submit">
        Добавить в портфель
      </button>
      {total > balance && <p className="error">Недостаточно виртуальных денег.</p>}
    </form>
  );
}
