import { supabase } from './supabase';

export type AchievementKey =
  | 'goal_first_step'
  | 'first_investment'
  | 'first_book'
  | 'book_completed'
  | 'streak_3'
  | 'league_joined';

export type AchievementTier = {
  target: number;
  ru: string;
  en: string;
};

export type Achievement = {
  key: AchievementKey;
  icon: string;
  ru: string;
  en: string;
  tiers: [AchievementTier, AchievementTier, AchievementTier];
};

export type AchievementProgress = {
  key: AchievementKey;
  value: number;
};

const tiers = (
  bronze: [number, string, string],
  silver: [number, string, string],
  gold: [number, string, string],
): [AchievementTier, AchievementTier, AchievementTier] => [
  { target: bronze[0], ru: bronze[1], en: bronze[2] },
  { target: silver[0], ru: silver[1], en: silver[2] },
  { target: gold[0], ru: gold[1], en: gold[2] },
];

export const achievementCatalog: Achievement[] = [
  { key: 'goal_first_step', icon: '✓', ru: 'Шаги к цели', en: 'Goal steps', tiers: tiers([1, '1 шаг', '1 step'], [50, '50 шагов', '50 steps'], [100, '100 шагов', '100 steps']) },
  { key: 'first_investment', icon: '↗', ru: 'Инвестор', en: 'Investor', tiers: tiers([1, '1 вложение', '1 investment'], [10, '10 вложений', '10 investments'], [50, '50 вложений', '50 investments']) },
  { key: 'first_book', icon: '◫', ru: 'Читатель', en: 'Reader', tiers: tiers([1, '1 книга', '1 book'], [5, '5 книг', '5 books'], [10, '10 книг', '10 books']) },
  { key: 'book_completed', icon: '★', ru: 'Книги прочитаны', en: 'Books completed', tiers: tiers([1, '1 книга', '1 book'], [5, '5 книг', '5 books'], [15, '15 книг', '15 books']) },
  { key: 'streak_3', icon: '🔥', ru: 'В ритме', en: 'On a roll', tiers: tiers([3, '3 дня', '3 days'], [14, '14 дней', '14 days'], [30, '30 дней', '30 days']) },
  { key: 'league_joined', icon: '♛', ru: 'В игре', en: 'In the game', tiers: tiers([1, 'Вступить в лигу', 'Join a league'], [500, '500 XP', '500 XP'], [2000, '2000 XP', '2000 XP']) },
];

export async function unlockAchievement(key: AchievementKey) {
  const { error } = await supabase.from('achievements').insert({ achievement_key: key });
  if (error && error.code !== '23505') throw error;
}

export async function incrementGoalStepProgress() {
  const { error } = await supabase.rpc('complete_my_goal_step');
  if (error) throw error;
}

export async function loadAchievementProgress(streak: number) {
  const [goals, investments, books, completedBooks, league] = await Promise.all([
    supabase.from('goal_achievement_progress').select('completed_steps').maybeSingle(),
    supabase.from('investment_decisions').select('id', { count: 'exact', head: true }),
    supabase.from('reading_progress').select('id', { count: 'exact', head: true }),
    supabase.from('reading_progress').select('id', { count: 'exact', head: true }).gte('progress', 100),
    supabase.from('league_entries').select('xp').maybeSingle(),
  ]);
  const error = goals.error ?? investments.error ?? books.error
    ?? completedBooks.error ?? league.error;
  if (error) throw error;
  return [
    { key: 'goal_first_step', value: goals.data?.completed_steps ?? 0 },
    { key: 'first_investment', value: investments.count ?? 0 },
    { key: 'first_book', value: books.count ?? 0 },
    { key: 'book_completed', value: completedBooks.count ?? 0 },
    { key: 'streak_3', value: streak },
    { key: 'league_joined', value: league.data ? Math.max(1, league.data.xp) : 0 },
  ] satisfies AchievementProgress[];
}
