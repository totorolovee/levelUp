import { Link, useLocation } from 'wouter';
import { useTheme } from '../lib/theme';

const links = [
  { href: '/goals', label: 'Цели' },
  { href: '/universities', label: 'Вузы' },
  { href: '/reading', label: 'Книги' },
  { href: '/investing', label: 'Инвестиции' },
  { href: '/journal', label: 'Журнал' },
  { href: '/coach', label: 'AI совет' },
  { href: '/login', label: 'Вход' },
  { href: '/profile', label: 'Профиль' },
];

export function AppHeader() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="brand-group">
        <Link className="brand" href="/">
          LevelUp<span>AI</span>
        </Link>
        <span className="creator-name">Kassenov Alimzhan</span>
      </div>
      <div className="header-actions">
        <Link className="header-login" href="/login">
          Войти
        </Link>
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
            {links.map((link) => (
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
