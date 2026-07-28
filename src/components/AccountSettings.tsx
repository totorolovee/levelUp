import { useState } from 'react';
import type { UserProfile } from '../lib/profile';
import { updateCurrentUsername } from '../lib/profile';
import { useLanguage } from '../lib/language';
import { AvatarUploader } from './AvatarUploader';

type Props = {
  profile: UserProfile;
  onAvatarChange: (url: string) => void;
  onNameChange: (name: string) => void;
};

export function AccountSettings({ profile, onAvatarChange, onNameChange }: Props) {
  const { language } = useLanguage();
  const [username, setUsername] = useState(profile.displayName);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isRussian = language === 'ru';
  const registrationDate = new Intl.DateTimeFormat(isRussian ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(profile.registeredAt));

  const saveUsername = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const savedName = await updateCurrentUsername(username);
      onNameChange(savedName);
      setMessage(isRussian ? 'Username сохранён.' : 'Username saved.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save username.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="account-settings">
      <div className="profile-identity">
        <div className="profile-avatar" aria-label={`Аватар ${profile.displayName}`}>
          {profile.avatarUrl ? <img alt="" src={profile.avatarUrl} /> : profile.avatarLetter}
        </div>
        <div>
          <h2>{isRussian ? 'Фото профиля' : 'Profile photo'}</h2>
          <AvatarUploader onUploaded={onAvatarChange} />
        </div>
      </div>
      <div className="settings-fields">
        <label>
          Username
          <div>
            <input
              maxLength={30}
              minLength={2}
              onChange={(event) => setUsername(event.target.value)}
              value={username}
            />
            <button disabled={isSaving || username.trim().length < 2} onClick={saveUsername} type="button">
              {isSaving ? '…' : isRussian ? 'Сохранить' : 'Save'}
            </button>
          </div>
        </label>
        <label>
          Email
          <input disabled value={profile.email} />
        </label>
        <label>
          {isRussian ? 'Дата регистрации' : 'Registration date'}
          <input disabled value={registrationDate} />
        </label>
        {message && <p className="settings-message">{message}</p>}
      </div>
    </section>
  );
}
