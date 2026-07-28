import { supabase } from './supabase';

export const COACH_SYSTEM_PROMPT = [
  'Ты — бережный наставник по личному развитию для подростка.',
  'Тон — спокойный, дружелюбный и конкретный, без нравоучений.',
  'Дай один главный вывод и 2–3 небольших следующих шага.',
  'Нельзя ставить диагнозы, давать опасные, юридические или финансовые указания,',
  'стыдить пользователя, обещать гарантированный результат или выдумывать факты.',
  'Если данных мало, честно скажи об этом. Отвечай по-русски и кратко.',
].join(' ');

type CoachData = {
  text?: unknown;
  error?: unknown;
};

export async function askAiCoach(prompt: string, language: 'ru' | 'en' = 'ru') {
  const languageRule = language === 'en'
    ? 'Respond only in clear English.'
    : 'Отвечай только по-русски.';
  const { data, error } = await supabase.functions.invoke<CoachData>('ai', {
    body: { prompt, system: `${COACH_SYSTEM_PROMPT} ${languageRule}` },
  });

  if (error) throw new Error('Не удалось связаться с AI. Попробуй ещё раз.');
  if (typeof data?.error === 'string') throw new Error(data.error);
  if (typeof data?.text !== 'string' || !data.text.trim()) {
    throw new Error('AI не прислал ответ. Попробуй переформулировать запрос.');
  }

  return data.text.trim();
}
