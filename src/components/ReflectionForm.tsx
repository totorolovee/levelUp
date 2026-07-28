import { useState } from 'react';
import { useLanguage } from '../lib/language';
import { saveTodayReflection, type ReflectionEntry } from '../lib/reflections';

const moods = ['😞', '😕', '😐', '🙂', '😄'];

export function ReflectionForm({ onSaved }: { onSaved: (entry: ReflectionEntry) => void }) {
  const { language } = useLanguage();
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'ready' | 'saving' | 'saved' | 'error'>('ready');
  const isRussian = language === 'ru';

  const save = async () => {
    setStatus('saving');
    try {
      onSaved(await saveTodayReflection(mood, energy, note));
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="reflection-form">
      <p className="eyebrow">{isRussian ? 'Сегодня' : 'Today'}</p>
      <h2>{isRussian ? 'Как ты себя чувствуешь?' : 'How are you feeling?'}</h2>
      <fieldset>
        <legend>{isRussian ? 'Настроение' : 'Mood'}</legend>
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
        {isRussian ? `Энергия: ${energy}/5` : `Energy: ${energy}/5`}
        <input max="5" min="1" onChange={(event) => setEnergy(Number(event.target.value))} type="range" value={energy} />
      </label>
      <label>
        {isRussian ? 'Что сегодня повлияло на тебя?' : 'What affected you today?'}
        <textarea maxLength={2000} onChange={(event) => setNote(event.target.value)} placeholder={isRussian ? 'Одна честная мысль…' : 'One honest thought…'} rows={5} value={note} />
      </label>
      <button disabled={status === 'saving'} onClick={save} type="button">
        {status === 'saving' ? '…' : isRussian ? 'Сохранить день' : 'Save today'}
      </button>
      {status === 'saved' && <p className="settings-message">{isRussian ? 'Запись сохранена.' : 'Entry saved.'}</p>}
      {status === 'error' && <p className="error">{isRussian ? 'Не удалось сохранить запись.' : 'Could not save the entry.'}</p>}
    </section>
  );
}
