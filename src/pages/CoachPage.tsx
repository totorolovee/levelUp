import { AiCoachForm } from '../components/AiCoachForm';
import { AppHeader } from '../components/AppHeader';
import { useGoals } from '../lib/goals';
import { usePortfolio } from '../lib/portfolio';
import { useReading } from '../lib/reading';
import { useLanguage } from '../lib/language';

export function CoachPage() {
  const { language } = useLanguage();
  const isRussian = language === 'ru';
  const { goal } = useGoals();
  const { decisions } = usePortfolio();
  const { progress, selectedTitles } = useReading();
  const hasAppData = Boolean(goal || decisions.length || selectedTitles.length);

  const appContext = [
    goal
      ? `${isRussian ? 'Цель' : 'Goal'}: ${goal.title}. ${isRussian ? 'Выполнено шагов' : 'Steps completed'}: ${goal.completedCount}. ${isRussian ? 'Следующий шаг' : 'Next step'}: ${goal.actions[0] ?? (isRussian ? 'не задан' : 'not set')}.`
      : (isRussian ? 'Активная цель не указана.' : 'No active goal is set.'),
    selectedTitles.length
      ? `${isRussian ? 'Чтение' : 'Reading'}: ${selectedTitles.map((title) => `${title} — ${progress[title] ?? 0}%`).join('; ')}.`
      : (isRussian ? 'Книги пока не выбраны.' : 'No books selected yet.'),
    decisions.length
      ? `${isRussian ? 'Инвестиционные решения' : 'Investment decisions'}: ${decisions.slice(0, 3).map((item) => `${item.company}, ${isRussian ? 'причина' : 'reason'}: ${item.reason}`).join('; ')}.`
      : (isRussian ? 'Инвестиционных решений пока нет.' : 'No investment decisions yet.'),
  ].join('\n');

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro">
        <div>
          <p className="eyebrow">ИИ-наставник</p>
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
