import { useEffect, useMemo, useState } from 'react';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { useAnswerFeedback } from './useAnswerFeedback';

export function PatternRecallGame({ isRussian, onComplete }: BrainGameProps) {
  const [level, setLevel] = useState(0);
  const [show, setShow] = useState(true);
  const [chosen, setChosen] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const { feedback, isLocked, showFeedback } = useAnswerFeedback();
  const targets = useMemo(() => {
    const values = new Set<number>();
    while (values.size < 4 + level) values.add(Math.floor(Math.random() * 25));
    return values;
  }, [level]);

  useEffect(() => {
    setShow(true);
    setChosen(new Set());
    const timer = window.setTimeout(() => setShow(false), 2800 - level * 250);
    return () => window.clearTimeout(timer);
  }, [level]);

  const choose = (index: number) => {
    if (show || chosen.has(index)) return;
    const nextChosen = new Set(chosen).add(index);
    setChosen(nextChosen);
    if (nextChosen.size !== targets.size) {
      if (!targets.has(index)) showFeedback(false, () => undefined);
      return;
    }
    const hits = [...nextChosen].filter((value) => targets.has(value)).length;
    const nextScore = score + hits / targets.size;
    showFeedback(hits === targets.size, () => {
      if (level === 4) onComplete(Math.round(nextScore / 5 * 100));
      else {
        setScore(nextScore);
        setLevel((value) => value + 1);
      }
    });
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">{isRussian ? 'Память · Матрица' : 'Memory · Matrix'}</p>
      <h1>{show
        ? (isRussian ? 'Запомни светлые клетки' : 'Remember the bright cells')
        : (isRussian ? 'Повтори рисунок' : 'Repeat the pattern')}</h1>
      <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/5</p>
      <div className="pattern-grid">
        {Array.from({ length: 25 }, (_, index) => (
          <button
            className={(show && targets.has(index)) || chosen.has(index) ? 'active' : ''}
            disabled={show || isLocked}
            key={`${level}-${index}`}
            onClick={() => choose(index)}
            type="button"
          />
        ))}
      </div>
      <GameAnswerFeedback
        errorText={isRussian ? 'Эта клетка не входила в рисунок.' : 'That cell was not part of the pattern.'}
        isRussian={isRussian}
        status={feedback}
      />
    </section>
  );
}
