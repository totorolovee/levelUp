import { useState } from 'react';
import type { UserProfile } from '../lib/profile';
import { updateCurrentUsername } from '../lib/profile';
import { useLanguage } from '../lib/language';
import { AvatarUploader } from './AvatarUploader';
import { supabase } from '../lib/supabase';
import { useLocation } from 'wouter';

type Props = {
  profile: UserProfile;
  onAvatarChange: (url: string) => void;
  onNameChange: (name: string, nextChangeAt: string) => void;
};

export function AccountSettings({ profile, onAvatarChange, onNameChange }: Props) {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState(profile.displayName);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isRussian = language === 'ru';
  const canChangeUsername = !profile.usernameChangeAvailableAt
    || new Date(profile.usernameChangeAvailableAt) <= new Date();
  const nextChangeDate = profile.usernameChangeAvailableAt
    ? new Intl.DateTimeFormat(isRussian ? 'ru-RU' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(profile.usernameChangeAvailableAt))
    : null;
  const registrationDate = new Intl.DateTimeFormat(isRussian ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(profile.registeredAt));

  const saveUsername = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const result = await updateCurrentUsername(username);
      onNameChange(result.displayName, result.nextChangeAt);
      setMessage(isRussian ? 'Username сохранён.' : 'Username saved.');
    } catch (error) {
      const isCooldown = error instanceof Error && error.message.includes('once every 14 days');
      setMessage(isCooldown
        ? isRussian ? 'Username можно менять только раз в 2 недели.' : 'Username can only be changed once every 2 weeks.'
        : error instanceof Error ? error.message : 'Could not save username.');
    } finally {
      setIsSaving(false);
    }
  };

  const signOut = async () => {
    setIsSaving(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(isRussian ? 'Не удалось выйти из аккаунта.' : 'Could not sign out.');
      setIsSaving(false);
      return;
    }
    setLocation('/');
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
              disabled={!canChangeUsername}
              onChange={(event) => setUsername(event.target.value)}
              value={username}
            />
            <button disabled={!canChangeUsername || isSaving || username.trim().length < 2} onClick={saveUsername} type="button">
              {isSaving ? '…' : isRussian ? 'Сохранить' : 'Save'}
            </button>
          </div>
          {!canChangeUsername && nextChangeDate && (
            <small>
              {isRussian ? `Следующее изменение: ${nextChangeDate}` : `Next change: ${nextChangeDate}`}
            </small>
          )}
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
      <button className="account-signout" disabled={isSaving} onClick={signOut} type="button">
        {isRussian ? 'Выйти из аккаунта' : 'Sign out'}
      </button>
    </section>
  );
}
