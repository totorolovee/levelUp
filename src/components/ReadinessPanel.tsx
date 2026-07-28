import { useState } from 'react';
import { EssayDetails } from './EssayDetails';
import type { StudentProfile, University } from '../lib/universities';
import { assessReadiness } from '../lib/universityReadiness';
import { useLanguage } from '../lib/language';
import { SatDetails } from './SatDetails';

export function ReadinessPanel({
  profile,
  specialty,
  university,
}: {
  profile: StudentProfile;
  specialty: string;
  university: University;
}) {
  const { language } = useLanguage();
  const [openDetail, setOpenDetail] = useState<'essay' | 'sat' | null>(null);
  const items = assessReadiness(university, profile, language);
  const score = Math.round(items.reduce((total, item) => total + item.points, 0));
  const nextStep = items.find((item) => item.status === 'attention');

  return (
    <section className="readiness-panel">
      <div className="readiness-heading">
        <div>
          <p className="eyebrow">Персональный разбор</p>
          <h2>
            {language === 'ru'
              ? `Готовность к ${university.shortName}`
              : `Readiness for ${university.shortName}`}
          </h2>
          <small className="readiness-specialty">{specialty}</small>
        </div>
        <strong>{score}%</strong>
      </div>
      <div className="readiness-items">
        {items.map((item) => {
          const isEssay = item.label === 'Эссе' || item.label === 'Essay';
          const isSat = item.label.includes('SAT');
          const content = (
            <>
              <span>{item.status === 'ready' ? '✓' : item.status === 'attention' ? '!' : 'i'}</span>
              <div>
                <strong>{item.label}{isEssay || isSat ? ' →' : ''}</strong>
                <p>{item.detail}</p>
              </div>
            </>
          );

          return isEssay || isSat ? (
            <button
              aria-expanded={openDetail === (isEssay ? 'essay' : 'sat')}
              className={`readiness-item essay-trigger ${item.status}`}
              key={item.label}
              onClick={() => {
                const detail = isEssay ? 'essay' : 'sat';
                setOpenDetail((current) => current === detail ? null : detail);
              }}
              type="button"
            >
              {content}
            </button>
          ) : (
            <article className={`readiness-item ${item.status}`} key={item.label}>{content}</article>
          );
        })}
      </div>
      {openDetail === 'essay' && (
        <EssayDetails specialty={specialty} university={university} />
      )}
      {openDetail === 'sat' && <SatDetails />}
      <div className="admission-next-step">
        <span>{language === 'ru' ? 'Следующий лучший шаг' : 'Next best step'}</span>
        <p>
          {nextStep?.detail ?? (
            language === 'ru'
              ? 'Проверь дедлайн и начни собирать финальный пакет документов.'
              : 'Check the deadline and start assembling the final application package.'
          )}
        </p>
      </div>
    </section>
  );
}
