import { useMemo, useRef, useState } from 'react';
import { calculateSpeedGameScore } from '../../lib/speedGameScore';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { useAnswerFeedback } from './useAnswerFeedback';

export function GreaterExpressionGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 18 }, (_, level) => {
    const a = 2 + Math.floor(Math.random() * (8 + level));
    const b = 2 + Math.floor(Math.random() * 8);
    const c = 2 + Math.floor(Math.random() * (8 + level));
    const d = 2 + Math.floor(Math.random() * 8);
    return { left: `${a} × ${b}`, right: `${c} × ${d}`, leftValue: a * b, rightValue: c * d };
  }), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const roundStartedAt = useRef(performance.now());
  const totalResponseMs = useRef(0);
  const { feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[level];
  const choose = (side: 'left' | 'right') => {
    const expected = current.leftValue >= current.rightValue ? 'left' : 'right';
    const isCorrect = side === expected;
    const next = correct + Number(isCorrect);
    const responseTime = performance.now() - roundStartedAt.current;
    const accepted = showFeedback(isCorrect, () => {
      if (level === rounds.length - 1) {
        onComplete(calculateSpeedGameScore(next, rounds.length, totalResponseMs.current, 950, 4200));
      } else {
        setCorrect(next);
        setLevel((item) => item + 1);
        roundStartedAt.current = performance.now();
      }
    });
    if (accepted) totalResponseMs.current += responseTime;
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Математика · Что больше' : 'Math · Greater value'}</p>
    <h1>{isRussian ? 'Какое значение больше?' : 'Which value is greater?'}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="number-duel expression-duel">
      <button disabled={isLocked} onClick={() => choose('left')} type="button">{current.left}</button>
      <button disabled={isLocked} onClick={() => choose('right')} type="button">{current.right}</button>
    </div>
    <GameAnswerFeedback errorText={`${isRussian ? 'Большее значение' : 'Greater value'}: ${Math.max(current.leftValue, current.rightValue)}`} isRussian={isRussian} status={feedback} />
  </section>;
}

export function MultiplicationSprintGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 20 }, (_, level) => {
    const left = 2 + Math.floor(Math.random() * Math.min(11, 4 + level));
    const right = 2 + Math.floor(Math.random() * 11);
    const answer = left * right;
    return { left, right, answer, options: [answer, answer + left, Math.max(1, answer - right)].sort(() => Math.random() - .5) };
  }), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const { feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[level];
  const choose = (value: number) => {
    const isCorrect = value === current.answer;
    const next = correct + Number(isCorrect);
    showFeedback(isCorrect, () => {
      if (level === rounds.length - 1) onComplete(Math.round(next / rounds.length * 100));
      else { setCorrect(next); setLevel((item) => item + 1); }
    });
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Математика · Умножение' : 'Math · Multiplication'}</p>
    <h1>{current.left} × {current.right} = ?</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="game-choice-row">{current.options.map((value) => <button disabled={isLocked} key={value} onClick={() => choose(value)} type="button">{value}</button>)}</div>
    <GameAnswerFeedback errorText={`${isRussian ? 'Правильный ответ' : 'Correct answer'}: ${current.answer}`} isRussian={isRussian} status={feedback} />
  </section>;
}

export function NumberPathGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 15 }, (_, level) => {
    const start = 2 + Math.floor(Math.random() * 8);
    const step = 2 + Math.floor(level / 5);
    const answer = start + step;
    const optionCount = level < 5 ? 3 : level < 10 ? 4 : 5;
    const wrong = Array.from({ length: optionCount - 1 }, (_, index) => answer + index + 1);
    return { start, step, answer, options: [answer, ...wrong].sort(() => Math.random() - .5) };
  }), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const { feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[level];
  const choose = (value: number) => {
    const isCorrect = value === current.answer;
    const next = correct + Number(isCorrect);
    showFeedback(isCorrect, () => {
      if (level === rounds.length - 1) onComplete(Math.round(next / rounds.length * 100));
      else { setCorrect(next); setLevel((item) => item + 1); }
    });
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Математика · Числовой путь' : 'Math · Number path'}</p>
    <h1>{current.start} → +{current.step} → ?</h1>
    <p>{isRussian ? 'Выбери следующий блок' : 'Choose the next block'} · {isRussian ? 'уровень' : 'level'} {level + 1}/{rounds.length}</p>
    <div className="number-path">{current.options.map((value) => <button disabled={isLocked} key={value} onClick={() => choose(value)} type="button">{value}</button>)}</div>
    <GameAnswerFeedback errorText={`${isRussian ? 'Следующий блок' : 'Next block'}: ${current.answer}`} isRussian={isRussian} status={feedback} />
  </section>;
}
