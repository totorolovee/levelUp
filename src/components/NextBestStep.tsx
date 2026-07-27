import { useState } from 'react';

export function NextBestStep({
  action,
  onComplete,
}: {
  action: string;
  onComplete: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const complete = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await onComplete();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'AI Coach не ответил.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="next-step">
      <div>
        <p className="eyebrow">Следующий лучший шаг</p>
        <h2>{action}</h2>
        <p>Не нужно выполнять весь план. Только это действие.</p>
      </div>
      <button disabled={isLoading} onClick={complete} type="button">
        {isLoading ? 'Coach готовит новый шаг…' : 'Готово +25 XP'}
      </button>
      {errorMessage && <p className="coach-error">{errorMessage}</p>}
    </section>
  );
}
