import {
  brainGameCategories,
  getBrainGameInfo,
} from '../lib/brainGameCatalog';
import type {
  BrainDashboardData,
  BrainSkillId,
  DailyBrainGame,
} from '../lib/brainDashboard';
import { BrainActivityCalendar } from './BrainActivityCalendar';

type Props = {
  dashboard: BrainDashboardData;
  isRussian: boolean;
  onStart: () => void;
  plan: DailyBrainGame[];
  recommendation: string;
};

const skillCopy: Record<BrainSkillId, { icon: string; ru: string; en: string }> = {
  attention: { icon: '◉', ru: 'Внимание', en: 'Attention' },
  memory: { icon: '♙', ru: 'Память', en: 'Memory' },
  speed: { icon: '⚡', ru: 'Скорость', en: 'Speed' },
  logic: { icon: '◇', ru: 'Логика', en: 'Logic' },
  focus: { icon: '⌖', ru: 'Концентрация', en: 'Focus' },
};

export function BrainTrainingDashboard(props: Props) {
  const { dashboard, isRussian, onStart, plan, recommendation } = props;
  const language = isRussian ? 'ru' : 'en';
  return (
    <div className="brain-dashboard">
      <section className="daily-training-hero">
        <div className="daily-hero-copy">
          <span className="daily-greeting">{isRussian ? 'Привет! Твой план готов.' : 'Hi! Your plan is ready.'}</span>
          <p className="eyebrow">{isRussian ? 'Сегодняшняя тренировка' : "Today's workout"}</p>
          <h1>{isRussian ? 'Одна тренировка. Заметный прогресс.' : 'One workout. Visible progress.'}</h1>
          <p>{isRussian
            ? 'Три короткие игры подобраны по твоим прошлым результатам.'
            : 'Three short games selected from your previous results.'}</p>
          <div className="daily-plan-games">
            {plan.map((item) => {
              const game = getBrainGameInfo(item.id);
              const category = brainGameCategories.find(({ id }) => id === item.category);
              return <span key={item.id}><i>{category?.icon}</i>{game?.[language]}</span>;
            })}
          </div>
          <button onClick={onStart} type="button">
            {isRussian ? 'Начать сегодняшнюю тренировку' : "Start today's workout"} →
          </button>
        </div>
        <div className="brain-score-orb">
          <small>Brain Score</small>
          <strong>{dashboard.brainScore}</strong>
          <span>/100</span>
        </div>
        <div className="brain-hero-stats">
          <article><span>XP</span><strong>{dashboard.totalXp}</strong></article>
          <article><span>{isRussian ? 'Уровень' : 'Level'}</span><strong>{dashboard.level}</strong></article>
          <article><span>{isRussian ? 'Серия' : 'Streak'}</span><strong>🔥 {dashboard.streak}</strong></article>
          <article><span>{isRussian ? 'Игр' : 'Games'}</span><strong>{dashboard.totalGames}</strong></article>
        </div>
      </section>

      <section className="brain-skill-card">
        <header>
          <div><p className="eyebrow">{isRussian ? 'Твои навыки' : 'Your skills'}</p><h2>{isRussian ? 'Профиль прогресса' : 'Progress profile'}</h2></div>
          <span>{isRussian ? 'Последние результаты' : 'Recent results'}</span>
        </header>
        <div className="brain-skill-grid">
          {(Object.keys(skillCopy) as BrainSkillId[]).map((id) => (
            <article key={id}>
              <div><i>{skillCopy[id].icon}</i><span>{skillCopy[id][language]}</span><strong>{dashboard.skills[id]}</strong></div>
              <em><i style={{ width: `${dashboard.skills[id]}%` }} /></em>
            </article>
          ))}
        </div>
      </section>

      <section className="brain-ai-card">
        <span>AI</span>
        <div>
          <p className="eyebrow">{isRussian ? 'Сегодня рекомендует ИИ' : 'AI recommends today'}</p>
          <p>{recommendation || (isRussian
            ? 'Анализирую твои последние результаты и собираю план.'
            : 'Analyzing your recent results and preparing a plan.')}</p>
        </div>
      </section>
      <BrainActivityCalendar activeDates={dashboard.activeDates} isRussian={isRussian} streak={dashboard.streak} />
    </div>
  );
}
