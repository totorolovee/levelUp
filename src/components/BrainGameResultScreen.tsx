export type BrainGameResultData = {
  score: number;
  xp: number;
  level: number;
  leveledUp: boolean;
  isNewRecord: boolean;
};

type Props = {
  dailyPosition?: { current: number; total: number };
  isRussian: boolean;
  onContinue: () => void;
  result: BrainGameResultData;
};

export function BrainGameResultScreen(props: Props) {
  const { dailyPosition, isRussian, onContinue, result } = props;
  return (
    <section className="training-result game-result-screen">
      <span>{result.isNewRecord ? '🏆' : '✓'}</span>
      <p className="eyebrow">{isRussian ? 'Игра завершена' : 'Game complete'}</p>
      {dailyPosition && (
        <p className="daily-result-progress">
          {isRussian ? 'Тренировка' : 'Workout'} {dailyPosition.current}/{dailyPosition.total}
        </p>
      )}
      <h1>{result.score}<small>/100</small></h1>
      <strong className="xp-earned">+{result.xp} XP</strong>
      <div className="result-badges">
        {result.isNewRecord && <b>🏆 {isRussian ? 'Новый рекорд' : 'New personal best'}</b>}
        {result.leveledUp && <b>↑ {isRussian ? `Новый уровень ${result.level}` : `Level ${result.level} reached`}</b>}
      </div>
      {result.score < 100 && (
        <div className="game-mistake-feedback" role="status">
          <span aria-hidden="true">!</span>
          <div>
            <strong>{isRussian ? 'Есть куда расти' : 'Room to improve'}</strong>
            <small>{isRussian
              ? 'Ошибки — часть тренировки. Следующая попытка укрепит навык.'
              : 'Mistakes are part of training. The next attempt strengthens the skill.'}</small>
          </div>
        </div>
      )}
      <button onClick={onContinue} type="button">
        {dailyPosition && dailyPosition.current < dailyPosition.total
          ? (isRussian ? 'Следующая игра' : 'Next game')
          : dailyPosition
            ? (isRussian ? 'Итоги тренировки' : 'Workout results')
            : (isRussian ? 'Все игры' : 'All games')} →
      </button>
    </section>
  );
}
