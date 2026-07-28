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

type PurchaseResult = {
  balance: number | string;
  decision: DecisionRow;
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

export async function loadInvestmentBalance() {
  const { data, error } = await supabase.rpc('get_my_investment_balance');
  if (error) throw error;
  return Number(data);
}

export async function saveInvestmentDecision(
  decision: Omit<Decision, 'id' | 'createdAt'>,
) {
  const { data, error } = await supabase.rpc('buy_investment', {
    chosen_symbol: decision.symbol,
    chosen_company: decision.company,
    chosen_quantity: decision.quantity,
    chosen_price: decision.price,
    chosen_reason: decision.reason,
    chosen_risk: decision.risk,
    chosen_invalidation: decision.invalidation,
    chosen_horizon: decision.horizon,
    chosen_confidence: decision.confidence,
    chosen_analysis_approved: decision.analysisApproved,
    chosen_analysis_feedback: decision.analysisFeedback,
  });
  if (error) throw error;
  const result = data as unknown as PurchaseResult;
  return {
    balance: Number(result.balance),
    decision: fromRow(result.decision),
  };
}

export async function saveDecisionLesson(id: string, lesson: string) {
  const { error } = await supabase
    .from('investment_decisions')
    .update({ lesson })
    .eq('id', id);
  if (error) throw error;
}
