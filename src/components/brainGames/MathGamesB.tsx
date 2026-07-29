import { useMemo, useState } from 'react';
import type { BrainGameProps } from './types';

export function FractionCompareGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 15 }, () => {
    const a = 1 + Math.floor(Math.random() * 8); const b = a + 1 + Math.floor(Math.random() * 7);
    const c = 1 + Math.floor(Math.random() * 8); const d = c + 1 + Math.floor(Math.random() * 7);
    return { a, b, c, d };
  }), []);
  const [level, setLevel] = useState(0); const [correct, setCorrect] = useState(0);
  const current = rounds[level];
  const choose = (side: 'left' | 'right') => {
    const expected = current.a / current.b >= current.c / current.d ? 'left' : 'right';
    const next = correct + Number(side === expected);
    if (level === rounds.length - 1) onComplete(Math.round(next / rounds.length * 100));
    else { setCorrect(next); setLevel((item) => item + 1); }
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Математика · Дроби' : 'Math · Fractions'}</p>
    <h1>{isRussian ? 'Какая дробь больше?' : 'Which fraction is greater?'}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="number-duel">
      <button onClick={() => choose('left')} type="button">{current.a}/{current.b}</button>
      <button onClick={() => choose('right')} type="button">{current.c}/{current.d}</button>
    </div>
  </section>;
}

export function MissingNumberGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 15 }, (_, level) => {
    const start = 1 + Math.floor(Math.random() * 10); const step = 2 + Math.floor(level / 4);
    const missingIndex = 1 + Math.floor(Math.random() * 3);
    const values = Array.from({ length: 5 }, (_, index) => start + step * index);
    const answer = values[missingIndex];
    return { shown: values.map((value, index) => index === missingIndex ? '?' : String(value)), answer, step };
  }), []);
  const [level, setLevel] = useState(0); const [correct, setCorrect] = useState(0);
  const current = rounds[level];
  const options = [current.answer, current.answer + current.step, current.answer - current.step].sort(() => Math.random() - .5);
  const choose = (value: number) => {
    const next = correct + Number(value === current.answer);
    if (level === rounds.length - 1) onComplete(Math.round(next / rounds.length * 100));
    else { setCorrect(next); setLevel((item) => item + 1); }
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Математика · Пропущенное число' : 'Math · Missing number'}</p>
    <h1>{current.shown.join(' · ')}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="game-choice-row">{options.map((value) => <button key={value} onClick={() => choose(value)} type="button">{value}</button>)}</div>
  </section>;
}
