import { useEffect, useRef, useState } from 'react';

type Props = {
  isRussian: boolean;
  roundsCount: number;
  onComplete: (score: number) => void;
};

export function SpeedTrainingGame({ isRussian, roundsCount, onComplete }: Props) {
  const [round, setRound] = useState(1);
  const [state, setState] = useState<'waiting' | 'ready'>('waiting');
  const results = useRef<number[]>([]);
  const startedAt = useRef(0);

  useEffect(() => {
    setState('waiting');
    const timer = window.setTimeout(() => {
      startedAt.current = performance.now();
      setState('ready');
    }, 900 + Math.random() * 1600);
    return () => window.clearTimeout(timer);
  }, [round]);

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
      <p>{isRussian ? 'Попытка' : 'Attempt'} {round} / {roundsCount}</p>
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
