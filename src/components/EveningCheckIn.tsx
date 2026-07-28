import { useState } from 'react';
import { adjustAfterCheckIn } from '../lib/goalCoach';
import { useLanguage } from '../lib/language';

type EveningCheckInProps = {
  goal: string;
  currentAction: string;
  availableTime: string;
  onSave: (note: string, message: string, nextAction: string) => void;
};

export function EveningCheckIn({ goal, currentAction, availableTime, onSave }: EveningCheckInProps) {
  const { language } = useLanguage();
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async () => {
    if (note.trim().length < 3) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const adjustment = await adjustAfterCheckIn(
        goal,
        note.trim(),
        currentAction,
        availableTime,
        language,
      );
      onSave(note.trim(), adjustment.message, adjustment.nextAction);
      setNote('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'AI Coach не ответил.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="evening-checkin">
      <p className="eyebrow">Вечерний check-in</p>
      <h2>Как прошёл день?</h2>
      <p>Расскажи честно. Coach не оценивает — он улучшает следующий шаг.</p>
      <textarea onChange={(event) => setNote(event.target.value)} placeholder="Не хватило времени / всё получилось / было слишком сложно…" rows={3} value={note} />
      <button disabled={note.trim().length < 3 || isLoading} onClick={submit} type="button">
        {isLoading ? 'Coach анализирует…' : 'Отправить коучу'}
      </button>
      {errorMessage && <p className="coach-error">{errorMessage}</p>}
    </section>
  );
}
