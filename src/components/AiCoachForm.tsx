import { useState, type FormEvent } from 'react';
import { askAiCoach } from '../lib/aiCoach';
import { useLanguage } from '../lib/language';

type AiCoachFormProps = {
  appContext: string;
  hasAppData: boolean;
};

export function AiCoachForm({ appContext, hasAppData }: AiCoachFormProps) {
  const { language } = useLanguage();
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
        language === 'ru' ? 'Вот данные пользователя из приложения:' : 'Here is the user data from the app:',
        appContext,
        `${language === 'ru' ? 'Запрос пользователя' : 'User request'}: ${details}`,
        language === 'ru'
          ? 'Дай персональный, выполнимый совет на ближайший день.'
          : 'Give personalized, actionable advice for the next day.',
      ].join('\n\n');
      setAnswer(await askAiCoach(prompt, language));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : (language === 'ru'
            ? 'Что-то пошло не так. Попробуй ещё раз.'
            : 'Something went wrong. Please try again.'),
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
