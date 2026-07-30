import { useEffect, useRef, useState } from 'react';
import type { AnswerFeedback } from './GameAnswerFeedback';

export function useAnswerFeedback(delay = 650) {
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);
  const locked = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const showFeedback = (isCorrect: boolean, afterFeedback: () => void) => {
    if (locked.current) return false;
    locked.current = true;
    setFeedback(isCorrect ? 'correct' : 'error');
    timer.current = window.setTimeout(() => {
      setFeedback(null);
      locked.current = false;
      afterFeedback();
    }, delay);
    return true;
  };

  return { feedback, isLocked: feedback !== null, showFeedback };
}
