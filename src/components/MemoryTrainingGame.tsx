import { useEffect, useMemo, useRef, useState } from 'react';
import { GameAnswerFeedback } from './brainGames/GameAnswerFeedback';

type Props = {
  difficulty: number;
  isRussian: boolean;
  sequenceLength: number;
  onComplete: (score: number) => void;
};

export function MemoryTrainingGame({ isRussian, sequenceLength, onComplete }: Props) {
  const [level, setLevel] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [correctTotal, setCorrectTotal] = useState(0);
  const mistakes = useRef(0);
  const sequence = useMemo(
    () => Array.from(
      { length: Math.min(9, sequenceLength + Math.floor(level / 2)) },
      () => Math.floor(Math.random() * 10),
    ).join(''),
    [level, sequenceLength],
  );
  const [isVisible, setIsVisible] = useState(true);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<{ isCorrect: boolean; nextTotal: number } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 3500);
    return () => window.clearTimeout(timer);
  }, [attempt, level]);

  useEffect(() => {
    if (!result) return;
    const timer = window.setTimeout(() => {
      if (!result.isCorrect) {
        setAnswer('');
        setResult(null);
        setIsVisible(true);
        setAttempt((value) => value + 1);
        return;
      }
      if (level === 6) {
        onComplete(Math.max(0, Math.round(result.nextTotal / 7 * 100 - mistakes.current * (100 / 7))));
        return;
      }
      setCorrectTotal(result.nextTotal);
      setAnswer('');
      setResult(null);
      setIsVisible(true);
      setLevel((value) => value + 1);
    }, result.isCorrect ? 420 : 1200);
    return () => window.clearTimeout(timer);
  }, [level, onComplete, result]);

  const check = () => {
    const isCorrect = answer === sequence;
    if (!isCorrect) mistakes.current += 1;
    setResult({ isCorrect, nextTotal: correctTotal + Number(isCorrect) });
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">01 · {isRussian ? 'Память' : 'Memory'}</p>
      <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/7</p>
      <h1>{isVisible
        ? (isRussian ? 'Запомни последовательность' : 'Remember the sequence')
        : (isRussian ? 'Что ты запомнил?' : 'What do you remember?')}</h1>
      {isVisible ? (
        <div className="memory-sequence">{sequence}</div>
      ) : (
        <form onSubmit={(event) => { event.preventDefault(); check(); }}>
          <input
            autoFocus
            disabled={Boolean(result)}
            inputMode="numeric"
            maxLength={sequence.length}
            onChange={(event) => setAnswer(event.target.value.replace(/\D/g, ''))}
            placeholder={isRussian ? `${sequence.length} цифр` : `${sequence.length} digits`}
            value={answer}
          />
          <button disabled={answer.length !== sequence.length || Boolean(result)} type="submit">
            {isRussian ? 'Проверить' : 'Check'}
          </button>
          {result && <GameAnswerFeedback
            errorText={`${isRussian ? 'Правильный ответ' : 'Correct answer'}: ${sequence}`}
            isRussian={isRussian}
            status={result.isCorrect ? 'correct' : 'error'}
          />}
        </form>
      )}
    </section>
  );
}
