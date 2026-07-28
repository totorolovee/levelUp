import {
  achievementCatalog,
  type AchievementKey,
} from '../lib/achievements';
import { useLanguage } from '../lib/language';

export function AchievementsGrid({ unlocked }: { unlocked: AchievementKey[] }) {
  const { language } = useLanguage();
  const unlockedKeys = new Set(unlocked);
  const isRussian = language === 'ru';

  return (
    <section className="achievements-section">
      <div>
        <p className="eyebrow">{isRussian ? 'Коллекция' : 'Collection'}</p>
        <h2>{isRussian ? 'Достижения' : 'Achievements'}</h2>
      </div>
      <div className="achievements-grid">
        {achievementCatalog.map((achievement) => {
          const isUnlocked = unlockedKeys.has(achievement.key);
          return (
            <article className={isUnlocked ? 'achievement unlocked' : 'achievement'} key={achievement.key}>
              <span>{isUnlocked ? achievement.icon : '○'}</span>
              <div>
                <strong>{isRussian ? achievement.ru : achievement.en}</strong>
                <p>
                  {isRussian
                    ? achievement.ruDescription
                    : achievement.enDescription}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
