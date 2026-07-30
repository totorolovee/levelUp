import type { DailyBrainGame, BrainDashboardData } from './brainDashboard';
import { getBrainGameInfo } from './brainGameCatalog';
import { supabase } from './supabase';

type AiResponse = { text?: unknown };

export async function generateBrainRecommendation(
  dashboard: BrainDashboardData,
  plan: DailyBrainGame[],
  language: 'ru' | 'en',
) {
  const games = plan.map((item) => getBrainGameInfo(item.id)?.[language]).filter(Boolean);
  const prompt = [
    `Scores: attention ${dashboard.skills.attention}, memory ${dashboard.skills.memory},`,
    `speed ${dashboard.skills.speed}, logic ${dashboard.skills.logic}, focus ${dashboard.skills.focus}.`,
    `Yesterday score: ${dashboard.yesterdayScore ?? 'no data'}.`,
    `Recommended games: ${games.join(', ')}.`,
  ].join(' ');
  const system = [
    'You are a supportive brain-training coach for a teenager.',
    'In no more than two short sentences, explain which weaker skill today’s plan trains.',
    'Use only supplied numbers and game names. Do not make medical or intelligence claims.',
    language === 'ru' ? 'Write in Russian.' : 'Write in English.',
  ].join(' ');
  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
    body: { prompt, system },
  });
  if (error || typeof data?.text !== 'string') throw new Error('Recommendation unavailable');
  return data.text.trim().slice(0, 360);
}
