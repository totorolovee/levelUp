import type { BrainFocus } from '../lib/brainTrainingProfile';

export type BrainGameId =
  | 'shade' | 'scan' | 'switch'
  | 'reaction' | 'compare' | 'math'
  | 'sequence' | 'pairs' | 'pattern'
  | 'count' | 'focus-match' | 'direction' | 'sort'
  | 'missing' | 'reverse' | 'growing-matrix';

type Props = {
  focus: BrainFocus;
  isRussian: boolean;
  onSelect: (id: BrainGameId, category: BrainFocus) => void;
};

const categories: {
  id: BrainFocus;
  ru: string;
  en: string;
  games: { id: BrainGameId; icon: string; ru: string; en: string; priority?: boolean }[];
}[] = [
  {
    id: 'attention', ru: 'Игры на внимание', en: 'Attention games',
    games: [
      { id: 'shade', icon: '◉', ru: 'Другой оттенок', en: 'Odd shade', priority: true },
      { id: 'scan', icon: '⌖', ru: 'Визуальный сканер', en: 'Visual scanner', priority: true },
      { id: 'switch', icon: '⇄', ru: 'Смена правил', en: 'Rule switch', priority: true },
      { id: 'count', icon: '••', ru: 'Подсчёт целей', en: 'Target count' },
      { id: 'focus-match', icon: '＝', ru: 'Совпадение', en: 'Focus match' },
    ],
  },
  {
    id: 'speed', ru: 'Игры на скорость', en: 'Speed games',
    games: [
      { id: 'reaction', icon: '⚡', ru: 'Сигнал реакции', en: 'Reaction signal', priority: true },
      { id: 'compare', icon: '↔', ru: 'Быстрое сравнение', en: 'Quick compare', priority: true },
      { id: 'math', icon: '+', ru: 'Быстрый счёт', en: 'Rapid math', priority: true },
      { id: 'direction', icon: '↑', ru: 'Направление', en: 'Direction rush' },
      { id: 'sort', icon: '↕', ru: 'Быстрая сортировка', en: 'Quick sort' },
    ],
  },
  {
    id: 'memory', ru: 'Игры на память', en: 'Memory games',
    games: [
      { id: 'sequence', icon: '123', ru: 'Цепочка чисел', en: 'Number chain', priority: true },
      { id: 'pairs', icon: '◆◆', ru: 'Найди пары', en: 'Match pairs', priority: true },
      { id: 'pattern', icon: '▦', ru: 'Запомни матрицу', en: 'Recall matrix', priority: true },
      { id: 'missing', icon: '?', ru: 'Пропавший предмет', en: 'Missing item' },
      { id: 'reverse', icon: '↩', ru: 'Цифры наоборот', en: 'Reverse digits' },
      { id: 'growing-matrix', icon: '▦+', ru: 'Растущая матрица', en: 'Growing matrix' },
    ],
  },
];

export function BrainGameLibrary({ focus, isRussian, onSelect }: Props) {
  return (
    <div className="brain-game-library">
      {categories.map((category) => (
        <section className={focus === category.id ? 'recommended' : ''} key={category.id}>
          <header>
            <div>
              <h2>{isRussian ? category.ru : category.en}</h2>
              {focus === category.id && <span>{isRussian ? 'Твой акцент' : 'Your focus'}</span>}
            </div>
            <strong>{category.games.length}</strong>
          </header>
          <div>
            {category.games.map((game) => (
              <button
                className={focus === category.id && game.priority ? 'priority-game' : ''}
                key={game.id}
                onClick={() => onSelect(game.id, category.id)}
                type="button"
              >
                <span>{game.icon}</span>
                <strong>{isRussian ? game.ru : game.en}</strong>
                <small>{focus === category.id && game.priority
                  ? (isRussian ? '★ Приоритет для тебя' : '★ Priority for you')
                  : (isRussian ? 'Уровни · Играть →' : 'Levels · Play →')}</small>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
