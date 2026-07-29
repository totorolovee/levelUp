import { supabase } from './supabase';
import type { BrainFocus } from './brainTrainingProfile';

export type BrainGameCategory = BrainFocus | 'logic';

export type BrainGameProgress = {
  gameId: string;
  currentLevel: number;
  completedCount: number;
  bestScore: number;
};

export async function saveBrainGameResult(
  gameId: string,
  category: BrainGameCategory,
  score: number,
) {
  const { data, error } = await supabase.rpc('record_brain_game_result', {
    chosen_game_id: gameId,
    chosen_category: category,
    chosen_score: score,
  });
  if (error) throw error;
  const result = data as unknown as {
    xp_earned: number;
    current_level: number;
    leveled_up: boolean;
  };
  return {
    xpEarned: result.xp_earned,
    currentLevel: result.current_level,
    leveledUp: result.leveled_up,
  };
}

export async function loadBrainGameProgress() {
  const { data, error } = await supabase
    .from('brain_game_progress')
    .select('game_id, current_level, completed_count, best_score');
  if (error) throw error;
  return Object.fromEntries(data.map((row) => [row.game_id, {
    gameId: row.game_id,
    currentLevel: row.current_level,
    completedCount: row.completed_count,
    bestScore: row.best_score,
  } as BrainGameProgress]));
}
