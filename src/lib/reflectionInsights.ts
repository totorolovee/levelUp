import type { ReflectionEntry } from './reflections';
import { supabase } from './supabase';

export type ReflectionInsight = {
  headline: string;
  pattern: string;
  recommendation: string;
  confidence: number;
};

type AiResponse = { text?: unknown };

function readText(value: unknown, limit: number) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function parseInsight(text: string, entriesCount: number): ReflectionInsight {
  const jsonText = text.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonText) throw new Error('AI did not return JSON');
  const parsed = JSON.parse(jsonText) as unknown;
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid AI insight');
  const value = parsed as Record<string, unknown>;
  const headline = readText(value.headline, 120);
  const pattern = readText(value.pattern, 360);
  const recommendation = readText(value.recommendation, 280);
  if (!headline || !pattern || !recommendation) throw new Error('Incomplete AI insight');
  return {
    headline,
    pattern,
    recommendation,
    confidence: Math.min(88, 30 + entriesCount * 5),
  };
}

export async function generateReflectionInsight(
  entries: ReflectionEntry[],
  language: 'ru' | 'en',
) {
  const recent = entries.slice(0, 14);
  const observations = recent.map((entry) =>
    `${entry.date}: mood=${entry.mood}/5; energy=${entry.energy}/5; note=${entry.note.slice(0, 500) || 'none'}`,
  ).join('\n');
  const prompt = `Daily reflections (${recent.length} entries):\n${observations}`;
  const system = [
    'You are a personal reflection assistant helping a teenager notice productivity and decision-making patterns.',
    'Use only the supplied entries. Treat correlations as observations, never causes.',
    'Do not make medical, mental-health, diagnostic, or intelligence claims.',
    recent.length < 3
      ? 'There is not enough data for a trend. Clearly call this an initial observation.'
      : 'Identify one modest repeated pattern only when the entries support it.',
    'Give one small, safe, concrete action for tomorrow.',
    'Return JSON only: {"headline":"short title","pattern":"evidence-based observation","recommendation":"one action"}.',
    language === 'ru' ? 'Write in Russian.' : 'Write in English.',
  ].join(' ');
  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
    body: { prompt, system },
  });
  if (error || typeof data?.text !== 'string') throw new Error('Insight unavailable');
  return parseInsight(data.text, recent.length);
}
