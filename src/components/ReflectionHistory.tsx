import { useLanguage } from '../lib/language';
import type { ReflectionInsight } from '../lib/reflectionInsights';
import type { ReflectionEntry } from '../lib/reflections';
import { ReflectionAiInsight } from './ReflectionAiInsight';

const moodEmoji = ['😞', '😕', '😐', '🙂', '😄'];

type Props = {
  entries: ReflectionEntry[];
  insight: ReflectionInsight | null;
  insightStatus: 'idle' | 'loading' | 'error';
};

export function ReflectionHistory({ entries, insight, insightStatus }: Props) {
  const { language } = useLanguage();
  const isRussian = language === 'ru';

  return (
    <section className="reflection-history">
      <p className="eyebrow">{isRussian ? 'Последние 14 дней' : 'Last 14 days'}</p>
      <h2>{isRussian ? 'Лента рефлексий' : 'Reflection Timeline'}</h2>
      {insightStatus === 'loading' && (
        <div className="reflection-insight-loading">
          <span>AI</span><p>{isRussian ? 'Ищу полезное наблюдение в твоих записях…' : 'Looking for a useful observation in your entries…'}</p>
        </div>
      )}
      {insight && insightStatus !== 'loading' && <ReflectionAiInsight insight={insight} isRussian={isRussian} />}
      {insightStatus === 'error' && <p className="reflection-insight-error">{isRussian
        ? 'Запись сохранена, но AI-инсайт сейчас недоступен.'
        : 'Your reflection was saved, but the AI insight is currently unavailable.'}</p>}
      {entries.length === 0 && (
        <p className="reflection-empty">
          {isRussian
            ? 'Твои рефлексии появятся здесь. После первых нескольких записей AI начнёт находить осторожные закономерности.'
            : 'Your reflections will appear here. AI will begin identifying careful trends after your first few entries.'}
        </p>
      )}
      <div>
        {entries.map((entry) => (
          <article key={entry.id}>
            <span>{moodEmoji[entry.mood - 1]}</span>
            <div>
              <strong>{new Intl.DateTimeFormat(isRussian ? 'ru-RU' : 'en-US', {
                day: 'numeric',
                month: 'short',
              }).format(new Date(`${entry.date}T12:00:00`))}</strong>
              <small>{isRussian ? `Энергия ${entry.energy}/5` : `Energy ${entry.energy}/5`}</small>
              {entry.note && <p>{entry.note}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
