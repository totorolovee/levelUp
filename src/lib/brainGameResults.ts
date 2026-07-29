import { supabase } from './supabase';
import type { BrainFocus } from './brainTrainingProfile';

export async function saveBrainGameResult(
  gameId: string,
  category: BrainFocus,
  score: number,
) {
  const { data, error } = await supabase.rpc('record_brain_game_result', {
    chosen_game_id: gameId,
    chosen_category: category,
    chosen_score: score,
  });
  if (error) throw error;
  return Number(data);
}
