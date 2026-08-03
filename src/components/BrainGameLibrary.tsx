import type { BrainFocus } from '../lib/brainTrainingProfile';
import type { BrainGameCategory, BrainGameProgress } from '../lib/brainGameResults';
import {
  brainGameCategories,
  type BrainGameId,
} from '../lib/brainGameCatalog';
import { getBrainGameDescription } from '../lib/brainGameDescriptions';
import { HorizontalGameCarousel } from './HorizontalGameCarousel';

type Props = {
  focus: BrainFocus;
  isRussian: boolean;
  progress: Record<string, BrainGameProgress>;
  onSelect: (id: BrainGameId, category: BrainGameCategory) => void;
};

export function BrainGameLibrary({ focus, isRussian, progress, onSelect }: Props) {
  return (
    <div className="brain-game-library">
      {brainGameCategories.map((category) => (
        <section
          className={`${focus === category.id ? 'recommended ' : ''}category-${category.id}`}
          key={category.id}
        >
          <header>
            <div>
              <h2>{isRussian ? category.ru : category.en}</h2>
              {focus === category.id && <span>{isRussian ? 'Твой акцент' : 'Your focus'}</span>}
            </div>
            <strong>{category.games.length}</strong>
          </header>
          <HorizontalGameCarousel isRussian={isRussian}>
            {category.games.map((game) => {
              const saved = progress[game.id];
              const description = getBrainGameDescription(game.id, category.id);
              return (
              <button
                className={focus === category.id && game.priority ? 'priority-game' : ''}
                key={game.id}
                onClick={() => onSelect(game.id, category.id)}
                type="button"
              >
                <div className={`game-card-art${game.id === 'face-name' ? ' face-name-card-art' : ''}`} aria-hidden="true">
                  <span>{game.icon}</span>
                  <i>{category.icon}</i>
                </div>
                <div className="game-card-copy">
                  <div className="game-card-heading">
                    <strong>{isRussian ? game.ru : game.en}</strong>
                  </div>
                  <p>{isRussian ? description.action.ru : description.action.en}</p>
                  <small>{game.id === 'coffee'
                    ? saved
                      ? (isRussian ? `✓ Смен сыграно: ${saved.completedCount}` : `✓ Shifts played: ${saved.completedCount}`)
                      : (isRussian ? '1 минута · Играть →' : '1 minute · Play →')
                    : focus === category.id && game.priority
                    ? (isRussian
                      ? `★ Приоритет${saved ? ` · ✓ уровень ${saved.currentLevel}` : ''}`
                      : `★ Priority${saved ? ` · ✓ level ${saved.currentLevel}` : ''}`)
                    : saved
                      ? (isRussian
                        ? `✓ Пройдено · уровень ${saved.currentLevel}`
                        : `✓ Completed · level ${saved.currentLevel}`)
                      : (isRussian ? 'Уровни · Играть →' : 'Levels · Play →')}</small>
                  <em>
                    <span>{isRussian ? 'Рекорд' : 'Best score'}</span>
                    <b>{saved ? `${saved.bestScore}/100` : '—'}</b>
                  </em>
                  <span className="game-card-play">{isRussian ? 'Играть' : 'Play'} →</span>
                </div>
              </button>
              );
            })}
          </HorizontalGameCarousel>
        </section>
      ))}
    </div>
  );
}
