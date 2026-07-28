import { supabase } from './supabase';

export type ReflectionEntry = {
  id: string;
  date: string;
  mood: number;
  energy: number;
  note: string;
};

type ReflectionRow = {
  id: string;
  entry_date: string;
  mood: number;
  energy: number;
  note: string;
};

const columns = 'id,entry_date,mood,energy,note';

function fromRow(row: ReflectionRow): ReflectionEntry {
  return {
    id: row.id,
    date: row.entry_date,
    mood: row.mood,
    energy: row.energy,
    note: row.note,
  };
}

export async function loadReflections() {
  const { data, error } = await supabase
    .from('reflection_entries')
    .select(columns)
    .order('entry_date', { ascending: false })
    .limit(14);
  if (error) throw error;
  return (data as unknown as ReflectionRow[]).map(fromRow);
}

export async function saveTodayReflection(mood: number, energy: number, note: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('Authentication required');
  const today = new Date().toLocaleDateString('en-CA');
  const { data, error } = await supabase.from('reflection_entries').upsert({
    user_id: userData.user.id,
    entry_date: today,
    mood,
    energy,
    note: note.trim(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,entry_date' }).select(columns).single();
  if (error) throw error;
  return fromRow(data as unknown as ReflectionRow);
}
