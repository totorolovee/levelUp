import type { Language } from './language';
import type { UniversityDirectionId } from './universities';
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

export function getDirectionTranslation(id: UniversityDirectionId, language: Language) {
  return language === 'en' ? directions[id] : null;
}

export function getSpecialtyTranslation(
  specialty: UniversitySpecialty,
  language: Language,
) {
  return language === 'en' ? specialties[specialty.id] ?? null : null;
}
