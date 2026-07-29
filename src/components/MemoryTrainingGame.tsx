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

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 3500);
    return () => window.clearTimeout(timer);
  }, [level]);

  const check = () => {
    const correct = [...answer].filter((digit, index) => digit === sequence[index]).length;
    const nextTotal = correctTotal + correct / sequence.length;
    if (level === 6) {
      onComplete(Math.round(nextTotal / 7 * 100));
      return;
    }
    setCorrectTotal(nextTotal);
    setAnswer('');
    setIsVisible(true);
    setLevel((value) => value + 1);
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
            inputMode="numeric"
            maxLength={sequenceLength}
            onChange={(event) => setAnswer(event.target.value.replace(/\D/g, ''))}
            placeholder={isRussian ? `${sequenceLength} цифр` : `${sequenceLength} digits`}
            value={answer}
          />
          <button disabled={answer.length !== sequenceLength} type="submit">
            {isRussian ? 'Проверить' : 'Check'}
          </button>
        </form>
      )}
    </section>
  );
}
