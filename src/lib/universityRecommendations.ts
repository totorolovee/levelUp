import type { AdmissionPortfolio } from './admissionPortfolio';
import { getIeltsTarget } from './ieltsTargets';
import { qsWorldRankings2027 } from './universityRankings';
import type { University } from './universities';

export type UniversityRecommendation = {
  university: University;
  chanceLow: number;
  chanceHigh: number;
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
    const rank = Number(qsWorldRankings2027[university.id] ?? 999);
    let chance = rank <= 5 ? 3 : rank <= 10 ? 5 : rank <= 20 ? 8
      : rank <= 40 ? 14 : rank <= 75 ? 22 : 34;
    const reasons: UniversityRecommendation['reasons'] = [];
    const target = getIeltsTarget(university.id);
    if (hasIelts && ielts >= target) {
      reasons.push({ ru: `IELTS ${portfolio.ielts} подходит`, en: `IELTS ${portfolio.ielts} meets the target` });
    } else if (hasIelts && ielts >= target - 0.5) {
      chance -= 3;
      reasons.push({ ru: `До IELTS-цели всего 0,5`, en: `Only 0.5 below the IELTS target` });
    } else if (hasIelts) {
      chance -= 7;
      reasons.push({ ru: 'IELTS пока ниже ориентира', en: 'IELTS is currently below the target' });
    }
    if (hasSat && university.testPolicy === 'required') {
      const sat = Number(portfolio.satScore);
      chance += sat >= 1500 ? 5 : sat >= 1400 ? 2 : sat < 1300 ? -3 : 0;
      reasons.push({ ru: `SAT ${portfolio.satScore} можно подать`, en: `SAT ${portfolio.satScore} can be submitted` });
    } else if (!hasSat && university.testPolicy === 'required') {
      chance -= 6;
      reasons.push({ ru: 'Для заявки ещё нужен SAT', en: 'SAT is still needed for the application' });
    } else if (university.testPolicy !== 'required') {
      reasons.push({ ru: 'SAT не является обязательным барьером', en: 'SAT is not a required barrier' });
    }
    if (portfolio.honors.trim()) {
      chance += 3;
      reasons.push({ ru: 'Есть honors и достижения', en: 'Honors and achievements are listed' });
    }
    const portfolioMajor = portfolio.major.toLocaleLowerCase();
    const currentMajor = selectedMajor.toLocaleLowerCase();
    if (portfolioMajor && (
      currentMajor.includes(portfolioMajor) || portfolioMajor.includes(currentMajor)
    )) {
      chance += 2;
      reasons.push({ ru: 'Major совпадает с выбранным', en: 'Major matches your selection' });
    }
    const chanceLow = Math.max(1, Math.min(55, Math.round(chance - 3)));
    const chanceHigh = Math.max(chanceLow + 2, Math.min(60, Math.round(chance + 3)));
    return { university, chanceLow, chanceHigh, reasons: reasons.slice(0, 2) };
  }).sort((first, second) =>
    second.chanceHigh - first.chanceHigh
    || Number(qsWorldRankings2027[first.university.id] ?? 999)
      - Number(qsWorldRankings2027[second.university.id] ?? 999),
  ).slice(0, 3);
}
