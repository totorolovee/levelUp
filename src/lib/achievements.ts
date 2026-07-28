import { supabase } from './supabase';

export type AchievementKey =
  | 'goal_first_step'
  | 'first_investment'
  | 'first_book'
  | 'book_completed'
  | 'streak_3'
  | 'league_joined';

export type Achievement = {
  key: AchievementKey;
  icon: string;
  ru: string;
  en: string;
  ruDescription: string;
  enDescription: string;
};

export const achievementCatalog: Achievement[] = [
  { key: 'goal_first_step', icon: '✓', ru: 'Первый шаг', en: 'First step', ruDescription: 'Выполни первый шаг к цели', enDescription: 'Complete your first goal step' },
  { key: 'first_investment', icon: '↗', ru: 'Первое вложение', en: 'First investment', ruDescription: 'Добавь первую акцию', enDescription: 'Add your first stock' },
  { key: 'first_book', icon: '◫', ru: 'Начало истории', en: 'A story begins', ruDescription: 'Выбери первую книгу', enDescription: 'Choose your first book' },
  { key: 'book_completed', icon: '★', ru: 'Книга прочитана', en: 'Book completed', ruDescription: 'Дойди до 100% чтения', enDescription: 'Reach 100% reading progress' },
  { key: 'streak_3', icon: '🔥', ru: 'В ритме', en: 'On a roll', ruDescription: 'Заходи 3 дня подряд', enDescription: 'Return for 3 days in a row' },
  { key: 'league_joined', icon: '♛', ru: 'В игре', en: 'In the game', ruDescription: 'Вступи в первую лигу', enDescription: 'Join your first league' },
];

export async function unlockAchievement(key: AchievementKey) {
  const { error } = await supabase
    .from('achievements')
    .insert({ achievement_key: key });
  if (error && error.code !== '23505') throw error;
}

export async function loadAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select('achievement_key');
  if (error) throw error;
  return (data ?? []).map(({ achievement_key }) => achievement_key as AchievementKey);
}

export async function syncEarnedAchievements(streak: number) {
  const [investments, books, completedBooks, league] = await Promise.all([
    supabase.from('investment_decisions').select('id', { count: 'exact', head: true }),
    supabase.from('reading_progress').select('id', { count: 'exact', head: true }),
    supabase.from('reading_progress').select('id', { count: 'exact', head: true }).gte('progress', 100),
    supabase.from('league_entries').select('user_id', { count: 'exact', head: true }),
  ]);
  const earned: AchievementKey[] = [];
  if ((investments.count ?? 0) > 0) earned.push('first_investment');
  if ((books.count ?? 0) > 0) earned.push('first_book');
  if ((completedBooks.count ?? 0) > 0) earned.push('book_completed');
  if ((league.count ?? 0) > 0) earned.push('league_joined');
  if (streak >= 3) earned.push('streak_3');
  await Promise.all(earned.map((key) =>
    unlockAchievement(key).catch(() => undefined),
  ));
}
