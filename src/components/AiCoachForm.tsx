import { useState, type FormEvent } from 'react';
import { askAiCoach } from '../lib/aiCoach';

type AiCoachFormProps = {
  appContext: string;
  hasAppData: boolean;
};

export function AiCoachForm({ appContext, hasAppData }: AiCoachFormProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const details = question.trim();
    if (!details) return;

    setIsLoading(true);
    setAnswer('');
    setError('');

    try {
      const prompt = [
        'Вот данные пользователя из приложения:',
        appContext,
        `Запрос пользователя: ${details}`,
        'Дай персональный, выполнимый совет на ближайший день.',
      ].join('\n\n');
      setAnswer(await askAiCoach(prompt));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Что-то пошло не так. Попробуй ещё раз.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="ai-coach-card">
      <div className="ai-data-note">
        <span aria-hidden="true">{hasAppData ? '✓' : 'i'}</span>
        <p>
          {hasAppData
            ? 'Я учту твою цель, чтение и решения, сохранённые в приложении.'
            : 'В приложении пока мало данных. Добавь контекст в поле ниже.'}
        </p>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="coach-question">О чём тебе нужен совет?</label>
        <textarea
          id="coach-question"
          maxLength={1200}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Например: я всё откладываю и не понимаю, с чего начать сегодня…"
          value={question}
        />
        <div className="ai-form-footer">
          <small>{question.length}/1200</small>
          <button disabled={isLoading || !question.trim()} type="submit">
            {isLoading ? 'Думаю…' : 'Получить совет'}
          </button>
        </div>
      </form>
      {error && <p className="coach-error" role="alert">{error}</p>}
      {answer && (
        <article className="ai-answer" aria-live="polite">
          <span>Ответ AI‑наставника</span>
          <p>{answer}</p>
        </article>
      )}
    </section>
  );
}
