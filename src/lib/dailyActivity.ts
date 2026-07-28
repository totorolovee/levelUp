import { supabase } from './supabase';

type ActivityRow = {
  activity_date: string;
};

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function recordAndLoadDailyStreak(userId: string) {
  const today = new Date();
  const { error: insertError } = await supabase.from('daily_activity').upsert(
    { user_id: userId, activity_date: toLocalDateKey(today) },
    { onConflict: 'user_id,activity_date', ignoreDuplicates: true },
  );
  if (insertError) throw insertError;

  const { data, error } = await supabase
    .from('daily_activity')
    .select('activity_date')
    .order('activity_date', { ascending: false })
    .limit(366);
  if (error) throw error;

  const activeDates = new Set(
    ((data ?? []) as ActivityRow[]).map((row) => row.activity_date),
  );
  const checkedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  let streak = 0;

  while (activeDates.has(toLocalDateKey(checkedDate))) {
    streak += 1;
    checkedDate.setDate(checkedDate.getDate() - 1);
  }

  return { streak, totalActiveDays: activeDates.size };
}
