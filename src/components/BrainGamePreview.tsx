import { getBrainGameInfo, type BrainGameId } from '../lib/brainGameCatalog';
import type { BrainGameCategory, BrainGameProgress } from '../lib/brainGameResults';
import { getBrainGameDescription } from '../lib/brainGameDescriptions';
import { getBrainGameTutorial } from '../lib/brainGameTutorials';

type Props = {
  category: BrainGameCategory;
  gameId: BrainGameId;
  isRussian: boolean;
  progress?: BrainGameProgress;
  onBack: () => void;
  onStart: () => void;
};

export function BrainGamePreview({
  category,
  gameId,
  isRussian,
  progress,
  onBack,
  onStart,
}: Props) {
  const game = getBrainGameInfo(gameId);
  const description = getBrainGameDescription(gameId, category);
  const tutorial = getBrainGameTutorial(gameId, category);

  return (
    <section className={`brain-game-preview category-${category}`}>
      <button className="brain-game-back" onClick={onBack} type="button">
        ← {isRussian ? 'Все игры' : 'All games'}
      </button>
      <p className="eyebrow">{isRussian ? 'Как играть' : 'How to play'}</p>
      <h1>{isRussian ? game?.ru : game?.en}</h1>
      <p className="game-action">{isRussian ? description.action.ru : description.action.en}</p>
      <ol className="game-tutorial-steps">
        {tutorial.map((step, index) => (
          <li key={step.en}>
            <span>{index + 1}</span>
            <div>
              <strong>{isRussian ? step.ru : step.en}</strong>
              <p>{isRussian ? step.copy.ru : step.copy.en}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="skill-explanation">
        <span>{isRussian ? 'Что развиваем' : 'Skill focus'}</span>
        <p>{isRussian ? description.skill.ru : description.skill.en}</p>
      </div>
      <dl className="game-preview-stats">
        <div><dt>{isRussian ? 'Рекорд' : 'Best score'}</dt><dd>{progress ? `${progress.bestScore}/100` : '—'}</dd></div>
        {gameId === 'coffee'
          ? <div><dt>{isRussian ? 'Время' : 'Time'}</dt><dd>1:00</dd></div>
          : <div><dt>{isRussian ? 'Сложность' : 'Difficulty'}</dt><dd>{progress?.currentLevel ?? 1}/20</dd></div>}
        <div><dt>{isRussian ? 'Всего игр' : 'Games played'}</dt><dd>{progress?.completedCount ?? 0}</dd></div>
      </dl>
      <button className="start-brain-game" onClick={onStart} type="button">
        {isRussian ? 'Начать игру' : 'Start game'} →
      </button>
    </section>
  );
}
