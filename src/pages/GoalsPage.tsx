import { AppHeader } from '../components/AppHeader';
import { GoalDashboard } from '../components/GoalDashboard';
import { GoalOnboarding } from '../components/GoalOnboarding';
import { useGoals } from '../lib/goals';
import { Link } from 'wouter';

export function GoalsPage() {
  const { goal, startGoal, completeStep, saveCheckIn, resetGoal } = useGoals();

  return (
    <main className="shell">
      <AppHeader />
      {goal ? (
        <GoalDashboard
          goal={goal}
          onCheckIn={saveCheckIn}
          onChangeGoal={resetGoal}
          onCompleteStep={completeStep}
        />
      ) : (
        <>
          <GoalOnboarding onComplete={startGoal} />
          <aside className="admission-invite">
            <div>
              <span>Планируешь учёбу в США?</span>
              <p>Сравни свой профиль с требованиями Stanford, MIT, Harvard и UC Berkeley.</p>
            </div>
            <Link href="/universities">Открыть навигатор →</Link>
          </aside>
        </>
      )}
    </main>
  );
}
