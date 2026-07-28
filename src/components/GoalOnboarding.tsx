import { useState } from 'react';
import { createPersonalPlan, getCoachQuestions } from '../lib/goalCoach';
import type { GoalPlan } from '../lib/goals';

export function GoalOnboarding({ onComplete }: { onComplete: (plan: GoalPlan) => void }) {
  const [goal, setGoal] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const questionIndex = answers.length;
  const allQuestions = ['Почему эта цель важна именно для тебя?', ...questions];

  const begin = async () => {
    if (goal.trim().length < 5) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      setQuestions(await getCoachQuestions(goal.trim()));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'AI Coach не ответил.');
    } finally {
      setIsLoading(false);
    }
  };

  const reply = async () => {
    if (answer.trim().length < 2) return;
    const nextAnswers = [...answers, answer.trim()];
    if (nextAnswers.length < allQuestions.length) {
      setAnswers(nextAnswers);
      setAnswer('');
      return;
    }
    setIsLoading(true);
    try {
      const draft = await createPersonalPlan(goal.trim(), questions, nextAnswers);
      onComplete({
        id: crypto.randomUUID(),
        title: goal.trim(),
        why: nextAnswers[0],
        ...draft,
        actions: draft.actions,
        availableTime: nextAnswers[nextAnswers.length - 1],
        completedActions: [],
        completedCount: 0,
        coachMessage: 'Маршрут готов. Не думай обо всём пути — начни с одного шага.',
        checkIns: [],
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'AI Coach не ответил.');
      setIsLoading(false);
    }
  };

  if (questions.length === 0) {
    return (
      <section className="coach-onboarding">
        <p className="eyebrow">Личный AI Coach</p>
        <h1>С какой целью будем работать?</h1>
        <p>Сначала я задам несколько вопросов. Потом соберу маршрут именно под тебя.</p>
        <div className="coach-input">
          <textarea onChange={(event) => setGoal(event.target.value)} placeholder="Например: поступить в университет в США" rows={3} value={goal} />
          <button disabled={goal.trim().length < 5 || isLoading} onClick={begin} type="button">
            {isLoading ? 'Coach думает…' : 'Поговорить с коучем →'}
          </button>
          {errorMessage && <p className="coach-error">{errorMessage}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="coach-dialog">
      <div className="coach-avatar">AI</div>
      <div className="coach-bubble">
        <span>Вопрос {questionIndex + 1} из {allQuestions.length}</span>
        <h2>{allQuestions[questionIndex]}</h2>
      </div>
      <textarea autoFocus onChange={(event) => setAnswer(event.target.value)} placeholder="Ответь своими словами…" rows={3} value={answer} />
      <button disabled={answer.trim().length < 2 || isLoading} onClick={reply} type="button">
        {isLoading ? 'Создаю личный маршрут…' : questionIndex === allQuestions.length - 1 ? 'Создать мой маршрут ✦' : 'Ответить →'}
      </button>
      {errorMessage && <p className="coach-error">{errorMessage}</p>}
    </section>
  );
}
