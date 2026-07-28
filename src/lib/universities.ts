import { asiaUniversities } from './universityCatalog/asiaUniversities';
import { ukUniversities } from './universityCatalog/ukUniversities';
import { usUniversities } from './universityCatalog/usUniversities';
import { australiaUniversities } from './universityCatalog/australiaUniversities';
import { europeUniversities } from './universityCatalog/europeUniversities';

export type TestPolicy = 'required' | 'not-considered' | 'course-dependent';
export type UniversityRegionId = 'usa' | 'uk' | 'asia' | 'australia' | 'europe';
export type UniversityDirectionId = 'technology' | 'business' | 'medicine' | 'humanities';

export type UniversityDirection = {
  id: UniversityDirectionId;
  name: string;
  description: string;
  universityIds: string[];
};

export type UniversityRegion = {
  id: UniversityRegionId;
  name: string;
  description: string;
  universities: University[];
};

export type University = {
  id: string;
  name: string;
  shortName: string;
  location: string;
  summary: string;
  testPolicy: TestPolicy;
  testNote?: string;
  englishNote: string;
  englishMinimum?: number;
  deadlines: string;
  documents: string[];
  opportunities: string[];
  sourceUrl: string;
  checkedAt: string;
};

export type StudentProfile = {
  ielts: string;
  hasSatOrAct: boolean;
  hasEssayDraft: boolean;
  hasRecommendations: boolean;
};

export type ReadinessItem = {
  label: string;
  detail: string;
  status: 'ready' | 'attention' | 'optional';
  points: number;
};

export const universities: University[] = [
  ...usUniversities,
  ...ukUniversities,
  ...asiaUniversities,
  ...australiaUniversities,
  ...europeUniversities,
];

export const universityRegions: UniversityRegion[] = [
  { id: 'usa', name: 'США', description: 'Stanford, MIT, Harvard', universities: usUniversities },
  { id: 'uk', name: 'Великобритания', description: 'Oxford, Cambridge, St Andrews', universities: ukUniversities },
  { id: 'asia', name: 'Азия', description: 'NUS, Tsinghua, UTokyo', universities: asiaUniversities },
  { id: 'australia', name: 'Австралия', description: 'Melbourne, Sydney, ANU', universities: australiaUniversities },
  { id: 'europe', name: 'Европа', description: 'ETH, EPFL, TUM, TU Delft', universities: europeUniversities },
];

export const newRegionUniversityIds = [
  'melbourne', 'sydney', 'anu', 'unsw',
  'eth-zurich', 'epfl', 'tum', 'tu-delft',
];

export const universityDirections: UniversityDirection[] = [
  {
    id: 'technology',
    name: 'Технологии',
    description: 'IT, инженерия и точные науки',
    universityIds: [
      'stanford', 'mit', 'berkeley', 'princeton', 'yale', 'caltech',
      'oxford', 'cambridge', 'imperial', 'edinburgh', 'manchester',
      'nus', 'ntu-singapore', 'tsinghua', 'tokyo', 'seoul-national', 'hku', 'hkust', 'kaist',
      ...newRegionUniversityIds,
    ],
  },
  {
    id: 'business',
    name: 'Бизнес',
    description: 'Экономика, финансы и управление',
    universityIds: [
      'stanford', 'mit', 'harvard', 'princeton', 'yale',
      'oxford', 'cambridge', 'imperial', 'st-andrews', 'edinburgh', 'lse', 'kings', 'manchester',
      'nus', 'ntu-singapore', 'tsinghua', 'tokyo', 'seoul-national', 'hku', 'hkust',
      ...newRegionUniversityIds,
    ],
  },
  {
    id: 'medicine',
    name: 'Медицина',
    description: 'Медицина и науки о здоровье',
    universityIds: [
      'stanford', 'harvard', 'berkeley', 'yale',
      'oxford', 'cambridge', 'imperial', 'st-andrews', 'edinburgh', 'kings', 'manchester',
      'nus', 'ntu-singapore', 'tsinghua', 'tokyo', 'seoul-national', 'hku', 'hkust',
      ...newRegionUniversityIds,
    ],
  },
  {
    id: 'humanities',
    name: 'Гуманитарные науки',
    description: 'Общество, языки и культура',
    universityIds: [
      'stanford', 'harvard', 'berkeley', 'princeton', 'yale',
      'oxford', 'cambridge', 'st-andrews', 'edinburgh', 'lse', 'kings', 'manchester',
      'nus', 'ntu-singapore', 'tsinghua', 'tokyo', 'seoul-national', 'hku', 'hkust',
      ...newRegionUniversityIds,
    ],
  },
];
