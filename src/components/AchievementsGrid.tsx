import {
  achievementCatalog,
  type AchievementProgress,
} from '../lib/achievements';
import { useLanguage } from '../lib/language';

const levelNames = {
  ru: ['Бронза', 'Серебро', 'Золото'],
  en: ['Bronze', 'Silver', 'Gold'],
};

export function AchievementsGrid({ progress }: { progress: AchievementProgress[] }) {
  const { language } = useLanguage();
  const isRussian = language === 'ru';
  const values = new Map(progress.map((item) => [item.key, item.value]));

  return (
    <section className="achievements-section">
      <div>
        <p className="eyebrow">{isRussian ? 'Коллекция' : 'Collection'}</p>
        <h2>{isRussian ? 'Достижения' : 'Achievements'}</h2>
      </div>
      <div className="achievements-grid">
        {achievementCatalog.map((achievement) => {
          const value = values.get(achievement.key) ?? 0;
          const level = achievement.tiers.reduce(
            (earnedLevel, tier, index) => value >= tier.target ? index : earnedLevel,
            -1,
          );
          const nextTier = achievement.tiers[level + 1];
          const levelClass = level >= 0 ? ['bronze', 'silver', 'gold'][level] : 'locked';
          return (
            <article className={`achievement ${levelClass}`} key={achievement.key}>
              <span>{level >= 0 ? achievement.icon : '○'}</span>
              <div>
                <strong>{isRussian ? achievement.ru : achievement.en}</strong>
                <p>{level >= 0 ? levelNames[language][level] : isRussian ? 'Пока не получено' : 'Not earned yet'}</p>
                <div className="achievement-tiers" aria-label={isRussian ? 'Уровни достижения' : 'Achievement levels'}>
                  {achievement.tiers.map((tier) => (
                    <span className={value >= tier.target ? 'earned' : ''} key={tier.target}>
                      {isRussian ? tier.ru : tier.en}
                    </span>
                  ))}
                </div>
                {nextTier && <small>{value}/{nextTier.target}</small>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
