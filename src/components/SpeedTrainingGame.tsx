import { useEffect, useRef, useState } from 'react';

type Props = {
  difficulty: number;
  isRussian: boolean;
  roundsCount: number;
  onComplete: (score: number) => void;
};

export function SpeedTrainingGame({ difficulty, isRussian, roundsCount, onComplete }: Props) {
  const [round, setRound] = useState(1);
  const [state, setState] = useState<'waiting' | 'ready'>('waiting');
  const results = useRef<number[]>([]);
  const startedAt = useRef(0);

  useEffect(() => {
    setState('waiting');
    const timer = window.setTimeout(() => {
      startedAt.current = performance.now();
      setState('ready');
    }, Math.max(500, 900 - difficulty * 15) + Math.random() * 1400);
    return () => window.clearTimeout(timer);
  }, [difficulty, round]);

  const react = () => {
    if (state !== 'ready') return;
    results.current.push(performance.now() - startedAt.current);
    if (round === roundsCount) {
      const average = results.current.reduce((sum, value) => sum + value, 0) / roundsCount;
      onComplete(Math.max(0, Math.min(100, Math.round(120 - average / 5))));
    } else {
      setRound((value) => value + 1);
    }
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">03 · {isRussian ? 'Скорость' : 'Speed'}</p>
      <h1>{state === 'ready'
        ? (isRussian ? 'Нажми сейчас!' : 'Tap now!')
        : (isRussian ? 'Жди зелёный сигнал' : 'Wait for green')}</h1>
      <p>{isRussian ? 'Уровень' : 'Level'} {round} / {roundsCount}</p>
      <button
        className={`reaction-target ${state}`}
        onClick={react}
        type="button"
      >
        {state === 'ready' ? (isRussian ? 'ЖМИ' : 'TAP') : '…'}
      </button>
    </section>
  );
}
