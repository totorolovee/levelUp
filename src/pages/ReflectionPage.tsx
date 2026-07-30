import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { ReflectionForm } from '../components/ReflectionForm';
import { ReflectionHistory } from '../components/ReflectionHistory';
import { SmoothLink } from '../components/SmoothLink';
import { useLanguage } from '../lib/language';
import {
  generateReflectionInsight,
  type ReflectionInsight,
} from '../lib/reflectionInsights';
import { loadReflections, type ReflectionEntry } from '../lib/reflections';
import { supabase } from '../lib/supabase';

export function ReflectionPage() {
  const { language } = useLanguage();
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [insight, setInsight] = useState<ReflectionInsight | null>(null);
  const [insightStatus, setInsightStatus] = useState<'idle' | 'loading' | 'error'>('idle');
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

  const addEntry = async (entry: ReflectionEntry) => {
    const next = [entry, ...entries.filter(({ id }) => id !== entry.id)].slice(0, 14);
    setEntries(next);
    setInsightStatus('loading');
    try {
      setInsight(await generateReflectionInsight(next, language));
      setInsightStatus('idle');
    } catch {
      setInsightStatus('error');
    }
  };

  return (
    <main className="shell reflection-page">
      <AppHeader />
      <section className="reflection-ai-hero">
        <div>
          <p className="eyebrow">AI Daily Reflection</p>
          <h1>{isRussian ? 'Осмысли сегодня. Думай точнее завтра.' : 'Reflect today. Think smarter tomorrow.'}</h1>
          <p>{isRussian
            ? 'Зафиксируй настроение, энергию и главное наблюдение дня. LevelUp AI помогает замечать закономерности, которые влияют на фокус, результат и решения.'
            : 'Capture today’s mood, energy and insights. LevelUp AI helps identify patterns that improve focus, performance and decision-making.'}</p>
          <div className="reflection-ai-purpose">
            <span>AI</span>
            <p>{isRussian
              ? 'Каждая рефлексия становится личным контекстом для AI-помощника и помогает ему лучше понимать твои привычки, продуктивность и решения.'
              : 'Every reflection becomes personal context for your AI assistant, helping it understand your habits, productivity and decision-making over time.'}</p>
          </div>
        </div>
        <aside><strong>01</strong><span>{isRussian ? 'минута в день' : 'minute a day'}</span><small>{isRussian ? 'для более осознанных решений' : 'for more intentional decisions'}</small></aside>
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
          <ReflectionHistory entries={entries} insight={insight} insightStatus={insightStatus} />
        </div>
      )}
    </main>
  );
}
