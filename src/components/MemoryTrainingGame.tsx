import { useEffect, useMemo, useState } from 'react';

type Props = { isRussian: boolean; onComplete: (score: number) => void };

export function MemoryTrainingGame({ isRussian, onComplete }: Props) {
  const sequence = useMemo(
    () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(''),
    [],
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
            maxLength={6}
            onChange={(event) => setAnswer(event.target.value.replace(/\D/g, ''))}
            placeholder={isRussian ? '6 цифр' : '6 digits'}
            value={answer}
          />
          <button disabled={answer.length !== 6} type="submit">
            {isRussian ? 'Проверить' : 'Check'}
          </button>
        </form>
      )}
    </section>
  );
}
