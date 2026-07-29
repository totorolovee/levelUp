import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../lib/language';
import { supabase } from '../lib/supabase';
import {
  loadUniversityDocuments,
  saveUniversityDocument,
  type UniversityDocumentProgress,
} from '../lib/universityDocuments';
import { getUniversityContent } from '../lib/universityTranslations';
import type { University } from '../lib/universities';

type Props = {
  specialty: string;
  university: University;
};

export function UniversityDocumentAssistant({ specialty, university }: Props) {
  const { language } = useLanguage();
  const [progress, setProgress] = useState<Record<string, UniversityDocumentProgress>>({});
  const [aiText, setAiText] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'ai' | 'error'>('loading');
  const isRussian = language === 'ru';
  const content = getUniversityContent(university, language);

  useEffect(() => {
    loadUniversityDocuments(university.id)
      .then((rows) => {
        setProgress(Object.fromEntries(rows.map((row) => [row.documentKey, row])));
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [university.id]);

  const documents = useMemo(() => content.documents.map((title, index) => {
    const key = `requirement-${index}`;
    return {
      key,
      title,
      saved: progress[key] ?? { documentKey: key, completed: false, dueDate: '', notes: '' },
    };
  }), [content.documents, progress]);
  const completed = documents.filter(({ saved }) => saved.completed).length;
  const percent = documents.length ? Math.round(completed / documents.length * 100) : 0;

  const update = async (key: string, patch: Partial<UniversityDocumentProgress>) => {
    const current = progress[key] ?? {
      documentKey: key, completed: false, dueDate: '', notes: '',
    };
    const next = { ...current, ...patch };
    setProgress((value) => ({ ...value, [key]: next }));
    try {
      await saveUniversityDocument(university.id, next);
    } catch {
      setStatus('error');
    }
  };

  const askAssistant = async () => {
    setStatus('ai');
    setAiText('');
    const checklist = documents.map(({ title, saved }) =>
      `${saved.completed ? '✓' : '○'} ${title}${saved.dueDate ? ` — ${saved.dueDate}` : ''}`,
    ).join('\n');
    const { data, error } = await supabase.functions.invoke('ai', {
      body: {
        prompt: `${isRussian ? 'Университет' : 'University'}: ${content.name}\n`
          + `${isRussian ? 'Специальность' : 'Major'}: ${specialty}\n${checklist}`,
        system: isRussian
          ? 'Ты помощник по сбору документов в университет. Кратко назови следующий шаг, риски по срокам и что проверить на официальном сайте. Не обещай поступление и не выдумывай требования.'
          : 'You are a university application document assistant. Briefly give the next step, deadline risks, and what to verify on the official site. Never guarantee admission or invent requirements.',
      },
    });
    if (error) {
      setStatus('error');
      return;
    }
    setAiText(typeof data?.text === 'string' ? data.text : '');
    setStatus('ready');
  };

  return (
    <section className="document-assistant">
      <header>
        <div>
          <p className="eyebrow">{isRussian ? 'Помощник по документам' : 'Document assistant'}</p>
          <h3>{content.name}</h3>
          <small>{completed}/{documents.length} · {percent}%</small>
        </div>
        <div className="document-progress"><span style={{ width: `${percent}%` }} /></div>
      </header>
      <div className="document-checklist">
        {documents.map(({ key, title, saved }) => (
          <article className={saved.completed ? 'completed' : ''} key={key}>
            <label>
              <input checked={saved.completed} onChange={(event) => void update(key, { completed: event.target.checked })} type="checkbox" />
              <strong>{title}</strong>
            </label>
            <input
              aria-label={isRussian ? 'Дедлайн документа' : 'Document deadline'}
              onChange={(event) => void update(key, { dueDate: event.target.value })}
              type="date"
              value={saved.dueDate}
            />
            <textarea
              defaultValue={saved.notes}
              maxLength={1000}
              onBlur={(event) => void update(key, { notes: event.target.value.trim() })}
              placeholder={isRussian ? 'Заметка или ссылка…' : 'Note or link…'}
              rows={2}
            />
          </article>
        ))}
      </div>
      <footer>
        <button disabled={status === 'ai'} onClick={askAssistant} type="button">
          {status === 'ai'
            ? (isRussian ? 'Анализирую…' : 'Analyzing…')
            : (isRussian ? 'Что делать дальше? ✦' : 'What should I do next? ✦')}
        </button>
        <a href={content.sourceUrl} rel="noreferrer" target="_blank">
          {isRussian ? 'Проверить официальный сайт ↗' : 'Check the official website ↗'}
        </a>
      </footer>
      {status === 'loading' && <p>{isRussian ? 'Загружаю чек-лист…' : 'Loading checklist…'}</p>}
      {status === 'error' && <p className="coach-error">{isRussian ? 'Не удалось сохранить данные.' : 'Could not save your data.'}</p>}
      {aiText && <div className="document-ai-answer"><strong>{isRussian ? 'Совет помощника' : 'Assistant advice'}</strong><p>{aiText}</p></div>}
    </section>
  );
}
