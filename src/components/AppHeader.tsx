import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Link, useLocation } from 'wouter';
import { supabase } from '../lib/supabase';
import { useTheme } from '../lib/theme';
import { useLanguage } from '../lib/language';
import { getUserAvatarUrl } from '../lib/avatars';

const links = [
  { href: '/todos', ru: 'Задачи', en: 'Tasks' },
  { href: '/goals', ru: 'Цели', en: 'Goals' },
  { href: '/universities', ru: 'Вузы', en: 'Universities' },
  { href: '/reading', ru: 'Книги', en: 'Books' },
  { href: '/investing', ru: 'Инвестиции', en: 'Investing' },
  { href: '/journal', ru: 'Журнал', en: 'Journal' },
  { href: '/coach', ru: 'AI совет', en: 'AI advice' },
  { href: '/reflection', ru: 'Рефлексия', en: 'Reflection' },
  { href: '/leagues', ru: 'Лиги', en: 'Leagues' },
];

export function AppHeader() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => setIsMenuOpen(false), [location]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeWithEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeWithEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!user) {
      setAvatarUrl(null);
      return;
    }
    let isActive = true;
    void getUserAvatarUrl(user).then((url) => {
      if (isActive) setAvatarUrl(url);
    });
    return () => {
      isActive = false;
    };
  }, [user]);

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
        <button
          aria-label={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
          className="language-toggle"
          onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
          type="button"
        >
          {language === 'ru' ? 'EN' : 'RU'}
        </button>
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
        {user && <nav aria-label="Главная навигация" className={isMenuOpen ? 'mobile-open' : ''} ref={menuRef}>
          <button
            aria-label={isMenuOpen
              ? (language === 'ru' ? 'Закрыть меню' : 'Close menu')
              : (language === 'ru' ? 'Открыть меню' : 'Open menu')}
            aria-expanded={isMenuOpen}
            className="nav-trigger"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            <span className="hamburger-icon" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
          <div className="nav-menu" data-no-translate>
            <Link
              className={location === '/profile' ? 'nav-link nav-profile active' : 'nav-link nav-profile'}
              href="/profile"
            >
              <span aria-hidden="true">
                {avatarUrl
                  ? <img alt="" src={avatarUrl} />
                  : username?.charAt(0).toLocaleUpperCase('ru-RU')}
              </span>
              <strong>{username}</strong>
              <small>{language === 'ru' ? 'Профиль' : 'Profile'}</small>
            </Link>
            {links.map((link) => (
              <Link
                className={location === link.href ? 'nav-link active' : 'nav-link'}
                href={link.href}
                key={link.href}
              >
                {link[language]}
              </Link>
              ))}
          </div>
        </nav>}
      </div>
    </header>
  );
}
