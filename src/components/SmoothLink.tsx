import { type MouseEvent, type ReactNode } from 'react';
import { useLocation } from 'wouter';

type SmoothLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function SmoothLink({ href, className, children }: SmoothLinkProps) {
  const [location, navigate] = useLocation();

  const followLink = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || location === href) return;
    event.preventDefault();
    document.documentElement.classList.add('is-leaving');
    window.setTimeout(() => {
      navigate(href);
      document.documentElement.classList.remove('is-leaving');
    }, 220);
  };

  return (
    <a className={className} href={href} onClick={followLink}>
      {children}
    </a>
  );
}
