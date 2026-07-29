import { useState } from 'react';
import {
  saveBrainTrainingProfile,
  type BrainFocus,
  type BrainTrainingProfile,
} from '../lib/brainTrainingProfile';

const groups = [
  [
    { id: 'forget_recent', focus: 'memory', ru: 'Я забываю то, что мне недавно сказали.', en: 'I forget things I was recently told.' },
    { id: 'lose_things', focus: 'memory', ru: 'Мне бывает сложно вспомнить, куда я положил вещи.', en: 'I struggle to remember where I put things.' },
  ],
  [
    { id: 'distracted', focus: 'attention', ru: 'Я легко отвлекаюсь во время учёбы или работы.', en: 'I get distracted easily while studying or working.' },
    { id: 'miss_details', focus: 'attention', ru: 'Я пропускаю важные детали, даже когда стараюсь.', en: 'I miss important details even when I try.' },
  ],
  [
    { id: 'slow_reaction', focus: 'speed', ru: 'Мне нужно много времени, чтобы быстро принять решение.', en: 'I need a lot of time to make quick decisions.' },
    { id: 'time_pressure', focus: 'speed', ru: 'Под ограничением времени я работаю заметно хуже.', en: 'I perform noticeably worse under time pressure.' },
  ],
] as const;

const scale = [
  { value: 1, ru: 'Совсем не согласен', en: 'Strongly disagree' },
  { value: 2, ru: 'Не согласен', en: 'Disagree' },
  { value: 3, ru: 'Что-то среднее', en: 'In between' },
  { value: 4, ru: 'Согласен', en: 'Agree' },
  { value: 5, ru: 'Полностью согласен', en: 'Strongly agree' },
];

const education = [
  ['primary', 'Начальная школа', 'Primary school'],
  ['middle', 'Средняя школа', 'Middle school'],
  ['high', 'Старшая школа', 'High school'],
  ['college', 'Колледж', 'College'],
  ['university', 'Университет', 'University'],
  ['graduate', 'Магистратура или выше', 'Graduate degree'],
];

type Props = {
  isRussian: boolean;
  onComplete: (profile: BrainTrainingProfile) => void;
};

export function BrainAssessment({ isRussian, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [educationLevel, setEducationLevel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const questions = groups[step];
  const complete = questions.every(({ id }) => answers[id])
    && (step < 2 || educationLevel);

  const finish = async () => {
    const needs = groups.flat().reduce<Record<BrainFocus, number[]>>(
      (result, question) => {
        result[question.focus].push(answers[question.id]);
        return result;
      },
      { memory: [], attention: [], speed: [] },
    );
    const average = (values: number[]) =>
      Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
    const profile = {
      memoryNeed: average(needs.memory),
      attentionNeed: average(needs.attention),
      speedNeed: average(needs.speed),
      primaryFocus: (Object.entries(needs)
        .sort(([, first], [, second]) => average(second) - average(first))[0][0]) as BrainFocus,
      educationLevel,
    };
    setIsSaving(true);
    try {
      await saveBrainTrainingProfile(profile, answers);
      onComplete(profile);
    } catch {
      setError(isRussian ? 'Не удалось сохранить ответы.' : 'Could not save your answers.');
      setIsSaving(false);
    }
  };

  return (
    <section className="brain-assessment">
      <p className="eyebrow">{isRussian ? 'Настройка тренировки' : 'Workout setup'} · {step + 1}/3</p>
      <h1>{isRussian
        ? ['Память в обычной жизни', 'Внимание и концентрация', 'Темп и опыт'][step]
        : ['Everyday memory', 'Attention and focus', 'Pace and background'][step]}</h1>
      {questions.map((question) => (
        <fieldset key={question.id}>
          <legend>{isRussian ? question.ru : question.en}</legend>
          <div>{scale.map((option) => (
            <button
              className={answers[question.id] === option.value ? 'selected' : ''}
              key={option.value}
              onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
              type="button"
            >
              <span>{option.value}</span>{isRussian ? option.ru : option.en}
            </button>
          ))}</div>
        </fieldset>
      ))}
      {step === 2 && (
        <label className="education-choice">
          <span>{isRussian ? 'Твой уровень образования' : 'Your education level'}</span>
          <select onChange={(event) => setEducationLevel(event.target.value)} value={educationLevel}>
            <option value="">{isRussian ? 'Выбери уровень' : 'Select level'}</option>
            {education.map(([value, ru, en]) => <option key={value} value={value}>{isRussian ? ru : en}</option>)}
          </select>
        </label>
      )}
      <button disabled={!complete || isSaving} onClick={() => {
        if (step < 2) setStep((current) => current + 1);
        else void finish();
      }} type="button">
        {step < 2 ? (isRussian ? 'Продолжить' : 'Continue') : (isRussian ? 'Создать план' : 'Create plan')}
      </button>
      {error && <p className="coach-error">{error}</p>}
    </section>
  );
}
