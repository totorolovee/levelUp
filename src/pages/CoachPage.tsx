import { AiCoachForm } from '../components/AiCoachForm';
import { AppHeader } from '../components/AppHeader';
import { useGoals } from '../lib/goals';
import { usePortfolio } from '../lib/portfolio';
import { useReading } from '../lib/reading';

export function CoachPage() {
  const { goal } = useGoals();
  const { decisions } = usePortfolio();
  const { progress, selectedTitles } = useReading();
  const hasAppData = Boolean(goal || decisions.length || selectedTitles.length);

  const appContext = [
    goal
      ? `Цель: ${goal.title}. Выполнено шагов: ${goal.completedCount}. Следующий шаг: ${goal.actions[0] ?? 'не задан'}.`
      : 'Активная цель не указана.',
    selectedTitles.length
      ? `Чтение: ${selectedTitles.map((title) => `${title} — ${progress[title] ?? 0}%`).join('; ')}.`
      : 'Книги пока не выбраны.',
    decisions.length
      ? `Инвестиционные решения: ${decisions.slice(0, 3).map((item) => `${item.company}, причина: ${item.reason}`).join('; ')}.`
      : 'Инвестиционных решений пока нет.',
  ].join('\n');

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro">
        <div>
          <p className="eyebrow">AI Coach</p>
          <h1>Совет, который учитывает твой путь.</h1>
          <p>
            Расскажи, что сейчас мешает. Наставник посмотрит на данные LevelUp
            и предложит один понятный следующий шаг.
          </p>
        </div>
      </section>
      <AiCoachForm appContext={appContext} hasAppData={hasAppData} />
    </main>
  );
}
