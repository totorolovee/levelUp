import type { AdmissionPortfolio } from '../lib/admissionPortfolio';
import { useLanguage } from '../lib/language';
import { recommendUniversities } from '../lib/universityRecommendations';
import type { University } from '../lib/universities';
import { SmoothLink } from './SmoothLink';

type Props = {
  portfolio: AdmissionPortfolio;
  specialty: string;
  universities: University[];
  onSelect: (university: University) => void;
};

export function PortfolioUniversityMatches({
  portfolio,
  specialty,
  universities,
  onSelect,
}: Props) {
  const { language } = useLanguage();
  const isRussian = language === 'ru';
  const hasPortfolio = Boolean(
    portfolio.ielts || portfolio.satScore || portfolio.honors || portfolio.major,
  );
  const matches = recommendUniversities(universities, portfolio, specialty);

  return (
    <section className="portfolio-matches">
      <div className="portfolio-match-heading">
        <div>
          <p className="eyebrow">{isRussian ? 'По твоему портфолио' : 'Based on your portfolio'}</p>
          <h2>{isRussian ? 'Персональный подбор' : 'Personal matches'}</h2>
        </div>
        {portfolio.major && (
          <span>{isRussian ? 'Специальность' : 'Major'}: {portfolio.major}</span>
        )}
      </div>
      {!hasPortfolio ? (
        <p>
          {isRussian
            ? 'Заполни IELTS, SAT, награды и специальность в профиле, чтобы получить подбор.'
            : 'Add IELTS, SAT, honors, and major to get matches.'}
          {' '}<SmoothLink href="/profile">{isRussian ? 'Открыть портфолио →' : 'Open portfolio →'}</SmoothLink>
        </p>
      ) : (
        <div className="portfolio-match-grid">
          {matches.map(({ university, chanceLow, chanceHigh, reasons }) => (
            <button key={university.id} onClick={() => onSelect(university)} type="button">
              <span>≈ {chanceLow}–{chanceHigh}%</span>
              <strong>{university.shortName}</strong>
              <small>{reasons.map((reason) => reason[language]).join(' · ')}</small>
            </button>
          ))}
        </div>
      )}
      {hasPortfolio && (
        <small className="chance-disclaimer">
          {isRussian
            ? 'Ориентировочная оценка, не гарантия поступления: для точного расчёта нужны оценки, эссе и статистика конкретной программы.'
            : 'An estimate, not an admission guarantee. Grades, essays, and program-level data are needed for a fuller assessment.'}
        </small>
      )}
    </section>
  );
}
