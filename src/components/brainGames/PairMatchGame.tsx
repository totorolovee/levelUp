import { useMemo, useState } from 'react';
import type { BrainGameProps } from './types';

const icons = ['◆', '●', '▲', '★', '✦', '⬟'];

export function PairMatchGame({ isRussian, onComplete }: BrainGameProps) {
  const cards = useMemo(
    () => [...icons, ...icons].sort(() => Math.random() - .5),
    [],
  );
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);

  const flip = (index: number) => {
    if (open.length === 2 || open.includes(index) || matched.has(index)) return;
    const next = [...open, index];
    setOpen(next);
    if (next.length !== 2) return;
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    window.setTimeout(() => {
      if (cards[next[0]] === cards[next[1]]) {
        const completed = new Set(matched).add(next[0]).add(next[1]);
        setMatched(completed);
        if (completed.size === cards.length) onComplete(Math.max(40, 110 - nextMoves * 5));
      }
      setOpen([]);
    }, 500);
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">{isRussian ? 'Память · Пары' : 'Memory · Pairs'}</p>
      <h1>{isRussian ? 'Найди одинаковые пары' : 'Match identical pairs'}</h1>
      <p>{isRussian ? 'Найдено пар' : 'Pairs found'} {matched.size / 2}/6</p>
      <div className="pair-grid">
        {cards.map((icon, index) => (
          <button
            className={open.includes(index) || matched.has(index) ? 'open' : ''}
            key={index}
            onClick={() => flip(index)}
            type="button"
          >{open.includes(index) || matched.has(index) ? icon : '?'}</button>
        ))}
      </div>
    </section>
  );
}
