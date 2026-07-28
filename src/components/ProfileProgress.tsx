import type { UserProfile } from '../lib/profile';
import { leagueLevels } from '../lib/leagues';
import { useLanguage } from '../lib/language';

export function ProfileProgress({ profile }: { profile: UserProfile }) {
  const { language } = useLanguage();
  const isRussian = language === 'ru';
  const league = [...leagueLevels].reverse().find(({ minXp }) => profile.xp >= minXp)
    ?? leagueLevels[0];

  return (
    <section className="profile-progress">
      <div className="rank-panel">
        <div><span>{isRussian ? 'Текущий ранг' : 'Current rank'}</span><strong>{profile.rankName}</strong></div>
        <p>{profile.xp} XP</p>
        <div className="rank-progress" role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={profile.rankProgress}>
          <span style={{ width: `${profile.rankProgress}%` }} />
        </div>
        <small>
          {profile.nextRankName
            ? `${profile.xpToNextRank} XP ${isRussian ? 'до ранга' : 'to rank'} «${profile.nextRankName}»`
            : isRussian ? 'Достигнут высший ранг' : 'Highest rank reached'}
        </small>
      </div>
      <div className="progress-cards">
        <article><span>🔥</span><strong>{profile.dailyStreak}</strong><small>{isRussian ? 'дней подряд' : 'day streak'}</small></article>
        <article><span>{league.icon}</span><strong>{isRussian ? league.ru : league.en}</strong><small>{isRussian ? 'текущая лига' : 'current league'}</small></article>
        <article><span>XP</span><strong>{profile.xp}</strong><small>{isRussian ? 'общий опыт' : 'total experience'}</small></article>
      </div>
    </section>
  );
}
