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
  perfectRequired?: boolean;
  result: BrainGameResultData;
  timedChallenge?: boolean;
};

export function BrainGameResultScreen(props: Props) {
  const { dailyPosition, isRussian, onContinue, perfectRequired, result, timedChallenge } = props;
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
        {timedChallenge && <b>◷ {isRussian ? 'Смена завершена' : 'Shift complete'}</b>}
        {result.leveledUp && !timedChallenge && <b>↑ {isRussian ? `Новый уровень ${result.level}` : `Level ${result.level} reached`}</b>}
      </div>
      {result.score < 100 && (
        <div className="game-mistake-feedback" role="status">
          <span aria-hidden="true">!</span>
          <div>
            <strong>{perfectRequired
              ? (isRussian ? `Уровень остался ${result.level}` : `You remain on level ${result.level}`)
              : (isRussian ? 'Есть куда расти' : 'Room to improve')}</strong>
            <small>{perfectRequired
              ? (isRussian
                ? 'Для следующего уровня нужно вспомнить все имена без единой ошибки.'
                : 'Recall every name without a single mistake to unlock the next level.')
              : (isRussian
                ? 'Ошибки — часть тренировки. Следующая попытка укрепит навык.'
                : 'Mistakes are part of training. The next attempt strengthens the skill.')}</small>
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
