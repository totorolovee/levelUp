import { supabase } from './supabase';
import type { BuyDecision } from '../components/BuyStockForm';

const SYSTEM_PROMPT = [
  'Ты проверяешь учебные ответы подростка перед виртуальной покупкой акции.',
  'Оцени смысл, а не грамотность и не длину.',
  'Ответ одобрен, только если причина относится к компании, указан настоящий риск,',
  'а условие пересмотра решения конкретно и связано с бизнесом или ценой.',
  'Бессмыслица, случайные символы, повтор вопроса и одинаковые ответы не подходят.',
  'Не оценивай, вырастет ли акция, и не давай финансовых советов.',
  'Верни только JSON: {"approved":true,"feedback":"короткое объяснение по-русски"}.',
].join(' ');

type AiResponse = { text?: unknown; error?: unknown };
type Evaluation = { approved: boolean; feedback: string };

export async function evaluateInvestment(
  company: string,
  decision: BuyDecision,
  language: 'ru' | 'en' = 'ru',
): Promise<Evaluation> {
  const prompt = [
    `Компания: ${company}`,
    `Причина покупки: ${decision.reason}`,
    `Главный риск: ${decision.risk}`,
    `Пересмотрю решение, если: ${decision.invalidation}`,
  ].join('\n');
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
      body: {
        prompt,
        system: `${SYSTEM_PROMPT} ${
          language === 'en' ? 'Write feedback only in English.' : 'Пиши feedback только по-русски.'
        }`,
      },
    });
    if (error || typeof data?.text !== 'string') continue;
    const json = data.text.match(/\{[\s\S]*\}/)?.[0];
    if (!json) continue;
    try {
      const result = JSON.parse(json) as Partial<Evaluation>;
      if (typeof result.approved !== 'boolean') continue;
      return {
        approved: result.approved,
        feedback: typeof result.feedback === 'string'
          ? result.feedback.slice(0, 240)
          : result.approved ? 'Ответы приняты.' : 'Ответы нужно сделать конкретнее.',
      };
    } catch {
      // Вторая попытка исправляет редкий невалидный JSON от модели.
    }
  }
  return {
    approved: false,
    feedback: language === 'ru'
      ? 'AI временно не смог проверить ответы — баллы не начислены.'
      : 'AI could not review the answers right now, so no points were awarded.',
  };
}
