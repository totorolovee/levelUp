import { useMemo, useState } from 'react';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { useAnswerFeedback } from './useAnswerFeedback';

const marks = ['●', '▲', '■'];

export function TargetCountGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 12 }, (_, level) => {
    const target = marks[level % marks.length];
    const cells = Array.from({ length: 16 + Math.floor(level / 4) * 9 }, () =>
      marks[Math.floor(Math.random() * marks.length)]);
    const answer = cells.filter((mark) => mark === target).length;
    return { target, cells, answer };
  }), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const { feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[level];
  const options = useMemo(() =>
    [...new Set([current.answer, current.answer + 1, Math.max(0, current.answer - 1)])]
      .sort(() => Math.random() - .5), [current.answer]);

  const choose = (value: number) => {
    const isCorrect = value === current.answer;
    const next = correct + Number(isCorrect);
    showFeedback(isCorrect, () => {
      if (level === rounds.length - 1) onComplete(Math.round(next / rounds.length * 100));
      else { setCorrect(next); setLevel((item) => item + 1); }
    });
  };

  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Внимание · Подсчёт целей' : 'Attention · Target count'}</p>
    <h1>{isRussian ? 'Сколько здесь' : 'How many'} {current.target}?</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="symbol-cloud">{current.cells.map((mark, index) => <span key={index}>{mark}</span>)}</div>
    <div className="game-choice-row">{options.map((value) =>
      <button disabled={isLocked} key={value} onClick={() => choose(value)} type="button">{value}</button>)}</div>
    <GameAnswerFeedback errorText={`${isRussian ? 'Правильный ответ' : 'Correct answer'}: ${current.answer}`} isRussian={isRussian} status={feedback} />
  </section>;
}

export function FocusMatchGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 18 }, (_, level) => {
    const first = marks[Math.floor(Math.random() * marks.length)];
    const same = Math.random() > .5;
    const second = same ? first : marks.filter((mark) => mark !== first)[Math.floor(Math.random() * 2)];
    return { first, second, same, level };
  }), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const { feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[level];
  const choose = (same: boolean) => {
    const isCorrect = same === current.same;
    const next = correct + Number(isCorrect);
    showFeedback(isCorrect, () => {
      if (level === rounds.length - 1) onComplete(Math.round(next / rounds.length * 100));
      else { setCorrect(next); setLevel((item) => item + 1); }
    });
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Внимание · Совпадение' : 'Attention · Focus match'}</p>
    <h1>{isRussian ? 'Фигуры одинаковые?' : 'Are the shapes identical?'}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="focus-pair"><span>{current.first}</span><span>{current.second}</span></div>
    <div className="game-choice-row">
      <button disabled={isLocked} onClick={() => choose(true)} type="button">{isRussian ? 'Да' : 'Yes'}</button>
      <button disabled={isLocked} onClick={() => choose(false)} type="button">{isRussian ? 'Нет' : 'No'}</button>
    </div>
    <GameAnswerFeedback
      errorText={current.same
        ? (isRussian ? 'Фигуры одинаковые.' : 'The shapes are identical.')
        : (isRussian ? 'Фигуры разные.' : 'The shapes are different.')}
      isRussian={isRussian}
      status={feedback}
    />
  </section>;
}
