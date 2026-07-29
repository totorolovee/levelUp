import { supabase } from './supabase';

export type TrainingScores = {
  memory: number;
  attention: number;
  speed: number;
};

export type TrainingHistory = {
  id: string;
  totalScore: number;
  xpEarned: number;
  createdAt: Date;
};

export async function saveTrainingSession(scores: TrainingScores) {
  const totalScore = Math.round((scores.memory + scores.attention + scores.speed) / 3);
  const xpEarned = Math.max(15, Math.round(totalScore * 0.6));
  const { error } = await supabase.from('brain_training_sessions').insert({
    memory_score: scores.memory,
    attention_score: scores.attention,
    speed_score: scores.speed,
    total_score: totalScore,
    xp_earned: xpEarned,
  });
  if (error) throw error;
  return { totalScore, xpEarned };
}

export async function loadTrainingHistory(): Promise<TrainingHistory[]> {
  const { data, error } = await supabase
    .from('brain_training_sessions')
    .select('id, total_score, xp_earned, created_at')
    .order('created_at', { ascending: false })
    .limit(7);
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    totalScore: row.total_score,
    xpEarned: row.xp_earned,
    createdAt: new Date(row.created_at),
  }));
}
