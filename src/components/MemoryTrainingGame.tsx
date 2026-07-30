import { useEffect, useMemo, useState } from 'react';

type Props = {
  difficulty: number;
  isRussian: boolean;
  sequenceLength: number;
  onComplete: (score: number) => void;
};

export function MemoryTrainingGame({ isRussian, sequenceLength, onComplete }: Props) {
  const [level, setLevel] = useState(0);
  const [correctTotal, setCorrectTotal] = useState(0);
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
  }, [level]);

  useEffect(() => {
    if (!result) return;
    const timer = window.setTimeout(() => {
      if (level === 6) {
        onComplete(Math.round(result.nextTotal / 7 * 100));
        return;
      }
      setCorrectTotal(result.nextTotal);
      setAnswer('');
      setResult(null);
      setIsVisible(true);
      setLevel((value) => value + 1);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [level, onComplete, result]);

  const check = () => {
    const correct = [...answer].filter((digit, index) => digit === sequence[index]).length;
    const nextTotal = correctTotal + correct / sequence.length;
    setResult({ isCorrect: answer === sequence, nextTotal });
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
          {result && (
            <p className={result.isCorrect ? 'memory-answer correct' : 'memory-answer error'} role="status">
              {result.isCorrect
                ? (isRussian ? 'Верно!' : 'Correct!')
                : (isRussian ? `Ошибка. Правильный ответ: ${sequence}` : `Mistake. Correct answer: ${sequence}`)}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
