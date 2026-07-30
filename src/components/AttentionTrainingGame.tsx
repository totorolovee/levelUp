import { useMemo, useState } from 'react';
import { GameAnswerFeedback } from './brainGames/GameAnswerFeedback';
import { useAnswerFeedback } from './brainGames/useAnswerFeedback';

const TOTAL_LEVELS = 20;
const shapes = ['circle', 'square', 'diamond', 'hexagon'] as const;

function figureCount(level: number) {
  if (level >= 20) return 49;
  if (level >= 15) return 36;
  if (level >= 10) return 25;
  if (level >= 5) return 16;
  return 9;
}

function createLevel(level: number, difficulty: number) {
  const count = figureCount(level);
  const hue = Math.floor(Math.random() * 360);
  const saturation = 58 + Math.floor(Math.random() * 18);
  const lightness = 43 + Math.floor(Math.random() * 14);
  const shadeDifference = Math.max(
    1.5,
    19 - (level - 1) * (16 / (TOTAL_LEVELS - 1)) - (difficulty - 1) * .35,
  );
  const direction = Math.random() > .5 ? 1 : -1;
  const oddLightness = Math.max(22, Math.min(78, lightness + shadeDifference * direction));

  return {
    count,
    columns: Math.sqrt(count),
    commonColor: `hsl(${hue} ${saturation}% ${lightness}%)`,
    oddColor: `hsl(${hue} ${saturation}% ${oddLightness}%)`,
    oddIndex: Math.floor(Math.random() * count),
    shape: shapes[Math.floor(Math.random() * shapes.length)],
  };
}

type Props = {
  difficulty: number;
  isRussian: boolean;
  onComplete: (score: number) => void;
};

export function AttentionTrainingGame({ difficulty, isRussian, onComplete }: Props) {
  const [level, setLevel] = useState(1);
  const [correct, setCorrect] = useState(0);
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = useMemo(() => createLevel(level, difficulty), [difficulty, level]);

  const choose = (index: number) => {
    const isCorrect = index === current.oddIndex;
    const nextCorrect = correct + Number(isCorrect);
    showFeedback(isCorrect, () => {
      if (level === TOTAL_LEVELS) {
        onComplete(adjustScore(Math.round(nextCorrect / TOTAL_LEVELS * 100), TOTAL_LEVELS));
        return;
      }
      setCorrect(nextCorrect);
      setLevel((value) => value + 1);
    });
  };

  return (
    <section className="brain-game attention-game">
      <p className="eyebrow">02 · {isRussian ? 'Внимание' : 'Attention'}</p>
      <h1>{isRussian ? 'Найди другой оттенок' : 'Find the different shade'}</h1>
      <div className="attention-level">
        <span>{isRussian ? 'Уровень' : 'Level'} {level}/{TOTAL_LEVELS}</span>
        <strong>{current.count} {isRussian ? 'фигур' : 'shapes'}</strong>
      </div>
      <div
        className="attention-grid"
        style={{ gridTemplateColumns: `repeat(${current.columns}, 1fr)` }}
      >
        {Array.from({ length: current.count }, (_, index) => (
          <button
            aria-label={isRussian ? `Фигура ${index + 1}` : `Shape ${index + 1}`}
            className={`attention-shape ${current.shape}${feedback === 'error' && index === current.oddIndex ? ' answer-target' : ''}`}
            disabled={isLocked}
            key={`${level}-${index}`}
            onClick={() => choose(index)}
            style={{
              backgroundColor: index === current.oddIndex
                ? current.oddColor
                : current.commonColor,
            }}
            type="button"
          />
        ))}
      </div>
      <GameAnswerFeedback
        errorText={isRussian
          ? 'Правильная фигура отмечена светлой рамкой.'
          : 'The correct shape is marked with a light outline.'}
        isRussian={isRussian}
        status={feedback}
      />
    </section>
  );
}
