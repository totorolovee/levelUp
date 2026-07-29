import { useMemo, useState } from 'react';
import type { BrainGameProps } from './types';

const marks = ['●', '▲', '■', '◆', '✦'];

export function TargetScanGame({ isRussian, onComplete }: BrainGameProps) {
  const target = useMemo(() => marks[Math.floor(Math.random() * marks.length)], []);
  const cells = useMemo(() => Array.from({ length: 36 }, (_, index) =>
    index % 7 === 0 ? target : marks[Math.floor(Math.random() * marks.length)]), [target]);
  const targetIndexes = cells.flatMap((mark, index) => mark === target ? [index] : []);
  const [chosen, setChosen] = useState<Set<number>>(new Set());
  const [mistakes, setMistakes] = useState(0);

  const choose = (index: number) => {
    if (chosen.has(index)) return;
    if (cells[index] !== target) {
      setMistakes((value) => value + 1);
      return;
    }
    const next = new Set(chosen).add(index);
    setChosen(next);
    if (next.size === targetIndexes.length) {
      onComplete(Math.max(20, 100 - mistakes * 12));
    }
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">{isRussian ? 'Внимание · Сканер' : 'Attention · Scanner'}</p>
      <h1>{isRussian ? 'Найди все цели' : 'Find every target'}: <b>{target}</b></h1>
      <div className="scan-grid">
        {cells.map((mark, index) => (
          <button className={chosen.has(index) ? 'found' : ''} key={index} onClick={() => choose(index)} type="button">{mark}</button>
        ))}
      </div>
    </section>
  );
}
