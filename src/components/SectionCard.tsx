import { SmoothLink } from './SmoothLink';

type SectionCardProps = {
  icon: string;
  title: string;
  description: string;
  href?: string;
  accent: string;
};

export function SectionCard({
  icon,
  title,
  description,
  href,
  accent,
}: SectionCardProps) {
  const content = (
    <>
      <div className="section-icon" style={{ background: accent }}>
        {icon}
      </div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <span className="section-arrow">{href ? '→' : 'Скоро'}</span>
    </>
  );

  return href ? (
    <SmoothLink className="section-card" href={href}>
      {content}
    </SmoothLink>
  ) : (
    <article className="section-card muted">{content}</article>
  );
}
