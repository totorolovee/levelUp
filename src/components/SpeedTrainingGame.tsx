import { useEffect, useRef, useState } from 'react';
import { calculateReactionScore } from '../lib/speedGameScore';
import { GameAnswerFeedback } from './brainGames/GameAnswerFeedback';
import { useAnswerFeedback } from './brainGames/useAnswerFeedback';

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
  const falseStarts = useRef(0);
  const startedAt = useRef(0);
  const { feedback, isLocked, showFeedback } = useAnswerFeedback();

  useEffect(() => {
    setState('waiting');
    const timer = window.setTimeout(() => {
      startedAt.current = performance.now();
      setState('ready');
    }, Math.max(500, 900 - difficulty * 15) + Math.random() * 1400);
    return () => window.clearTimeout(timer);
  }, [difficulty, round]);

  const react = () => {
    if (isLocked) return;
    if (state !== 'ready') {
      if (showFeedback(false, () => undefined)) falseStarts.current += 1;
      return;
    }
    const responseTime = performance.now() - startedAt.current;
    const accepted = showFeedback(true, () => {
      if (round === roundsCount) {
        const average = results.current.reduce((sum, value) => sum + value, 0) / roundsCount;
        onComplete(calculateReactionScore(average, falseStarts.current));
      } else {
        setRound((value) => value + 1);
      }
    });
    if (accepted) results.current.push(responseTime);
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
      <GameAnswerFeedback
        errorText={isRussian
          ? 'Слишком рано — дождись зелёного сигнала.'
          : 'Too early — wait for the green signal.'}
        isRussian={isRussian}
        status={feedback}
      />
    </section>
  );
}
