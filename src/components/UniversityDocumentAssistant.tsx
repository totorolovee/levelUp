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
import { UniversityDocumentRow } from './UniversityDocumentRow';

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
      saved: progress[key] ?? {
        documentKey: key,
        completed: false,
        dueDate: '',
        notes: '',
        filePath: '',
        fileName: '',
      },
    };
  }), [content.documents, progress]);
  const completed = documents.filter(({ saved }) => saved.completed).length;
  const percent = documents.length ? Math.round(completed / documents.length * 100) : 0;

  const update = async (key: string, patch: Partial<UniversityDocumentProgress>) => {
    const current = progress[key] ?? {
      documentKey: key,
      completed: false,
      dueDate: '',
      notes: '',
      filePath: '',
      fileName: '',
    };
    const next = { ...current, ...patch };
    setProgress((value) => ({ ...value, [key]: next }));
    try {
      await saveUniversityDocument(university.id, next);
    } catch (error) {
      setStatus('error');
      throw error;
    }
  };

  const askAssistant = async () => {
    setStatus('ai');
    setAiText('');
    const checklist = documents.map(({ title, saved }) =>
      `${saved.completed ? '✓' : '○'} ${title}`
      + `${saved.dueDate ? ` — ${isRussian ? 'срок' : 'due'} ${saved.dueDate}` : ''}`
      + `${saved.fileName ? ` — ${isRussian ? 'файл' : 'file'}: ${saved.fileName}` : ''}`
      + `${saved.notes ? ` — ${isRussian ? 'заметка' : 'note'}: ${saved.notes}` : ''}`,
    ).join('\n');
    const { data, error } = await supabase.functions.invoke('ai', {
      body: {
        prompt: `${isRussian ? 'Университет' : 'University'}: ${content.name}\n`
          + `${isRussian ? 'Специальность' : 'Major'}: ${specialty}\n${checklist}`,
        system: isRussian
          ? 'Ты помощник по сбору документов в университет. Составь полезный приоритетный план: что отсутствует, какой ближайший срок и что проверить в загруженных файлах. Ты видишь названия файлов и заметки, но не их содержимое — честно скажи это. Не обещай поступление и не выдумывай требования.'
          : 'You are a university application document assistant. Give a useful prioritized plan: what is missing, the nearest deadline, and what to verify in uploaded files. You see file names and notes, not file contents—state this honestly. Never guarantee admission or invent requirements.',
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
          <UniversityDocumentRow
            isRussian={isRussian}
            key={key}
            onUpdate={(patch) => update(key, patch)}
            progress={saved}
            title={title}
            universityId={university.id}
          />
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
      <small className="document-ai-scope">
        {isRussian
          ? 'AI учитывает чек-лист, сроки, заметки и названия файлов. Содержимое PDF и Word нужно проверить самостоятельно.'
          : 'AI uses the checklist, deadlines, notes, and file names. Review PDF and Word contents yourself.'}
      </small>
      {status === 'loading' && <p>{isRussian ? 'Загружаю чек-лист…' : 'Loading checklist…'}</p>}
      {status === 'error' && <p className="coach-error">{isRussian ? 'Не удалось сохранить данные.' : 'Could not save your data.'}</p>}
      {aiText && <div className="document-ai-answer"><strong>{isRussian ? 'Совет помощника' : 'Assistant advice'}</strong><p>{aiText}</p></div>}
    </section>
  );
}
