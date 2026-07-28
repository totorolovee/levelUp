import { businessBooks } from './bookCatalog/businessBooks';
import { fantasyBooks } from './bookCatalog/fantasyBooks';
import { growthBooks } from './bookCatalog/growthBooks';
import { mysteryBooks } from './bookCatalog/mysteryBooks';

export type BookCategory = 'business' | 'fantasy' | 'mystery' | 'growth';

export type Book = {
  category: BookCategory;
  title: string;
  author: string;
  topic: string;
  description: string;
  overview: string;
  takeaway: string;
  color: string;
  coverUrl?: string;
};

export const bookCategories = [
  { id: 'business', title: 'Бизнес и большие идеи', description: 'Истории компаний, создателей и смелых решений', icon: '↗' },
  { id: 'fantasy', title: 'Фэнтези и приключения', description: 'Необычные миры, путешествия и герои', icon: '✦' },
  { id: 'mystery', title: 'Детективы и триллеры', description: 'Загадки, расследования и напряжённые истории', icon: '⌕' },
  { id: 'growth', title: 'Саморазвитие', description: 'Привычки, мышление и полезные навыки', icon: '◎' },
] satisfies { id: BookCategory; title: string; description: string; icon: string }[];

export const books: Book[] = [
  ...businessBooks,
  ...fantasyBooks,
  ...mysteryBooks,
  ...growthBooks,
];
