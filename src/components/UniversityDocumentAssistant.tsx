import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../lib/language';
import {
  analyzeUniversityDocuments,
  type UniversityDocumentAnalysis,
} from '../lib/universityDocumentAnalysis';
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
  const [analyses, setAnalyses] = useState<Record<string, UniversityDocumentAnalysis>>({});
  const [overview, setOverview] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'ai' | 'error'>('loading');
  const isRussian = language === 'ru';
  const content = getUniversityContent(university, language);

  useEffect(() => {
    setAnalyses({});
    setOverview('');
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
    if ('filePath' in patch) {
      setAnalyses((current) => {
        const nextAnalyses = { ...current };
        delete nextAnalyses[key];
        return nextAnalyses;
      });
    }
    try {
      await saveUniversityDocument(university.id, next);
    } catch (error) {
      setStatus('error');
      throw error;
    }
  };

  const askAssistant = async () => {
    setStatus('ai');
    setOverview('');
    try {
      const result = await analyzeUniversityDocuments(documents, {
        language,
        specialty,
        universityName: content.name,
      });
      setAnalyses(result.analyses);
      setOverview(result.overview);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
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
            analysis={analyses[key]}
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
            : (isRussian ? 'Проверить документы с AI ✦' : 'Review documents with AI ✦')}
        </button>
        <a href={content.sourceUrl} rel="noreferrer" target="_blank">
          {isRussian ? 'Проверить официальный сайт ↗' : 'Check the official website ↗'}
        </a>
      </footer>
      <small className="document-ai-scope">
        {isRussian
          ? 'ИИ проверяет до трёх PDF или изображений и добавляет замечания прямо к карточке файла.'
          : 'AI reviews up to three PDFs or images and adds annotations directly to each file card.'}
      </small>
      {status === 'loading' && <p>{isRussian ? 'Загружаю чек-лист…' : 'Loading checklist…'}</p>}
      {status === 'error' && <p className="coach-error">{isRussian
        ? 'Не удалось обработать данные. Проверь файл и попробуй снова.'
        : 'Could not process the data. Check the file and try again.'}</p>}
      {overview && <div className="document-ai-answer"><strong>{isRussian ? 'Следующий шаг' : 'Next step'}</strong><p>{overview}</p></div>}
    </section>
  );
}
