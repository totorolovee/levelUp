import { useMemo, useState } from 'react';
import type { BrainGameProps } from './types';

export function NumberPatternGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 12 }, (_, level) => {
    const start = 2 + Math.floor(Math.random() * 9);
    const step = 2 + Math.floor(Math.random() * (4 + Math.floor(level / 4)));
    const values = Array.from({ length: 4 }, (_, index) => start + step * index);
    return { values, answer: start + step * 4, step };
  }), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const current = rounds[level];
  const options = [current.answer, current.answer + current.step, current.answer - 1].sort(() => Math.random() - .5);
  const choose = (value: number) => {
    const next = correct + Number(value === current.answer);
    if (level === rounds.length - 1) onComplete(Math.round(next / rounds.length * 100));
    else { setCorrect(next); setLevel((item) => item + 1); }
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Логика · Последовательность' : 'Logic · Number pattern'}</p>
    <h1>{current.values.join(' · ')} · ?</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="game-choice-row">{options.map((value) => <button key={value} onClick={() => choose(value)} type="button">{value}</button>)}</div>
  </section>;
}

export function TargetEquationGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 12 }, () => {
    const left = 3 + Math.floor(Math.random() * 12);
    const right = 2 + Math.floor(Math.random() * 8);
    const operators = ['+', '−', '×'] as const;
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const answer = operator === '+' ? left + right : operator === '−' ? left - right : left * right;
    return { left, right, operator, answer };
  }), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const current = rounds[level];
  const choose = (operator: string) => {
    const next = correct + Number(operator === current.operator);
    if (level === rounds.length - 1) onComplete(Math.round(next / rounds.length * 100));
    else { setCorrect(next); setLevel((item) => item + 1); }
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Логика · Знак операции' : 'Logic · Missing operator'}</p>
    <h1>{current.left} ? {current.right} = {current.answer}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="game-choice-row">{['+', '−', '×'].map((operator) => <button key={operator} onClick={() => choose(operator)} type="button">{operator}</button>)}</div>
  </section>;
}

export function OddRuleGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 12 }, () => {
    const evenRule = Math.random() > .5;
    const values = Array.from({ length: 4 }, () => {
      const base = 2 + Math.floor(Math.random() * 40);
      return evenRule ? base + base % 2 : base + Number(base % 2 === 0);
    });
    const oddIndex = Math.floor(Math.random() * 4);
    values[oddIndex] += 1;
    return { values, oddIndex };
  }), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const choose = (index: number) => {
    const next = correct + Number(index === rounds[level].oddIndex);
    if (level === rounds.length - 1) onComplete(Math.round(next / rounds.length * 100));
    else { setCorrect(next); setLevel((item) => item + 1); }
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Логика · Лишнее число' : 'Logic · Odd one out'}</p>
    <h1>{isRussian ? 'Что нарушает правило?' : 'Which breaks the rule?'}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="number-duel logic-options">{rounds[level].values.map((value, index) => <button key={index} onClick={() => choose(index)} type="button">{value}</button>)}</div>
  </section>;
}
