import { useEffect, useMemo, useState } from 'react';

type Props = {
  isRussian: boolean;
  sequenceLength: number;
  onComplete: (score: number) => void;
};

export function MemoryTrainingGame({ isRussian, sequenceLength, onComplete }: Props) {
  const sequence = useMemo(
    () => Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * 10)).join(''),
    [sequenceLength],
  );
  const [isVisible, setIsVisible] = useState(true);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  const check = () => {
    const correct = [...answer].filter((digit, index) => digit === sequence[index]).length;
    onComplete(Math.round(correct / sequence.length * 100));
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">01 · {isRussian ? 'Память' : 'Memory'}</p>
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
