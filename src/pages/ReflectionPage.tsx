import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { ReflectionForm } from '../components/ReflectionForm';
import { ReflectionHistory } from '../components/ReflectionHistory';
import { SmoothLink } from '../components/SmoothLink';
import { useLanguage } from '../lib/language';
import { loadReflections, type ReflectionEntry } from '../lib/reflections';
import { supabase } from '../lib/supabase';

export function ReflectionPage() {
  const { language } = useLanguage();
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [status, setStatus] = useState<'loading' | 'guest' | 'ready' | 'error'>('loading');
  const isRussian = language === 'ru';

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setStatus('guest');
        return;
      }
      try {
        setEntries(await loadReflections());
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    });
  }, []);

  const addEntry = (entry: ReflectionEntry) => {
    setEntries((current) => [entry, ...current.filter(({ id }) => id !== entry.id)].slice(0, 14));
  };

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro reflection-intro">
        <div>
          <p className="eyebrow">Reflection</p>
          <h1>{isRussian ? 'Замечай себя, а не оценивай.' : 'Notice yourself, without judgment.'}</h1>
          <p>{isRussian ? 'Короткая ежедневная пауза для настроения, энергии и честной мысли.' : 'A short daily pause for your mood, energy, and one honest thought.'}</p>
        </div>
      </section>
      {status === 'loading' && <p>{isRussian ? 'Загрузка…' : 'Loading…'}</p>}
      {status === 'error' && <p className="coach-error">{isRussian ? 'Не удалось загрузить записи.' : 'Could not load entries.'}</p>}
      {status === 'guest' && (
        <section className="empty-state">
          <h2>{isRussian ? 'Сначала войди' : 'Sign in first'}</h2>
          <SmoothLink className="primary-link" href="/login">{isRussian ? 'Войти' : 'Sign in'}</SmoothLink>
        </section>
      )}
      {status === 'ready' && (
        <div className="reflection-layout">
          <ReflectionForm onSaved={addEntry} />
          <ReflectionHistory entries={entries} />
        </div>
      )}
    </main>
  );
}
