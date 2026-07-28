import type { UniversityDirectionId } from './universities';

export type UniversitySpecialty = {
  id: string;
  directionId: UniversityDirectionId;
  name: string;
  description: string;
  universityIds: string[];
};

const broad = [
  'stanford', 'mit', 'harvard', 'berkeley', 'princeton', 'yale',
  'oxford', 'cambridge', 'imperial', 'st-andrews', 'edinburgh', 'manchester',
  'nus', 'ntu-singapore', 'tsinghua', 'tokyo', 'seoul-national', 'hku', 'hkust',
];

export const universitySpecialties: UniversitySpecialty[] = [
  {
    id: 'computer-science',
    directionId: 'technology',
    name: 'Computer Science',
    description: 'Программирование и AI',
    universityIds: [
      'stanford', 'mit', 'berkeley', 'princeton', 'caltech',
      'oxford', 'cambridge', 'imperial', 'edinburgh', 'manchester',
      'nus', 'ntu-singapore', 'tsinghua', 'tokyo', 'seoul-national', 'hku', 'hkust', 'kaist',
    ],
  },
  { id: 'engineering', directionId: 'technology', name: 'Инженерия', description: 'Создание технологий', universityIds: [...broad, 'caltech', 'kaist'] },
  { id: 'natural-sciences', directionId: 'technology', name: 'Естественные науки', description: 'Физика, химия, биология', universityIds: [...broad, 'caltech', 'kaist'] },
  { id: 'economics', directionId: 'business', name: 'Экономика', description: 'Рынки и общество', universityIds: [...broad, 'lse', 'kings'] },
  { id: 'finance', directionId: 'business', name: 'Финансы', description: 'Инвестиции и аналитика', universityIds: ['mit', 'harvard', 'princeton', 'yale', 'oxford', 'cambridge', 'imperial', 'lse', 'kings', 'manchester', 'nus', 'ntu-singapore', 'tsinghua', 'hku', 'hkust'] },
  { id: 'management', directionId: 'business', name: 'Менеджмент', description: 'Бизнес и управление', universityIds: ['stanford', 'mit', 'harvard', 'berkeley', 'imperial', 'lse', 'kings', 'manchester', 'nus', 'ntu-singapore', 'tsinghua', 'seoul-national', 'hku', 'hkust'] },
  { id: 'medicine', directionId: 'medicine', name: 'Medicine', description: 'Подготовка врача', universityIds: ['stanford', 'harvard', 'yale', 'oxford', 'cambridge', 'imperial', 'st-andrews', 'edinburgh', 'kings', 'manchester', 'nus', 'ntu-singapore', 'tsinghua', 'tokyo', 'seoul-national', 'hku'] },
  { id: 'biomedicine', directionId: 'medicine', name: 'Биомедицина', description: 'Наука о здоровье', universityIds: [...broad, 'kings', 'kaist'] },
  { id: 'psychology', directionId: 'medicine', name: 'Психология', description: 'Поведение и мышление', universityIds: ['stanford', 'harvard', 'berkeley', 'princeton', 'yale', 'oxford', 'cambridge', 'st-andrews', 'edinburgh', 'kings', 'manchester', 'nus', 'ntu-singapore', 'tokyo', 'seoul-national', 'hku'] },
  { id: 'law', directionId: 'humanities', name: 'Право', description: 'Law и правовые системы', universityIds: ['stanford', 'harvard', 'berkeley', 'yale', 'oxford', 'cambridge', 'edinburgh', 'lse', 'kings', 'manchester', 'nus', 'tsinghua', 'tokyo', 'seoul-national', 'hku'] },
  { id: 'international-relations', directionId: 'humanities', name: 'Международные отношения', description: 'Политика и дипломатия', universityIds: ['stanford', 'harvard', 'berkeley', 'princeton', 'yale', 'oxford', 'cambridge', 'st-andrews', 'edinburgh', 'lse', 'kings', 'manchester', 'nus', 'ntu-singapore', 'tsinghua', 'tokyo', 'seoul-national', 'hku'] },
  { id: 'literature', directionId: 'humanities', name: 'Литература и языки', description: 'Тексты, язык и культура', universityIds: ['stanford', 'harvard', 'berkeley', 'princeton', 'yale', 'oxford', 'cambridge', 'st-andrews', 'edinburgh', 'kings', 'manchester', 'nus', 'ntu-singapore', 'tsinghua', 'tokyo', 'seoul-national', 'hku'] },
];
