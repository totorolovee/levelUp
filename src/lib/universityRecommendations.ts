import type { AdmissionPortfolio } from './admissionPortfolio';
import { getIeltsTarget } from './ieltsTargets';
import { qsWorldRankings2027 } from './universityRankings';
import type { University } from './universities';

export type UniversityRecommendation = {
  university: University;
  score: number;
  reasons: { ru: string; en: string }[];
};

export function recommendUniversities(
  universities: University[],
  portfolio: AdmissionPortfolio,
  selectedMajor: string,
) {
  const ielts = Number(portfolio.ielts);
  const hasIelts = Number.isFinite(ielts) && portfolio.ielts !== '';
  const hasSat = Number(portfolio.satScore) >= 400;

  return universities.map((university): UniversityRecommendation => {
    let score = 0;
    const reasons: UniversityRecommendation['reasons'] = [];
    const target = getIeltsTarget(university.id);
    if (hasIelts && ielts >= target) {
      score += 45;
      reasons.push({ ru: `IELTS ${portfolio.ielts} подходит`, en: `IELTS ${portfolio.ielts} meets the target` });
    } else if (hasIelts && ielts >= target - 0.5) {
      score += 30;
      reasons.push({ ru: `До IELTS-цели всего 0,5`, en: `Only 0.5 below the IELTS target` });
    }
    if (hasSat && university.testPolicy === 'required') {
      score += 35;
      reasons.push({ ru: `SAT ${portfolio.satScore} можно подать`, en: `SAT ${portfolio.satScore} can be submitted` });
    } else if (university.testPolicy !== 'required') {
      score += 15;
      reasons.push({ ru: 'SAT не является обязательным барьером', en: 'SAT is not a required barrier' });
    }
    if (portfolio.honors.trim()) {
      score += 10;
      reasons.push({ ru: 'Есть honors и достижения', en: 'Honors and achievements are listed' });
    }
    const portfolioMajor = portfolio.major.toLocaleLowerCase();
    const currentMajor = selectedMajor.toLocaleLowerCase();
    if (portfolioMajor && (
      currentMajor.includes(portfolioMajor) || portfolioMajor.includes(currentMajor)
    )) {
      score += 10;
      reasons.push({ ru: 'Major совпадает с выбранным', en: 'Major matches your selection' });
    }
    return { university, score, reasons: reasons.slice(0, 2) };
  }).sort((first, second) =>
    second.score - first.score
    || Number(qsWorldRankings2027[first.university.id] ?? 999)
      - Number(qsWorldRankings2027[second.university.id] ?? 999),
  ).slice(0, 3);
}
