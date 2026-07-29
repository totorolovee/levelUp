import { useMemo, useState } from 'react';
import type { BrainGameProps } from './types';

export function RapidMathGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 14 }, () => {
    const left = 2 + Math.floor(Math.random() * 18);
    const right = 2 + Math.floor(Math.random() * 18);
    const isTrue = Math.random() > .45;
    return { left, right, shown: left + right + (isTrue ? 0 : (Math.random() > .5 ? 1 : -1)), isTrue };
  }), []);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const current = rounds[round];

  const answer = (choice: boolean) => {
    const nextCorrect = correct + Number(choice === current.isTrue);
    if (round === rounds.length - 1) onComplete(Math.round(nextCorrect / rounds.length * 100));
    else {
      setCorrect(nextCorrect);
      setRound((value) => value + 1);
    }
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">{isRussian ? 'Скорость · Быстрый счёт' : 'Speed · Quick math'}</p>
      <h1>{current.left} + {current.right} = {current.shown}</h1>
      <p>{isRussian ? 'Верно ли равенство?' : 'Is this correct?'} · {isRussian ? 'Уровень' : 'Level'} {round + 1}/{rounds.length}</p>
      <div className="game-choice-row">
        <button onClick={() => answer(true)} type="button">{isRussian ? 'Да' : 'Yes'}</button>
        <button onClick={() => answer(false)} type="button">{isRussian ? 'Нет' : 'No'}</button>
      </div>
    </section>
  );
}
