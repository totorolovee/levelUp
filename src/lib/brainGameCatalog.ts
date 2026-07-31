import type { BrainGameCategory } from './brainGameResults';

export type BrainGameId =
  | 'shade' | 'scan' | 'switch' | 'coffee'
  | 'reaction' | 'compare' | 'math'
  | 'sequence' | 'pairs' | 'pattern'
  | 'count' | 'focus-match' | 'direction' | 'sort'
  | 'missing' | 'reverse' | 'growing-matrix'
  | 'face-name'
  | 'number-pattern' | 'target-equation' | 'odd-rule' | 'path-planner' | 'rotation'
  | 'greater-expression' | 'multiplication' | 'number-path' | 'fractions' | 'missing-number';

export type BrainGameInfo = {
  id: BrainGameId;
  icon: string;
  ru: string;
  en: string;
  priority?: boolean;
};

export type BrainGameCategoryInfo = {
  id: BrainGameCategory;
  icon: string;
  ru: string;
  en: string;
  games: BrainGameInfo[];
};

export const brainGameCategories: BrainGameCategoryInfo[] = [
  {
    id: 'attention', icon: '◉', ru: 'Внимание', en: 'Attention',
    games: [
      { id: 'shade', icon: '◉', ru: 'Другой оттенок', en: 'Odd shade', priority: true },
      { id: 'scan', icon: '⌖', ru: 'Визуальный сканер', en: 'Visual scanner', priority: true },
      { id: 'switch', icon: '⇄', ru: 'Смена правил', en: 'Rule switch', priority: true },
      { id: 'coffee', icon: '☕', ru: 'Кофейная смена', en: 'Coffee shift', priority: true },
      { id: 'count', icon: '••', ru: 'Подсчёт целей', en: 'Target count' },
      { id: 'focus-match', icon: '＝', ru: 'Совпадение', en: 'Focus match' },
    ],
  },
  {
    id: 'memory', icon: '♙', ru: 'Память', en: 'Memory',
    games: [
      { id: 'sequence', icon: '123', ru: 'Цепочка чисел', en: 'Number chain', priority: true },
      { id: 'pairs', icon: '◆◆', ru: 'Найди пары', en: 'Match pairs', priority: true },
      { id: 'pattern', icon: '▦', ru: 'Запомни матрицу', en: 'Recall matrix', priority: true },
      { id: 'missing', icon: '?', ru: 'Пропавший предмет', en: 'Missing item' },
      { id: 'reverse', icon: '↩', ru: 'Цифры наоборот', en: 'Reverse digits' },
      { id: 'growing-matrix', icon: '▦+', ru: 'Растущая матрица', en: 'Growing matrix' },
      { id: 'face-name', icon: '◉+', ru: 'Лица и имена', en: 'Face–Name Recall', priority: true },
    ],
  },
  {
    id: 'speed', icon: '⚡', ru: 'Скорость', en: 'Speed',
    games: [
      { id: 'reaction', icon: '⚡', ru: 'Сигнал реакции', en: 'Reaction signal', priority: true },
      { id: 'compare', icon: '↔', ru: 'Быстрое сравнение', en: 'Quick compare', priority: true },
      { id: 'math', icon: '+', ru: 'Быстрый счёт', en: 'Rapid math', priority: true },
      { id: 'direction', icon: '↑', ru: 'Направление', en: 'Direction rush' },
      { id: 'sort', icon: '↕', ru: 'Быстрая сортировка', en: 'Quick sort' },
    ],
  },
  {
    id: 'logic', icon: '◇', ru: 'Логика', en: 'Logic',
    games: [
      { id: 'number-pattern', icon: '∴', ru: 'Числовой ряд', en: 'Number pattern' },
      { id: 'target-equation', icon: '?', ru: 'Знак операции', en: 'Missing operator' },
      { id: 'odd-rule', icon: '≠', ru: 'Лишнее число', en: 'Odd one out' },
      { id: 'path-planner', icon: '⌁', ru: 'Короткий маршрут', en: 'Path planner' },
      { id: 'rotation', icon: '↻', ru: 'Вращение фигур', en: 'Shape rotation' },
    ],
  },
  {
    id: 'math', icon: '∑', ru: 'Математика', en: 'Math',
    games: [
      { id: 'greater-expression', icon: '>', ru: 'Что больше', en: 'Greater value' },
      { id: 'multiplication', icon: '×', ru: 'Умножение', en: 'Multiplication' },
      { id: 'number-path', icon: '→', ru: 'Числовой путь', en: 'Number path' },
      { id: 'fractions', icon: '½', ru: 'Сравнение дробей', en: 'Compare fractions' },
      { id: 'missing-number', icon: '…', ru: 'Пропущенное число', en: 'Missing number' },
    ],
  },
];

export function getBrainGameInfo(id: BrainGameId) {
  return brainGameCategories.flatMap((category) => category.games)
    .find((game) => game.id === id);
}

export function getBrainGameCategory(id: BrainGameId) {
  return brainGameCategories.find((category) =>
    category.games.some((game) => game.id === id))?.id ?? 'attention';
}
