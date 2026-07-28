import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { ProfileCard } from '../components/ProfileCard';
import { SmoothLink } from '../components/SmoothLink';
import { loadCurrentProfile, type UserProfile } from '../lib/profile';

type ProfileState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'error' }
  | { status: 'ready'; profile: UserProfile };

export function ProfilePage() {
  const [state, setState] = useState<ProfileState>({ status: 'loading' });

  useEffect(() => {
    let isActive = true;

    loadCurrentProfile()
      .then((profile) => {
        if (!isActive) return;
        setState(profile ? { status: 'ready', profile } : { status: 'guest' });
      })
      .catch(() => {
        if (isActive) setState({ status: 'error' });
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro">
        <div>
          <p className="eyebrow">Мой LevelUp</p>
          <h1>Твой прогресс в одном месте.</h1>
          <p>Данные профиля загружаются из твоего аккаунта Supabase.</p>
        </div>
      </section>
      {state.status === 'loading' && <p className="profile-status">Загружаю профиль…</p>}
      {state.status === 'error' && <p className="coach-error">Не удалось загрузить профиль.</p>}
      {state.status === 'guest' && (
        <section className="empty-state">
          <h2>Сначала войди в аккаунт</h2>
          <p>После входа здесь появятся email и личная статистика.</p>
          <SmoothLink className="primary-link" href="/login">Войти</SmoothLink>
        </section>
      )}
      {state.status === 'ready' && <ProfileCard profile={state.profile} />}
    </main>
  );
}
