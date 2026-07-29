import { useMemo, useState } from 'react';
import type { BrainGameProps } from './types';

const marks = ['●', '▲', '■', '◆', '✦'];

function createRound(level: number) {
  const target = marks[Math.floor(Math.random() * marks.length)];
  const count = level >= 7 ? 49 : level >= 3 ? 36 : 25;
  const cells = Array.from({ length: count }, (_, index) =>
    index % 8 === 0 ? target : marks[Math.floor(Math.random() * marks.length)]);
  return { cells, target, targets: cells.filter((mark) => mark === target).length };
}

export function TargetScanGame({ isRussian, onComplete }: BrainGameProps) {
  const [level, setLevel] = useState(0);
  const [chosen, setChosen] = useState<Set<number>>(new Set());
  const [levelMistakes, setLevelMistakes] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [correctLevels, setCorrectLevels] = useState(0);
  const current = useMemo(() => createRound(level), [level]);

  const choose = (index: number) => {
    if (chosen.has(index)) return;
    if (current.cells[index] !== current.target) {
      setLevelMistakes((value) => value + 1);
      setTotalMistakes((value) => value + 1);
      return;
    }
    const nextChosen = new Set(chosen).add(index);
    setChosen(nextChosen);
    if (nextChosen.size !== current.targets) return;
    const nextCorrect = correctLevels + Number(levelMistakes === 0);
    if (level === 9) {
      onComplete(Math.max(20, Math.round((nextCorrect / 10) * 100 - totalMistakes * 2)));
    } else {
      setCorrectLevels(nextCorrect);
      setChosen(new Set());
      setLevelMistakes(0);
      setLevel((value) => value + 1);
    }
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">{isRussian ? 'Внимание · Сканер' : 'Attention · Scanner'}</p>
      <h1>{isRussian ? 'Найди все цели' : 'Find every target'}: <b>{current.target}</b></h1>
      <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/10</p>
      <div className="scan-grid">
        {current.cells.map((mark, index) => (
          <button className={chosen.has(index) ? 'found' : ''} key={`${level}-${index}`} onClick={() => choose(index)} type="button">{mark}</button>
        ))}
      </div>
    </section>
  );
}
