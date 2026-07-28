import type { UserProfile } from '../lib/profile';
import { useState } from 'react';
import { useLanguage } from '../lib/language';
import { AchievementsGrid } from './AchievementsGrid';
import { AccountSettings } from './AccountSettings';
import { ProfileProgress } from './ProfileProgress';
import { AdmissionPortfolio } from './AdmissionPortfolio';

export function ProfileCard({
  profile,
  onAvatarChange,
  onNameChange,
}: {
  profile: UserProfile;
  onAvatarChange: (url: string) => void;
  onNameChange: (name: string, nextChangeAt: string) => void;
}) {
  const { language } = useLanguage();
  const [tab, setTab] = useState<'settings' | 'progress' | 'achievements' | 'portfolio'>('settings');
  const isRussian = language === 'ru';

  return (
    <section className="profile-card">
      <div className="profile-tabs">
        <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')} type="button">
          {isRussian ? 'Настройки' : 'Settings'}
        </button>
        <button className={tab === 'progress' ? 'active' : ''} onClick={() => setTab('progress')} type="button">
          {isRussian ? 'Прогресс' : 'Progress'}
        </button>
        <button className={tab === 'achievements' ? 'active' : ''} onClick={() => setTab('achievements')} type="button">
          {isRussian ? 'Достижения' : 'Achievements'}
        </button>
        <button className={tab === 'portfolio' ? 'active' : ''} onClick={() => setTab('portfolio')} type="button">
          {isRussian ? 'Портфолио' : 'Portfolio'}
        </button>
      </div>
      {tab === 'settings' && (
        <AccountSettings profile={profile} onAvatarChange={onAvatarChange} onNameChange={onNameChange} />
      )}
      {tab === 'progress' && <ProfileProgress profile={profile} />}
      {tab === 'achievements' && <AchievementsGrid progress={profile.achievements} />}
      {tab === 'portfolio' && <AdmissionPortfolio />}
    </section>
  );
}
