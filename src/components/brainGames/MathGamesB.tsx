import { useMemo, useState } from 'react';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { useAnswerFeedback } from './useAnswerFeedback';

export function FractionCompareGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 15 }, () => {
    const a = 1 + Math.floor(Math.random() * 8); const b = a + 1 + Math.floor(Math.random() * 7);
    const c = 1 + Math.floor(Math.random() * 8); const d = c + 1 + Math.floor(Math.random() * 7);
    return { a, b, c, d };
  }), []);
  const [level, setLevel] = useState(0); const [correct, setCorrect] = useState(0);
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[level];
  const choose = (side: 'left' | 'right') => {
    const expected = current.a / current.b >= current.c / current.d ? 'left' : 'right';
    const isCorrect = side === expected;
    const next = correct + Number(isCorrect);
    showFeedback(isCorrect, () => {
      if (level === rounds.length - 1) {
        onComplete(adjustScore(Math.round(next / rounds.length * 100), rounds.length));
      }
      else { setCorrect(next); setLevel((item) => item + 1); }
    });
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Математика · Дроби' : 'Math · Fractions'}</p>
    <h1>{isRussian ? 'Какая дробь больше?' : 'Which fraction is greater?'}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="number-duel">
      <button disabled={isLocked} onClick={() => choose('left')} type="button">{current.a}/{current.b}</button>
      <button disabled={isLocked} onClick={() => choose('right')} type="button">{current.c}/{current.d}</button>
    </div>
    <GameAnswerFeedback
      errorText={`${isRussian ? 'Большая дробь' : 'Greater fraction'}: ${
        current.a / current.b >= current.c / current.d ? `${current.a}/${current.b}` : `${current.c}/${current.d}`}`}
      isRussian={isRussian}
      status={feedback}
    />
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
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[level];
  const options = useMemo(() =>
    [current.answer, current.answer + current.step, current.answer - current.step]
      .sort(() => Math.random() - .5), [current.answer, current.step]);
  const choose = (value: number) => {
    const isCorrect = value === current.answer;
    const next = correct + Number(isCorrect);
    showFeedback(isCorrect, () => {
      if (level === rounds.length - 1) {
        onComplete(adjustScore(Math.round(next / rounds.length * 100), rounds.length));
      }
      else { setCorrect(next); setLevel((item) => item + 1); }
    });
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Математика · Пропущенное число' : 'Math · Missing number'}</p>
    <h1>{current.shown.join(' · ')}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="game-choice-row">{options.map((value) => <button disabled={isLocked} key={value} onClick={() => choose(value)} type="button">{value}</button>)}</div>
    <GameAnswerFeedback errorText={`${isRussian ? 'Пропущенное число' : 'Missing number'}: ${current.answer}`} isRussian={isRussian} status={feedback} />
  </section>;
}
