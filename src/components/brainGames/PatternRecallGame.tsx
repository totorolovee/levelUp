import { useEffect, useMemo, useState } from 'react';
import type { BrainGameProps } from './types';

export function PatternRecallGame({ isRussian, onComplete }: BrainGameProps) {
  const targets = useMemo(() => {
    const values = new Set<number>();
    while (values.size < 6) values.add(Math.floor(Math.random() * 25));
    return values;
  }, []);
  const [show, setShow] = useState(true);
  const [chosen, setChosen] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = window.setTimeout(() => setShow(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  const choose = (index: number) => {
    if (show || chosen.has(index)) return;
    const next = new Set(chosen).add(index);
    setChosen(next);
    if (next.size === targets.size) {
      const correct = [...next].filter((value) => targets.has(value)).length;
      window.setTimeout(() => onComplete(Math.round(correct / targets.size * 100)), 250);
    }
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">{isRussian ? 'Память · Матрица' : 'Memory · Matrix'}</p>
      <h1>{show
        ? (isRussian ? 'Запомни светлые клетки' : 'Remember the bright cells')
        : (isRussian ? 'Повтори рисунок' : 'Repeat the pattern')}</h1>
      <div className="pattern-grid">
        {Array.from({ length: 25 }, (_, index) => (
          <button
            className={(show && targets.has(index)) || chosen.has(index) ? 'active' : ''}
            key={index}
            onClick={() => choose(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
