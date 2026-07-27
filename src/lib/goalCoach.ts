import { isSupabaseConfigured, supabase } from './supabase';

export type GoalPlanDraft = {
  result: string;
  milestones: string[];
  actions: string[];
};

export type CoachAdjustment = {
  message: string;
  nextAction: string;
};

const configurationMessage =
  'AI ещё не подключён. Добавь настройки Supabase и Gemini в локальный .env.';

async function askCoach(system: string, prompt: string) {
  if (!isSupabaseConfigured) throw new Error(configurationMessage);

  const { data, error } = await supabase.functions.invoke('ai', {
    body: { system, prompt },
  });
  if (error || typeof data?.text !== 'string') {
    throw new Error('AI Coach сейчас не ответил. Попробуй ещё раз.');
  }
  return data.text.replace(/```json|```/g, '').trim();
}

export async function getCoachQuestions(goal: string): Promise<string[]> {
  const text = await askCoach(
    'Ты личный коуч подростка 14 лет. Проанализируй конкретную цель и задай вопросы именно по этой сфере. Не используй универсальный опрос. Ответ — только JSON-массив строк.',
    `Цель: "${goal}". Дай ровно 3 коротких уточняющих вопроса, необходимых для персонального плана. Узнай текущий уровень, конкретный результат или срок и реальное доступное время. Не спрашивай, почему цель важна.`,
  );
  const questions = JSON.parse(text) as string[];
  if (questions.length !== 3) throw new Error('AI вернул неполные вопросы.');
  return questions;
}

export async function createPersonalPlan(
  goal: string,
  questions: string[],
  answers: string[],
): Promise<GoalPlanDraft> {
  const interview = [
    { question: 'Почему эта цель важна именно для тебя?', answer: answers[0] },
    ...questions.map((question, index) => ({
      question,
      answer: answers[index + 1],
    })),
  ];
  const availableTime = answers[answers.length - 1];
  const text = await askCoach(
    'Ты адаптивный AI-коуч подростка. Строй уникальный предметный план только из ответов пользователя. Запрещены универсальные этапы, которые подошли бы любой цели. Доступное время — жёсткий максимум. Ответ — только валидный JSON.',
    `Цель: "${goal}". Полное интервью: ${JSON.stringify(interview)}. Учти каждый ответ, текущий уровень, срок, мотивацию и максимум времени "${availableTime}". Создай предметные этапы и разные измеримые действия именно для этой сферы. Верни {"result":"персональный результат","milestones":["5-7 уникальных этапов"],"actions":["5-7 разных действий с числами"]}.`,
  );
  const plan = JSON.parse(text) as GoalPlanDraft;
  if (plan.milestones.length < 5 || plan.actions.length < 5) {
    throw new Error('AI вернул слишком короткий план.');
  }
  return plan;
}

export async function createNextAction(
  goal: string,
  availableTime: string,
  completedActions: string[],
): Promise<string> {
  const level = Math.floor(completedActions.length / 3) + 1;
  return askCoach(
    'Ты адаптивный AI-коуч. Дай одно новое действие, основанное на цели и истории пользователя. Оно должно отличаться от последних заданий и повышать сложность навыка, но не время. Ответь только одной строкой.',
    `Цель: "${goal}". Доступное время: "${availableTime}" — никогда его не увеличивай. Выполненные действия: ${JSON.stringify(completedActions)}. Текущий Level ${level}. Создай следующее измеримое действие другого типа. Чередуй изучение, практику, применение, проверку и анализ ошибок.`,
  );
}

export async function adjustAfterCheckIn(
  goal: string,
  note: string,
  currentAction: string,
  availableTime: string,
): Promise<CoachAdjustment> {
  const text = await askCoach(
    'Ты поддерживающий AI-коуч подростка. Анализируй реальную причину трудности, не ругай и адаптируй нагрузку. Не превышай доступное время. Ответ — только JSON.',
    `Цель: "${goal}". Текущий шаг: "${currentAction}". Доступное время: "${availableTime}". Ответ пользователя за вечер: "${note}". Верни {"message":"короткий личный вывод","nextAction":"одно адаптированное измеримое действие"}.`,
  );
  return JSON.parse(text) as CoachAdjustment;
}
