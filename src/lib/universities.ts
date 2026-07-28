import { asiaUniversities } from './universityCatalog/asiaUniversities';
import { getIeltsReadiness, getIeltsTarget } from './ieltsTargets';
import { ukUniversities } from './universityCatalog/ukUniversities';
import { usUniversities } from './universityCatalog/usUniversities';

export type TestPolicy = 'required' | 'not-considered' | 'course-dependent';
export type UniversityRegionId = 'usa' | 'uk' | 'asia';
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

export const universities: University[] = [...usUniversities, ...ukUniversities, ...asiaUniversities];

export const universityRegions: UniversityRegion[] = [
  { id: 'usa', name: 'США', description: 'Stanford, MIT, Harvard', universities: usUniversities },
  { id: 'uk', name: 'Великобритания', description: 'Oxford, Cambridge, St Andrews', universities: ukUniversities },
  { id: 'asia', name: 'Азия', description: 'NUS, Tsinghua, UTokyo', universities: asiaUniversities },
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
    ],
  },
];

export function assessReadiness(university: University, profile: StudentProfile): ReadinessItem[] {
  const ielts = Number(profile.ielts);
  const items: ReadinessItem[] = [];

  if (university.testPolicy === 'required') {
    items.push({
      label: 'SAT или ACT',
      detail: profile.hasSatOrAct ? 'Результат уже есть.' : 'Нужно запланировать подготовку и сдачу.',
      status: profile.hasSatOrAct ? 'ready' : 'attention',
      points: profile.hasSatOrAct ? 25 : 0,
    });
  } else if (university.testPolicy === 'not-considered') {
    items.push({ label: 'SAT или ACT', detail: 'Не учитывается при поступлении.', status: 'optional', points: 0 });
  } else {
    items.push({
      label: 'Вступительный тест',
      detail: university.testNote ?? 'Зависит от выбранной программы — проверь страницу курса.',
      status: 'optional',
      points: 0,
    });
  }

  const ieltsTarget = getIeltsTarget(university.id);
  const ieltsReadiness = getIeltsReadiness(ielts, ieltsTarget);
  items.push({
    label: `IELTS: нужен ${ieltsTarget.toFixed(1)}`,
    detail: profile.ielts
      ? `Твой IELTS ${profile.ielts}: готовность к IELTS — ${ieltsReadiness}%.`
      : `Введи результат. Ориентир для этого вуза — ${ieltsTarget.toFixed(1)}.`,
    status: ieltsReadiness >= 90 ? 'ready' : 'attention',
    points: ieltsReadiness * 0.25,
  });

  items.push({
    label: 'Эссе',
    detail: profile.hasEssayDraft ? 'Черновик уже начат.' : 'Начни с истории о себе и своей мотивации.',
    status: profile.hasEssayDraft ? 'ready' : 'attention',
    points: profile.hasEssayDraft ? 25 : 0,
  });
  items.push({
    label: 'Рекомендации',
    detail: profile.hasRecommendations ? 'Учителя выбраны.' : 'Выбери учителей и предупреди их заранее.',
    status: profile.hasRecommendations ? 'ready' : 'attention',
    points: profile.hasRecommendations ? 25 : 0,
  });

  return items;
}
