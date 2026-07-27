import { AppHeader } from '../components/AppHeader';
import { GoalDashboard } from '../components/GoalDashboard';
import { GoalOnboarding } from '../components/GoalOnboarding';
import { useGoals } from '../lib/goals';

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
        <GoalOnboarding onComplete={startGoal} />
      )}
    </main>
  );
}
