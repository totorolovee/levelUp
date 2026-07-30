import { useMemo, useRef, useState } from 'react';
import { calculateSpeedGameScore } from '../../lib/speedGameScore';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { useAnswerFeedback } from './useAnswerFeedback';

export function QuickCompareGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 16 }, () => {
    const left = 10 + Math.floor(Math.random() * 90);
    let right = 10 + Math.floor(Math.random() * 90);
    if (right === left) right = right === 99 ? 98 : right + 1;
    return { left, right };
  }), []);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const roundStartedAt = useRef(performance.now());
  const totalResponseMs = useRef(0);
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[round];

  const choose = (side: 'left' | 'right') => {
    const expected = current.left > current.right ? 'left' : 'right';
    const isCorrect = side === expected;
    const nextCorrect = correct + Number(isCorrect);
    const responseTime = performance.now() - roundStartedAt.current;
    const accepted = showFeedback(isCorrect, () => {
      if (round === rounds.length - 1) {
        onComplete(adjustScore(calculateSpeedGameScore(
          nextCorrect, rounds.length, totalResponseMs.current, 550, 2400,
        ), rounds.length));
        return;
      }
      setCorrect(nextCorrect);
      setRound((value) => value + 1);
      roundStartedAt.current = performance.now();
    }, () => {
      roundStartedAt.current = performance.now();
    });
    if (accepted) totalResponseMs.current += responseTime;
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">{isRussian ? 'Скорость · Сравнение' : 'Speed · Compare'}</p>
      <h1>{isRussian ? 'Нажми на большее число' : 'Tap the larger number'}</h1>
      <div className="number-duel">
        <button disabled={isLocked} onClick={() => choose('left')} type="button">{current.left}</button>
        <button disabled={isLocked} onClick={() => choose('right')} type="button">{current.right}</button>
      </div>
      <p>{isRussian ? 'Уровень' : 'Level'} {round + 1}/{rounds.length}</p>
      <GameAnswerFeedback
        errorText={isRussian
          ? `Правильный ответ: ${Math.max(current.left, current.right)}`
          : `Correct answer: ${Math.max(current.left, current.right)}`}
        isRussian={isRussian}
        status={feedback}
      />
    </section>
  );
}
