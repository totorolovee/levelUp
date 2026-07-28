import type { UserProfile } from '../lib/profile';
import { useLanguage } from '../lib/language';
import { AvatarUploader } from './AvatarUploader';

export function ProfileCard({
  profile,
  onAvatarChange,
}: {
  profile: UserProfile;
  onAvatarChange: (url: string) => void;
}) {
  const { language } = useLanguage();
  const registrationDate = new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(profile.registeredAt));

  return (
    <section className="profile-card">
      <div className="profile-identity">
        <div className="profile-avatar" aria-label={`Аватар ${profile.displayName}`}>
          {profile.avatarUrl
            ? <img alt="" src={profile.avatarUrl} />
            : profile.avatarLetter}
        </div>
        <div>
          <p className="eyebrow">Профиль</p>
          <h2>{profile.displayName}</h2>
          <p>{profile.email}</p>
          <AvatarUploader onUploaded={onAvatarChange} />
        </div>
      </div>
      <div className="rank-panel">
        <div>
          <span>Текущий ранг</span>
          <strong>{profile.rankName}</strong>
        </div>
        <p>{profile.xp} XP</p>
        <div
          aria-label={`Прогресс ранга: ${profile.rankProgress}%`}
          className="rank-progress"
          role="progressbar"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={profile.rankProgress}
        >
          <span style={{ width: `${profile.rankProgress}%` }} />
        </div>
        <small>
          {profile.nextRankName
            ? `${profile.xpToNextRank} XP до ранга «${profile.nextRankName}»`
            : 'Достигнут высший ранг'}
        </small>
      </div>
      <dl className="profile-stats">
        <div className="streak-stat">
          <dt>Daily streak</dt>
          <dd>🔥 {profile.dailyStreak}</dd>
          <small>дней подряд</small>
        </div>
        <div>
          <dt>Опыт</dt>
          <dd>{profile.xp} XP</dd>
          <small>чтение и активность</small>
        </div>
        <div>
          <dt>Дата регистрации</dt>
          <dd>{registrationDate}</dd>
        </div>
      </dl>
    </section>
  );
}
