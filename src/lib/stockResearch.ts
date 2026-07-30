import { supabase } from './supabase';
import type { Stock } from './stocks';

export type ResearchNewsItem = {
  headline: string;
  source: string;
  summary: string;
  url: string;
  publishedAt: number | null;
};

export type ResearchConsensus = {
  period: string | null;
  bullish: number;
  neutral: number;
  bearish: number;
};

export type ResearchFinancial = {
  id: 'revenue' | 'eps' | 'fcf' | 'margin' | 'debt' | 'roe';
  value: number;
  unit: string;
};

export type StockResearch = {
  news: ResearchNewsItem[];
  consensus: ResearchConsensus;
  financials: ResearchFinancial[];
  updatedAt: string;
};

type AiResponse = { text?: unknown };

function isResearch(value: unknown): value is StockResearch {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<StockResearch>;
  return Array.isArray(item.news)
    && Array.isArray(item.financials)
    && Boolean(item.consensus)
    && typeof item.updatedAt === 'string';
}

export async function loadStockResearch(symbol: string) {
  const { data, error } = await supabase.functions.invoke<unknown>('market-prices', {
    body: { researchSymbol: symbol },
  });
  if (error || !isResearch(data)) throw new Error('Research data unavailable');
  return data;
}

export async function generateStockSummary(
  stock: Stock,
  research: StockResearch | null,
  language: 'ru' | 'en',
) {
  const consensus = research?.consensus;
  const metrics = research?.financials
    .map((item) => `${item.id}: ${item.value} ${item.unit}`)
    .join('; ') || 'not available';
  const headlines = research?.news
    .slice(0, 4)
    .map((item) => `${item.source}: ${item.headline}`)
    .join('\n') || 'not available';
  const prompt = [
    `Company: ${stock.name} (${stock.symbol})`,
    `Business: ${stock.business}`,
    `Known strength: ${stock.strength}`,
    `Known risk: ${stock.risk}`,
    `Competitors: ${stock.competitors}`,
    `Analyst counts: bullish ${consensus?.bullish ?? 0}, neutral ${consensus?.neutral ?? 0}, bearish ${consensus?.bearish ?? 0}`,
    `Available metrics: ${metrics}`,
    `Recent headlines:\n${headlines}`,
  ].join('\n');
  const system = [
    'You create a short educational company research summary for a teenager.',
    'Use only the supplied facts. Never invent report contents, analyst arguments, targets, or future performance.',
    'Explain: business, what the available signals show, why opinions may differ, three opportunities, and three risks.',
    'State when source data is missing. Do not recommend buying or selling.',
    language === 'ru' ? 'Write in Russian.' : 'Write in English.',
  ].join(' ');
  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
    body: { prompt, system },
  });
  if (error || typeof data?.text !== 'string') throw new Error('AI summary unavailable');
  return data.text.trim();
}
