import { supabase } from './supabase';

export type BrainFocus = 'memory' | 'attention' | 'speed';

export type BrainTrainingProfile = {
  memoryNeed: number;
  attentionNeed: number;
  speedNeed: number;
  primaryFocus: BrainFocus;
  educationLevel: string;
};

export async function loadBrainTrainingProfile(): Promise<BrainTrainingProfile | null> {
  const { data, error } = await supabase
    .from('brain_training_profiles')
    .select('memory_need, attention_need, speed_need, primary_focus, education_level')
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    memoryNeed: data.memory_need,
    attentionNeed: data.attention_need,
    speedNeed: data.speed_need,
    primaryFocus: data.primary_focus as BrainFocus,
    educationLevel: data.education_level,
  };
}

export async function saveBrainTrainingProfile(
  profile: BrainTrainingProfile,
  answers: Record<string, number>,
) {
  const { error } = await supabase.from('brain_training_profiles').upsert({
    memory_need: profile.memoryNeed,
    attention_need: profile.attentionNeed,
    speed_need: profile.speedNeed,
    primary_focus: profile.primaryFocus,
    education_level: profile.educationLevel,
    answers,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  return profile;
}
