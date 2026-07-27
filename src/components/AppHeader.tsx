import { useLocation } from 'wouter';
import { SmoothLink } from './SmoothLink';

const links = [
  { href: '/', label: 'Обзор', icon: '⌂' },
  { href: '/goals', label: 'Цели', icon: '◎' },
  { href: '/reading', label: 'Книги', icon: '▤' },
  { href: '/investing', label: 'Инвестиции', icon: '↗' },
  { href: '/journal', label: 'Журнал', icon: '◇' },
];

export function AppHeader() {
  const [location] = useLocation();

  return (
    <header className="app-header">
      <div className="brand-group">
        <SmoothLink className="brand" href="/">
          LevelUp<span>AI</span>
        </SmoothLink>
        <span className="creator-name">Kassenov Alimzhan</span>
      </div>
      <nav aria-label="Главная навигация">
        {links.map((link) => (
          <SmoothLink
            className={location === link.href ? 'nav-link active' : 'nav-link'}
            href={link.href}
            key={link.href}
          >
            <span aria-hidden="true">{link.icon}</span>
            {link.label}
          </SmoothLink>
        ))}
      </nav>
      <div className="sidebar-status">
        <span>●</span>
        <div>
          <small>Твой статус</small>
          <strong>Level 1</strong>
        </div>
      </div>
    </header>
  );
}
