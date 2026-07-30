import { useMemo, useRef, useState } from 'react';
import { calculateSpeedGameScore } from '../../lib/speedGameScore';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { useAnswerFeedback } from './useAnswerFeedback';

export function RapidMathGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 14 }, () => {
    const left = 2 + Math.floor(Math.random() * 18);
    const right = 2 + Math.floor(Math.random() * 18);
    const isTrue = Math.random() > .45;
    return { left, right, shown: left + right + (isTrue ? 0 : (Math.random() > .5 ? 1 : -1)), isTrue };
  }), []);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const roundStartedAt = useRef(performance.now());
  const totalResponseMs = useRef(0);
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[round];

  const answer = (choice: boolean) => {
    const isCorrect = choice === current.isTrue;
    const nextCorrect = correct + Number(isCorrect);
    const responseTime = performance.now() - roundStartedAt.current;
    const accepted = showFeedback(isCorrect, () => {
      if (round === rounds.length - 1) {
        onComplete(adjustScore(calculateSpeedGameScore(
          nextCorrect, rounds.length, totalResponseMs.current, 900, 4200,
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
      <p className="eyebrow">{isRussian ? 'Скорость · Быстрый счёт' : 'Speed · Quick math'}</p>
      <h1>{current.left} + {current.right} = {current.shown}</h1>
      <p>{isRussian ? 'Верно ли равенство?' : 'Is this correct?'} · {isRussian ? 'Уровень' : 'Level'} {round + 1}/{rounds.length}</p>
      <div className="game-choice-row">
        <button disabled={isLocked} onClick={() => answer(true)} type="button">{isRussian ? 'Да' : 'Yes'}</button>
        <button disabled={isLocked} onClick={() => answer(false)} type="button">{isRussian ? 'Нет' : 'No'}</button>
      </div>
      <GameAnswerFeedback
        errorText={current.isTrue
          ? (isRussian ? 'Равенство было верным.' : 'The equation was correct.')
          : (isRussian ? `Правильная сумма: ${current.left + current.right}` : `Correct sum: ${current.left + current.right}`)}
        isRussian={isRussian}
        status={feedback}
      />
    </section>
  );
}
