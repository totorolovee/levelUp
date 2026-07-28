import { useLanguage } from '../lib/language';
import type { ReflectionEntry } from '../lib/reflections';

const moodEmoji = ['😞', '😕', '😐', '🙂', '😄'];

export function ReflectionHistory({ entries }: { entries: ReflectionEntry[] }) {
  const { language } = useLanguage();
  const isRussian = language === 'ru';

  return (
    <section className="reflection-history">
      <p className="eyebrow">{isRussian ? 'Последние 14 дней' : 'Last 14 days'}</p>
      <h2>{isRussian ? 'Твоя история' : 'Your history'}</h2>
      {entries.length === 0 && (
        <p className="reflection-empty">
          {isRussian ? 'Первая запись появится здесь.' : 'Your first entry will appear here.'}
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
