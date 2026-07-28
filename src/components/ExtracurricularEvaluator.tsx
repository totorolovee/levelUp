import { useState } from 'react';
import { evaluateExtracurriculars } from '../lib/extracurricularEvaluator';
import { useLanguage } from '../lib/language';

type Props = {
  feedback: string;
  major: string;
  value: string;
  onChange: (value: string) => void;
  onFeedback: (value: string) => void;
};

export function ExtracurricularEvaluator({
  feedback,
  major,
  value,
  onChange,
  onFeedback,
}: Props) {
  const { language } = useLanguage();
  const [status, setStatus] = useState<'ready' | 'loading' | 'error'>('ready');
  const isRussian = language === 'ru';

  const evaluate = async () => {
    setStatus('loading');
    try {
      onFeedback(await evaluateExtracurriculars(value, major, language));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="extracurricular-editor portfolio-wide">
      <label>
        Extracurriculars
        <textarea
          maxLength={3000}
          onChange={(event) => onChange(event.target.value)}
          placeholder={isRussian
            ? 'Клубы, волонтёрство, спорт, проекты: что делал и какого результата достиг?'
            : 'Clubs, volunteering, sports, and projects: what did you do and achieve?'}
          rows={5}
          value={value}
        />
      </label>
      <button disabled={value.trim().length < 20 || status === 'loading'} onClick={evaluate} type="button">
        {status === 'loading' ? 'AI…' : isRussian ? 'Оценить с AI' : 'Review with AI'}
      </button>
      {status === 'error' && <p className="error">{isRussian ? 'AI сейчас не ответил. Попробуй ещё раз.' : 'AI did not respond. Try again.'}</p>}
      {feedback && (
        <div className="extracurricular-feedback">
          <span>AI feedback</span>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}
