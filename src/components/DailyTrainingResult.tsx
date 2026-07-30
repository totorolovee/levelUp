import type { BrainDashboardData } from '../lib/brainDashboard';
import type { BrainGameResultData } from './BrainGameResultScreen';

type Props = {
  dashboard: BrainDashboardData;
  isRussian: boolean;
  onDone: () => void;
  results: BrainGameResultData[];
};

export function DailyTrainingResult({ dashboard, isRussian, onDone, results }: Props) {
  const score = Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length);
  const xp = results.reduce((sum, item) => sum + item.xp, 0);
  const records = results.filter((item) => item.isNewRecord).length;
  const improvement = dashboard.yesterdayScore === null ? null : score - dashboard.yesterdayScore;
  return (
    <section className="daily-training-result">
      <div className="daily-result-icon">✦</div>
      <p className="eyebrow">{isRussian ? 'Сегодняшняя тренировка завершена' : "Today's workout is complete"}</p>
      <h1>{score}<small>/100</small></h1>
      <p className="daily-improvement">
        {improvement === null
          ? (isRussian ? 'Это твоя новая точка отсчёта.' : 'This is your new baseline.')
          : improvement > 0
            ? (isRussian ? `На ${improvement} баллов лучше, чем вчера.` : `${improvement} points better than yesterday.`)
            : improvement === 0
              ? (isRussian ? 'Результат на уровне вчерашнего дня.' : "You matched yesterday's score.")
              : (isRussian ? `Сегодня на ${Math.abs(improvement)} баллов ниже. Продолжай серию.` : `${Math.abs(improvement)} points below yesterday. Keep your streak going.`)}
      </p>
      <div className="daily-result-stats">
        <article><span>{isRussian ? 'Опыт' : 'Experience'}</span><strong>+{xp} XP</strong></article>
        <article><span>{isRussian ? 'Рекорды' : 'Records'}</span><strong>{records}</strong></article>
        <article><span>{isRussian ? 'Серия' : 'Streak'}</span><strong>🔥 {Math.max(1, dashboard.streak)}</strong></article>
      </div>
      <div className="daily-achievement">
        <span>◈</span>
        <div><strong>{isRussian ? 'Ежедневный ритм' : 'Daily rhythm'}</strong><small>{isRussian ? 'Три упражнения выполнены' : 'Three exercises completed'}</small></div>
      </div>
      <button onClick={onDone} type="button">{isRussian ? 'Вернуться к прогрессу' : 'Back to progress'}</button>
    </section>
  );
}
