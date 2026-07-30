import { useEffect, useRef, useState } from 'react';
import type { AnswerFeedback } from './GameAnswerFeedback';

export function useAnswerFeedback(correctDelay = 420, errorDelay = 1200) {
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);
  const locked = useRef(false);
  const mistakes = useRef(0);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const showFeedback = (
    isCorrect: boolean,
    afterCorrect: () => void,
    afterError?: () => void,
  ) => {
    if (locked.current) return false;
    locked.current = true;
    if (!isCorrect) mistakes.current += 1;
    setFeedback(isCorrect ? 'correct' : 'error');
    timer.current = window.setTimeout(() => {
      setFeedback(null);
      locked.current = false;
      if (isCorrect) afterCorrect();
      else afterError?.();
    }, isCorrect ? correctDelay : errorDelay);
    return true;
  };

  const adjustScore = (score: number, rounds: number) =>
    Math.max(0, Math.round(score - mistakes.current * (100 / rounds)));

  return { adjustScore, feedback, isLocked: feedback !== null, showFeedback };
}
