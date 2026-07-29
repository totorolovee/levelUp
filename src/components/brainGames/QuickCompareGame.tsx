import { useMemo, useState } from 'react';
import type { BrainGameProps } from './types';

export function QuickCompareGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 16 }, () => {
    const left = 10 + Math.floor(Math.random() * 90);
    let right = 10 + Math.floor(Math.random() * 90);
    if (right === left) right = right === 99 ? 98 : right + 1;
    return { left, right };
  }), []);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const startedAt = useMemo(() => performance.now(), []);
  const current = rounds[round];

  const choose = (side: 'left' | 'right') => {
    const expected = current.left > current.right ? 'left' : 'right';
    const nextCorrect = correct + Number(side === expected);
    if (round === rounds.length - 1) {
      const seconds = (performance.now() - startedAt) / 1000;
      onComplete(Math.max(20, Math.min(100, Math.round(nextCorrect / rounds.length * 110 - seconds))));
    } else {
      setCorrect(nextCorrect);
      setRound((value) => value + 1);
    }
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">{isRussian ? 'Скорость · Сравнение' : 'Speed · Compare'}</p>
      <h1>{isRussian ? 'Нажми на большее число' : 'Tap the larger number'}</h1>
      <div className="number-duel">
        <button onClick={() => choose('left')} type="button">{current.left}</button>
        <button onClick={() => choose('right')} type="button">{current.right}</button>
      </div>
      <p>{isRussian ? 'Уровень' : 'Level'} {round + 1}/{rounds.length}</p>
    </section>
  );
}
