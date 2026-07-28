import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Link, useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { useTheme } from '../lib/theme';

const links = [
  { href: '/goals', label: 'Цели' },
  { href: '/universities', label: 'Вузы' },
  { href: '/reading', label: 'Книги' },
  { href: '/investing', label: 'Инвестиции' },
  { href: '/journal', label: 'Журнал' },
  { href: '/coach', label: 'AI совет' },
  { href: '/login', label: 'Вход' },
];

export function AppHeader() {
  const [location] = useLocation();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const metadataUsername = user?.user_metadata.display_name
    ?? user?.user_metadata.user_name
    ?? user?.user_metadata.full_name;
  const username = typeof metadataUsername === 'string' && metadataUsername.trim()
    ? metadataUsername.trim()
    : user?.email?.split('@')[0];

  return (
    <header className="app-header">
      <div className="brand-group">
        <Link className="brand" href="/">
          LevelUp<span>AI</span>
        </Link>
        <span className="creator-name">Kassenov Alimzhan</span>
      </div>
      <div className="header-actions">
        {user === null && (
          <Link className="header-login" href="/login">
            Войти
          </Link>
        )}
        {user && (
          <Link className="header-username" href="/profile">
            <span aria-hidden="true">{username?.charAt(0).toLocaleUpperCase('ru-RU')}</span>
            {username}
          </Link>
        )}
        <button
          aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
          type="button"
        >
          <span aria-hidden="true" className="theme-icon sun">☀</span>
          <span aria-hidden="true" className="theme-icon moon">☾</span>
          <span aria-hidden="true" className="theme-thumb" />
        </button>
        <nav aria-label="Главная навигация">
          <button className="nav-trigger" type="button">
            Разделы <span>←</span>
          </button>
          <div className="nav-menu">
            {links
              .filter((link) => link.href !== '/login' || user === null)
              .map((link) => (
              <Link
                className={location === link.href ? 'nav-link active' : 'nav-link'}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
              ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
