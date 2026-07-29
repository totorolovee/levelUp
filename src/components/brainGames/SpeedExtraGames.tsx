import { useMemo, useState } from 'react';
import type { BrainGameProps } from './types';

const arrows = ['↑', '→', '↓', '←'];

export function DirectionRushGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 20 }, () => Math.floor(Math.random() * 4)), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const started = useMemo(() => performance.now(), []);
  const choose = (value: number) => {
    const next = correct + Number(value === rounds[level]);
    if (level === rounds.length - 1) {
      const penalty = (performance.now() - started) / 1500;
      onComplete(Math.max(20, Math.round(next / rounds.length * 105 - penalty)));
    } else { setCorrect(next); setLevel((item) => item + 1); }
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Скорость · Направление' : 'Speed · Direction rush'}</p>
    <h1 className="direction-arrow">{arrows[rounds[level]]}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="direction-pad">{arrows.map((arrow, index) =>
      <button key={arrow} onClick={() => choose(index)} type="button">{arrow}</button>)}</div>
  </section>;
}

export function CategorySortGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 20 }, (_, level) => ({
    number: 10 + Math.floor(Math.random() * 90),
    rule: level % 2 === 0 ? 'parity' : 'size',
  })), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const current = rounds[level];
  const choose = (choice: string) => {
    const answer = current.rule === 'parity'
      ? (current.number % 2 ? 'odd' : 'even')
      : (current.number >= 50 ? 'high' : 'low');
    const next = correct + Number(choice === answer);
    if (level === rounds.length - 1) onComplete(Math.round(next / rounds.length * 100));
    else { setCorrect(next); setLevel((item) => item + 1); }
  };
  const options = current.rule === 'parity'
    ? [['even', isRussian ? 'Чётное' : 'Even'], ['odd', isRussian ? 'Нечётное' : 'Odd']]
    : [['low', '< 50'], ['high', '≥ 50']];
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Скорость · Сортировка' : 'Speed · Quick sort'}</p>
    <h1>{current.number}</h1><p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="game-choice-row">{options.map(([value, label]) =>
      <button key={value} onClick={() => choose(value)} type="button">{label}</button>)}</div>
  </section>;
}
