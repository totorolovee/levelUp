import { useMemo, useRef, useState } from 'react';
import { calculateSpeedGameScore } from '../../lib/speedGameScore';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { useAnswerFeedback } from './useAnswerFeedback';

const arrows = ['↑', '→', '↓', '←'];

export function DirectionRushGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 20 }, () => Math.floor(Math.random() * 4)), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const roundStartedAt = useRef(performance.now());
  const totalResponseMs = useRef(0);
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const choose = (value: number) => {
    const isCorrect = value === rounds[level];
    const next = correct + Number(isCorrect);
    const responseTime = performance.now() - roundStartedAt.current;
    const accepted = showFeedback(isCorrect, () => {
      if (level === rounds.length - 1) {
        onComplete(adjustScore(calculateSpeedGameScore(
          next, rounds.length, totalResponseMs.current, 450, 1900,
        ), rounds.length));
        return;
      }
      setCorrect(next);
      setLevel((item) => item + 1);
      roundStartedAt.current = performance.now();
    }, () => {
      roundStartedAt.current = performance.now();
    });
    if (accepted) totalResponseMs.current += responseTime;
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Скорость · Направление' : 'Speed · Direction rush'}</p>
    <h1 className="direction-arrow">{arrows[rounds[level]]}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="direction-pad">{arrows.map((arrow, index) =>
      <button disabled={isLocked} key={arrow} onClick={() => choose(index)} type="button">{arrow}</button>)}</div>
    <GameAnswerFeedback
      errorText={isRussian
        ? `Правильное направление: ${arrows[rounds[level]]}`
        : `Correct direction: ${arrows[rounds[level]]}`}
      isRussian={isRussian}
      status={feedback}
    />
  </section>;
}

export function CategorySortGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 20 }, (_, level) => ({
    number: 10 + Math.floor(Math.random() * 90),
    rule: level % 2 === 0 ? 'parity' : 'size',
  })), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const roundStartedAt = useRef(performance.now());
  const totalResponseMs = useRef(0);
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[level];
  const choose = (choice: string) => {
    const answer = current.rule === 'parity'
      ? (current.number % 2 ? 'odd' : 'even')
      : (current.number >= 50 ? 'high' : 'low');
    const isCorrect = choice === answer;
    const next = correct + Number(isCorrect);
    const responseTime = performance.now() - roundStartedAt.current;
    const accepted = showFeedback(isCorrect, () => {
      if (level === rounds.length - 1) {
        onComplete(adjustScore(calculateSpeedGameScore(
          next, rounds.length, totalResponseMs.current, 650, 2800,
        ), rounds.length));
        return;
      }
      setCorrect(next);
      setLevel((item) => item + 1);
      roundStartedAt.current = performance.now();
    }, () => {
      roundStartedAt.current = performance.now();
    });
    if (accepted) totalResponseMs.current += responseTime;
  };
  const options = current.rule === 'parity'
    ? [['even', isRussian ? 'Чётное' : 'Even'], ['odd', isRussian ? 'Нечётное' : 'Odd']]
    : [['low', '< 50'], ['high', '≥ 50']];
  const correctLabel = options.find(([value]) => value === (
    current.rule === 'parity'
      ? (current.number % 2 ? 'odd' : 'even')
      : (current.number >= 50 ? 'high' : 'low')
  ))?.[1];
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Скорость · Сортировка' : 'Speed · Quick sort'}</p>
    <h1>{current.number}</h1><p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="game-choice-row">{options.map(([value, label]) =>
      <button disabled={isLocked} key={value} onClick={() => choose(value)} type="button">{label}</button>)}</div>
    <GameAnswerFeedback
      errorText={`${isRussian ? 'Правильный ответ' : 'Correct answer'}: ${correctLabel}`}
      isRussian={isRussian}
      status={feedback}
    />
  </section>;
}
