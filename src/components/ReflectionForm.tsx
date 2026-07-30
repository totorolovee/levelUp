import { useState } from 'react';
import { useLanguage } from '../lib/language';
import { saveTodayReflection, type ReflectionEntry } from '../lib/reflections';

const moods = ['😞', '😕', '😐', '🙂', '😄'];

export function ReflectionForm({ onSaved }: {
  onSaved: (entry: ReflectionEntry) => Promise<void>;
}) {
  const { language } = useLanguage();
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'ready' | 'saving' | 'analyzing' | 'saved' | 'error'>('ready');
  const isRussian = language === 'ru';

  const save = async () => {
    setStatus('saving');
    try {
      const entry = await saveTodayReflection(mood, energy, note);
      setStatus('analyzing');
      await onSaved(entry);
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="reflection-form">
      <p className="eyebrow">AI Check-in · {isRussian ? 'Сегодня' : 'Today'}</p>
      <h2>{isRussian ? 'Сегодняшняя рефлексия' : "Today's Reflection"}</h2>
      <fieldset>
        <legend>{isRussian ? 'Общее настроение' : 'Overall Mood'}</legend>
        <div className="mood-options">
          {moods.map((emoji, index) => (
            <button
              aria-label={`${isRussian ? 'Настроение' : 'Mood'} ${index + 1}`}
              className={mood === index + 1 ? 'selected' : ''}
              key={emoji}
              onClick={() => setMood(index + 1)}
              type="button"
            >
              {emoji}
            </button>
          ))}
        </div>
      </fieldset>
      <label>
        {isRussian ? `Уровень энергии: ${energy}/5` : `Energy Level: ${energy}/5`}
        <input max="5" min="1" onChange={(event) => setEnergy(Number(event.target.value))} type="range" value={energy} />
      </label>
      <label>
        {isRussian ? 'Что стоит запомнить твоему будущему «я»?' : 'What should your future self remember?'}
        <textarea maxLength={2000} onChange={(event) => setNote(event.target.value)} placeholder={isRussian ? 'Запиши одно наблюдение, которое стоит сохранить…' : 'Write one insight worth remembering…'} rows={5} value={note} />
      </label>
      <button disabled={status === 'saving' || status === 'analyzing'} onClick={save} type="button">
        {status === 'saving'
          ? (isRussian ? 'Сохраняю…' : 'Saving…')
          : status === 'analyzing'
            ? (isRussian ? 'AI анализирует…' : 'AI is analyzing…')
            : (isRussian ? 'Сохранить и проанализировать' : 'Save & Analyze')}
      </button>
      {status === 'saved' && <p className="settings-message">{isRussian ? 'Рефлексия сохранена. AI-инсайт готов.' : 'Reflection saved. Your AI insight is ready.'}</p>}
      {status === 'error' && <p className="error">{isRussian ? 'Не удалось сохранить запись.' : 'Could not save the entry.'}</p>}
    </section>
  );
}
