import { supabase } from './supabase';
import type { Decision } from './portfolio';

type DecisionRow = {
  id: string;
  symbol: string;
  company: string;
  quantity: number;
  price: number | string;
  reason: string;
  risk: string;
  invalidation: string;
  horizon: string;
  confidence: number;
  analysis_approved: boolean;
  analysis_feedback: string;
  lesson: string | null;
  created_at: string;
};

const columns = [
  'id', 'symbol', 'company', 'quantity', 'price', 'reason', 'risk',
  'invalidation', 'horizon', 'confidence', 'analysis_approved',
  'analysis_feedback', 'lesson', 'created_at',
].join(',');

function fromRow(row: DecisionRow): Decision {
  return {
    id: row.id,
    symbol: row.symbol,
    company: row.company,
    quantity: row.quantity,
    price: Number(row.price),
    reason: row.reason,
    risk: row.risk,
    invalidation: row.invalidation,
    horizon: row.horizon,
    confidence: row.confidence,
    analysisApproved: row.analysis_approved,
    analysisFeedback: row.analysis_feedback,
    lesson: row.lesson ?? undefined,
    createdAt: new Date(row.created_at),
  };
}

export async function loadInvestmentDecisions() {
  const { data, error } = await supabase
    .from('investment_decisions')
    .select(columns)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as DecisionRow[]).map(fromRow);
}

export async function saveInvestmentDecision(
  decision: Omit<Decision, 'id' | 'createdAt'>,
) {
  const { data, error } = await supabase.from('investment_decisions').insert({
    symbol: decision.symbol,
    company: decision.company,
    quantity: decision.quantity,
    price: decision.price,
    reason: decision.reason,
    risk: decision.risk,
    invalidation: decision.invalidation,
    horizon: decision.horizon,
    confidence: decision.confidence,
    analysis_approved: decision.analysisApproved,
    analysis_feedback: decision.analysisFeedback,
    lesson: decision.lesson ?? null,
  }).select(columns).single();
  if (error) throw error;
  return fromRow(data as unknown as DecisionRow);
}

export async function saveDecisionLesson(id: string, lesson: string) {
  const { error } = await supabase
    .from('investment_decisions')
    .update({ lesson })
    .eq('id', id);
  if (error) throw error;
}
