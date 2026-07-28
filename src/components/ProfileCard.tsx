import type { UserProfile } from '../lib/profile';

export function ProfileCard({ profile }: { profile: UserProfile }) {
  const registrationDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(profile.registeredAt));

  return (
    <section className="profile-card">
      <div className="profile-identity">
        <div className="profile-avatar" aria-label={`Аватар ${profile.displayName}`}>
          {profile.avatarLetter}
        </div>
        <div>
          <p className="eyebrow">Профиль</p>
          <h2>{profile.displayName}</h2>
          <p>{profile.email}</p>
        </div>
      </div>
      <dl className="profile-stats">
        <div>
          <dt>Записей создано</dt>
          <dd>{profile.entriesCount}</dd>
        </div>
        <div>
          <dt>Дата регистрации</dt>
          <dd>{registrationDate}</dd>
        </div>
      </dl>
    </section>
  );
}
