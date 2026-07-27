import { useLocation } from 'wouter';
import { SmoothLink } from './SmoothLink';

const links = [
  { href: '/', label: 'Обзор' },
  { href: '/goals', label: 'Цели' },
  { href: '/reading', label: 'Книги' },
  { href: '/investing', label: 'Инвестиции' },
  { href: '/journal', label: 'Журнал' },
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
            {link.label}
          </SmoothLink>
        ))}
      </nav>
    </header>
  );
}
