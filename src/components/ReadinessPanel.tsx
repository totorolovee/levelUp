import { useState } from 'react';
import { EssayDetails } from './EssayDetails';
import { assessReadiness, type StudentProfile, type University } from '../lib/universities';

export function ReadinessPanel({
  profile,
  specialty,
  university,
}: {
  profile: StudentProfile;
  specialty: string;
  university: University;
}) {
  const [isEssayOpen, setIsEssayOpen] = useState(false);
  const items = assessReadiness(university, profile);
  const score = Math.round(items.reduce((total, item) => total + item.points, 0));
  const nextStep = items.find((item) => item.status === 'attention');

  return (
    <section className="readiness-panel">
      <div className="readiness-heading">
        <div>
          <p className="eyebrow">Персональный разбор</p>
          <h2>Готовность к {university.shortName}</h2>
          <small className="readiness-specialty">{specialty}</small>
        </div>
        <strong>{score}%</strong>
      </div>
      <div className="readiness-items">
        {items.map((item) => {
          const isEssay = item.label === 'Эссе';
          const content = (
            <>
              <span>{item.status === 'ready' ? '✓' : item.status === 'attention' ? '!' : 'i'}</span>
              <div>
                <strong>{item.label}{isEssay ? ' →' : ''}</strong>
                <p>{item.detail}</p>
              </div>
            </>
          );

          return isEssay ? (
            <button
              aria-expanded={isEssayOpen}
              className={`readiness-item essay-trigger ${item.status}`}
              key={item.label}
              onClick={() => setIsEssayOpen((isOpen) => !isOpen)}
              type="button"
            >
              {content}
            </button>
          ) : (
            <article className={`readiness-item ${item.status}`} key={item.label}>{content}</article>
          );
        })}
      </div>
      {isEssayOpen && <EssayDetails specialty={specialty} university={university} />}
      <div className="admission-next-step">
        <span>Следующий лучший шаг</span>
        <p>{nextStep?.detail ?? 'Проверь дедлайн и начни собирать финальный пакет документов.'}</p>
      </div>
    </section>
  );
}
