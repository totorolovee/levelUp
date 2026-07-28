import type { Language } from './language';
import type { UniversityDirectionId } from './universities';
import type { University, UniversityRegionId } from './universities';
import type { UniversitySpecialty } from './universitySpecialties';

const directions: Record<UniversityDirectionId, { name: string; description: string }> = {
  technology: {
    name: 'Technology',
    description: 'IT, engineering, and exact sciences',
  },
  business: {
    name: 'Business',
    description: 'Economics, finance, and management',
  },
  medicine: {
    name: 'Medicine',
    description: 'Medicine and health sciences',
  },
  humanities: {
    name: 'Humanities',
    description: 'Society, languages, and culture',
  },
};

const specialties: Record<string, { name: string; description: string }> = {
  'computer-science': { name: 'Computer Science', description: 'Programming and AI' },
  engineering: { name: 'Engineering', description: 'Building technology' },
  'natural-sciences': { name: 'Natural Sciences', description: 'Physics, chemistry, and biology' },
  economics: { name: 'Economics', description: 'Markets and society' },
  finance: { name: 'Finance', description: 'Investing and analytics' },
  management: { name: 'Management', description: 'Business and management' },
  medicine: { name: 'Medicine', description: 'Medical training' },
  biomedicine: { name: 'Biomedicine', description: 'Health science' },
  psychology: { name: 'Psychology', description: 'Behavior and thinking' },
  law: { name: 'Law', description: 'Law and legal systems' },
  'international-relations': {
    name: 'International Relations',
    description: 'Politics and diplomacy',
  },
  literature: { name: 'Literature and Languages', description: 'Texts, language, and culture' },
};

const regions: Record<UniversityRegionId, string> = {
  usa: 'USA',
  uk: 'United Kingdom',
  asia: 'Asia',
  australia: 'Australia',
  europe: 'Europe',
};

const bachelorLanguageNotes: Record<string, string> = {
  'eth-zurich': 'Bachelor’s programs are mainly taught in German; German C1 may be required.',
  epfl: 'Most Bachelor’s courses are taught in French; check the program’s language rules.',
  tum: 'German and/or English proof is required depending on the selected program.',
  'tu-delft': 'The teaching language and required proof depend on the selected Bachelor’s program.',
};

export function getDirectionTranslation(id: UniversityDirectionId, language: Language) {
  return language === 'en' ? directions[id] : null;
}

export function getSpecialtyTranslation(
  specialty: UniversitySpecialty,
  language: Language,
) {
  return language === 'en' ? specialties[specialty.id] ?? null : null;
}

export function getRegionName(id: UniversityRegionId, fallback: string, language: Language) {
  return language === 'en' ? regions[id] : fallback;
}

export function getUniversityContent(university: University, language: Language) {
  if (language === 'ru') return university;
  const location = university.location
    .replace('США', 'USA')
    .replace('Великобритания', 'United Kingdom')
    .replace('Сингапур', 'Singapore')
    .replace('Китай', 'China')
    .replace('Япония', 'Japan')
    .replace('Южная Корея', 'South Korea')
    .replace('Австралия', 'Australia')
    .replace('Швейцария', 'Switzerland')
    .replace('Германия', 'Germany')
    .replace('Нидерланды', 'Netherlands');

  return {
    ...university,
    location,
    summary: `${university.name} offers undergraduate study across its specialist fields.`,
    testNote: 'Academic and test requirements depend on your qualification and chosen program.',
    englishNote: bachelorLanguageNotes[university.id]
      ?? 'Check the accepted English evidence and required score for your chosen program.',
    deadlines: 'Application dates vary by program and intake. Check the official page before applying.',
    documents: [
      'Online application',
      'School certificate and transcript',
      'Language evidence',
      'Program-specific documents',
    ],
    opportunities: ['Research', 'Student projects', 'International opportunities'],
    checkedAt: 'July 28, 2026',
  };
}
