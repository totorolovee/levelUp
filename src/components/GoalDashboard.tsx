import type { GoalPlan } from '../lib/goals';
import { EveningCheckIn } from './EveningCheckIn';
import { GoalRoadmap } from './GoalRoadmap';
import { NextBestStep } from './NextBestStep';

const levels = ['Level 1', 'Level 2', 'Level 3', 'Advanced', 'Master'];

type GoalDashboardProps = {
  goal: GoalPlan;
  onChangeGoal: () => void;
  onCompleteStep: () => Promise<void>;
  onCheckIn: (note: string, message: string, nextAction: string) => void;
};

export function GoalDashboard({
  goal,
  onChangeGoal,
  onCompleteStep,
  onCheckIn,
}: GoalDashboardProps) {
  const levelIndex = Math.min(Math.floor(goal.completedCount / 3), levels.length - 1);
  const currentAction = goal.actions[0];

  return (
    <>
      <section className="goal-command">
        <div>
          <p className="eyebrow">Твоя цель</p>
          <h1>{goal.title}</h1>
          <p>{goal.result}</p>
        </div>
        <div className="goal-controls">
          <div className="level-badge">
            <span>Текущий уровень</span>
            <strong>{levels[levelIndex]}</strong>
            <small>{goal.completedCount} шагов выполнено</small>
          </div>
          <button onClick={onChangeGoal} type="button">Поменять цель</button>
        </div>
      </section>
      <aside className="goal-why"><span>Почему это важно</span><p>«{goal.why}»</p></aside>
      <NextBestStep action={currentAction} onComplete={onCompleteStep} />
      <div className="coach-message"><span>Наставник LevelUp</span><p>{goal.coachMessage}</p></div>
      <GoalRoadmap milestones={goal.milestones} />
      <EveningCheckIn
        availableTime={goal.availableTime}
        currentAction={currentAction}
        goal={goal.title}
        onSave={onCheckIn}
      />
    </>
  );
}
