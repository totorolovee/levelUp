import { supabase } from './supabase';

type ReadingProgressRow = {
  book_title: string;
  progress: number;
};

export async function loadReadingProgress() {
  const { data, error } = await supabase
    .from('reading_progress')
    .select('book_title, progress')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ReadingProgressRow[];
}

export async function saveReadingProgress(bookTitle: string, progress: number) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const { error } = await supabase.from('reading_progress').upsert(
    {
      user_id: userData.user.id,
      book_title: bookTitle,
      progress,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,book_title' },
  );

  if (error) throw error;
}
