import { createContext, useContext, useState, type ReactNode } from 'react';
import { createNextAction } from './goalCoach';
import { useLanguage } from './language';
import { unlockAchievement } from './achievements';

export type GoalPlan = {
  id: string;
  title: string;
  why: string;
  result: string;
  milestones: string[];
  actions: string[];
  availableTime: string;
  completedActions: string[];
  completedCount: number;
  coachMessage: string;
  checkIns: string[];
};

type GoalsContextValue = {
  goal: GoalPlan | null;
  startGoal: (goal: GoalPlan) => void;
  completeStep: () => Promise<void>;
  saveCheckIn: (note: string, message: string, nextAction: string) => void;
  resetGoal: () => void;
};

const GoalsContext = createContext<GoalsContextValue | null>(null);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [goal, setGoal] = useState<GoalPlan | null>(null);

  const completeStep = async () => {
    if (!goal) return;
    const completedAction = goal.actions[0];
    const history = [...goal.completedActions, completedAction];
    const nextAction = await createNextAction(goal.title, goal.availableTime, history, language);
    void unlockAchievement('goal_first_step').catch(() => undefined);
    setGoal((current) => current && {
      ...current,
      actions: [...current.actions.slice(1), nextAction],
      completedActions: history,
      completedCount: history.length,
      coachMessage: 'Отлично. Ты не просто планируешь — ты двигаешься.',
    });
  };

  const saveCheckIn = (note: string, message: string, nextAction: string) => {
    setGoal((current) => current && {
      ...current,
      actions: current.actions.map((action, index) =>
        index === 0 ? nextAction : action,
      ),
      checkIns: [...current.checkIns, note],
      coachMessage: message,
    });
  };

  return (
    <GoalsContext.Provider
      value={{ goal, startGoal: setGoal, completeStep, saveCheckIn, resetGoal: () => setGoal(null) }}
    >
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) throw new Error('useGoals must be used inside GoalsProvider');
  return context;
}
