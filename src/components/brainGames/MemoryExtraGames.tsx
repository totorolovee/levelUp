import { useEffect, useMemo, useState } from 'react';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { useAnswerFeedback } from './useAnswerFeedback';

const objects = ['☀', '☂', '✈', '♫', '★', '◆', '●', '▲', '♟', '✿'];

export function MissingItemGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 8 }, (_, level) => {
    const visible = [...objects].sort(() => Math.random() - .5).slice(0, 5 + Math.floor(level / 3));
    return { visible, missing: visible[Math.floor(Math.random() * visible.length)] };
  }), []);
  const [level, setLevel] = useState(0);
  const [show, setShow] = useState(true);
  const [correct, setCorrect] = useState(0);
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[level];
  useEffect(() => {
    setShow(true);
    const timer = window.setTimeout(() => setShow(false), Math.max(1400, 2600 - level * 140));
    return () => window.clearTimeout(timer);
  }, [level]);
  const choose = (item: string) => {
    const isCorrect = item === current.missing;
    const next = correct + Number(isCorrect);
    showFeedback(isCorrect, () => {
      if (level === rounds.length - 1) {
        onComplete(adjustScore(Math.round(next / rounds.length * 100), rounds.length));
      }
      else { setCorrect(next); setLevel((value) => value + 1); }
    });
  };
  const choices = [...new Set([current.missing, ...objects.filter((item) => !current.visible.includes(item)).slice(0, 3)])];
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Память · Пропавший предмет' : 'Memory · Missing item'}</p>
    <h1>{show ? (isRussian ? 'Запомни предметы' : 'Remember the items') : (isRussian ? 'Что исчезло?' : 'What disappeared?')}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="memory-objects">{(show ? current.visible : current.visible.filter((item) => item !== current.missing)).map((item) => <span key={item}>{item}</span>)}</div>
    {!show && <div className="game-choice-row">{choices.map((item) => <button disabled={isLocked} key={item} onClick={() => choose(item)} type="button">{item}</button>)}</div>}
    {!show && <GameAnswerFeedback errorText={`${isRussian ? 'Исчез предмет' : 'Missing item'}: ${current.missing}`} isRussian={isRussian} status={feedback} />}
  </section>;
}

export function ReverseSequenceGame({ isRussian, onComplete }: BrainGameProps) {
  const [level, setLevel] = useState(0);
  const [show, setShow] = useState(true);
  const [answer, setAnswer] = useState('');
  const [correct, setCorrect] = useState(0);
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const sequence = useMemo(() => Array.from({ length: 3 + level }, () => Math.floor(Math.random() * 10)).join(''), [level]);
  useEffect(() => {
    setShow(true); setAnswer('');
    const timer = window.setTimeout(() => setShow(false), 2400);
    return () => window.clearTimeout(timer);
  }, [level]);
  const check = () => {
    const expected = [...sequence].reverse().join('');
    const isCorrect = answer === expected;
    const next = correct + Number(isCorrect);
    showFeedback(isCorrect, () => {
      if (level === 6) onComplete(adjustScore(Math.round(next / 7 * 100), 7));
      else { setCorrect(next); setLevel((value) => value + 1); }
    });
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Память · Наоборот' : 'Memory · Reverse'}</p>
    <h1>{show ? sequence : (isRussian ? 'Введи цифры наоборот' : 'Enter the digits backwards')}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/7</p>
    {!show && <form onSubmit={(event) => { event.preventDefault(); check(); }}>
      <input autoFocus disabled={isLocked} inputMode="numeric" maxLength={sequence.length} onChange={(event) => setAnswer(event.target.value.replace(/\D/g, ''))} value={answer} />
      <button disabled={answer.length !== sequence.length || isLocked} type="submit">{isRussian ? 'Готово' : 'Done'}</button>
      <GameAnswerFeedback errorText={`${isRussian ? 'Правильный ответ' : 'Correct answer'}: ${[...sequence].reverse().join('')}`} isRussian={isRussian} status={feedback} />
    </form>}
  </section>;
}

export function GrowingMatrixGame({ isRussian, onComplete }: BrainGameProps) {
  const [level, setLevel] = useState(0);
  const [show, setShow] = useState(true);
  const [chosen, setChosen] = useState<Set<number>>(new Set());
  const [correct, setCorrect] = useState(0);
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const targets = useMemo(() => {
    const result = new Set<number>();
    while (result.size < 3 + level) result.add(Math.floor(Math.random() * 25));
    return result;
  }, [level]);
  useEffect(() => {
    setShow(true); setChosen(new Set());
    const timer = window.setTimeout(() => setShow(false), 2400);
    return () => window.clearTimeout(timer);
  }, [level]);
  const choose = (index: number) => {
    if (show || chosen.has(index)) return;
    if (!targets.has(index)) {
      showFeedback(false, () => undefined);
      return;
    }
    const nextChosen = new Set(chosen).add(index);
    setChosen(nextChosen);
    if (nextChosen.size !== targets.size) return;
    const hits = [...nextChosen].filter((value) => targets.has(value)).length;
    const next = correct + hits / targets.size;
    showFeedback(hits === targets.size, () => {
      if (level === 6) onComplete(adjustScore(Math.round(next / 7 * 100), 7));
      else { setCorrect(next); setLevel((value) => value + 1); }
    });
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Память · Растущая матрица' : 'Memory · Growing matrix'}</p>
    <h1>{show ? (isRussian ? 'Запомни клетки' : 'Remember the cells') : (isRussian ? 'Повтори рисунок' : 'Repeat the pattern')}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/7</p>
    <div className="pattern-grid">{Array.from({ length: 25 }, (_, index) =>
      <button className={(show && targets.has(index)) || chosen.has(index) ? 'active' : ''} disabled={show || isLocked} key={index} onClick={() => choose(index)} type="button" />)}</div>
    <GameAnswerFeedback errorText={isRussian ? 'Эта клетка не входила в рисунок.' : 'That cell was not part of the pattern.'} isRussian={isRussian} status={feedback} />
  </section>;
}
