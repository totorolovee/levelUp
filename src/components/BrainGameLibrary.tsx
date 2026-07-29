import type { BrainFocus } from '../lib/brainTrainingProfile';

export type BrainGameId =
  | 'shade' | 'scan' | 'switch'
  | 'reaction' | 'compare' | 'math'
  | 'sequence' | 'pairs' | 'pattern';

type Props = {
  focus: BrainFocus;
  isRussian: boolean;
  onSelect: (id: BrainGameId, category: BrainFocus) => void;
};

const categories: {
  id: BrainFocus;
  ru: string;
  en: string;
  games: { id: BrainGameId; icon: string; ru: string; en: string }[];
}[] = [
  {
    id: 'attention', ru: 'Игры на внимание', en: 'Attention games',
    games: [
      { id: 'shade', icon: '◉', ru: 'Другой оттенок', en: 'Odd shade' },
      { id: 'scan', icon: '⌖', ru: 'Визуальный сканер', en: 'Visual scanner' },
      { id: 'switch', icon: '⇄', ru: 'Смена правил', en: 'Rule switch' },
    ],
  },
  {
    id: 'speed', ru: 'Игры на скорость', en: 'Speed games',
    games: [
      { id: 'reaction', icon: '⚡', ru: 'Сигнал реакции', en: 'Reaction signal' },
      { id: 'compare', icon: '↔', ru: 'Быстрое сравнение', en: 'Quick compare' },
      { id: 'math', icon: '+', ru: 'Быстрый счёт', en: 'Rapid math' },
    ],
  },
  {
    id: 'memory', ru: 'Игры на память', en: 'Memory games',
    games: [
      { id: 'sequence', icon: '123', ru: 'Цепочка чисел', en: 'Number chain' },
      { id: 'pairs', icon: '◆◆', ru: 'Найди пары', en: 'Match pairs' },
      { id: 'pattern', icon: '▦', ru: 'Запомни матрицу', en: 'Recall matrix' },
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
            <strong>3</strong>
          </header>
          <div>
            {category.games.map((game) => (
              <button key={game.id} onClick={() => onSelect(game.id, category.id)} type="button">
                <span>{game.icon}</span>
                <strong>{isRussian ? game.ru : game.en}</strong>
                <small>{isRussian ? 'Играть →' : 'Play →'}</small>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
