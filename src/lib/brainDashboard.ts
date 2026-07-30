import { brainGameCategories, type BrainGameId } from './brainGameCatalog';
import type { BrainGameCategory, BrainGameProgress } from './brainGameResults';
import type { BrainTrainingProfile } from './brainTrainingProfile';
import { supabase } from './supabase';

export type BrainSkillId = 'attention' | 'memory' | 'speed' | 'logic' | 'focus';

export type BrainDashboardData = {
  activeDates: string[];
  brainScore: number;
  level: number;
  skills: Record<BrainSkillId, number>;
  streak: number;
  todayScore: number | null;
  totalGames: number;
  totalXp: number;
  yesterdayScore: number | null;
};

export type DailyBrainGame = {
  id: BrainGameId;
  category: BrainGameCategory;
};

type ResultRow = {
  game_id: string;
  category: BrainGameCategory;
  score: number;
  xp_earned: number;
  created_at: string;
};

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function average(values: number[]) {
  return values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 0;
}

function recentAverage(rows: ResultRow[], predicate: (row: ResultRow) => boolean) {
  return average(rows.filter(predicate).slice(0, 8).map((row) => row.score));
}

function calculateStreak(activeDates: Set<string>) {
  const today = new Date();
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  if (!activeDates.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (activeDates.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function loadBrainDashboard(): Promise<BrainDashboardData> {
  const { data, error } = await supabase
    .from('brain_game_results')
    .select('game_id,category,score,xp_earned,created_at')
    .order('created_at', { ascending: false })
    .limit(1000);
  if (error) throw error;
  const rows = (data ?? []) as ResultRow[];
  const activeDates = new Set(rows.map((row) => localDateKey(new Date(row.created_at))));
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const scoresForDate = (date: Date) => rows
    .filter((row) => localDateKey(new Date(row.created_at)) === localDateKey(date))
    .map((row) => row.score);
  const focusGames = new Set(['shade', 'scan', 'switch', 'focus-match']);
  const skills = {
    attention: recentAverage(rows, (row) => row.category === 'attention'),
    memory: recentAverage(rows, (row) => row.category === 'memory'),
    speed: recentAverage(rows, (row) => row.category === 'speed'),
    logic: recentAverage(rows, (row) => row.category === 'logic' || row.category === 'math'),
    focus: recentAverage(rows, (row) => focusGames.has(row.game_id)),
  };
  const skillValues = Object.values(skills).filter((value) => value > 0);
  const todayScores = scoresForDate(today);
  const yesterdayScores = scoresForDate(yesterday);
  const totalXp = rows.reduce((sum, row) => sum + row.xp_earned, 0);
  return {
    activeDates: [...activeDates],
    brainScore: average(skillValues),
    level: Math.floor(totalXp / 250) + 1,
    skills,
    streak: calculateStreak(activeDates),
    todayScore: todayScores.length ? average(todayScores) : null,
    totalGames: rows.length,
    totalXp,
    yesterdayScore: yesterdayScores.length ? average(yesterdayScores) : null,
  };
}

export function createDailyPlan(
  dashboard: BrainDashboardData,
  profile: BrainTrainingProfile,
  progress: Record<string, BrainGameProgress>,
): DailyBrainGame[] {
  const categoryScores: Record<BrainGameCategory, number> = {
    attention: dashboard.skills.attention || (profile.primaryFocus === 'attention' ? -1 : 0),
    memory: dashboard.skills.memory || (profile.primaryFocus === 'memory' ? -1 : 0),
    speed: dashboard.skills.speed || (profile.primaryFocus === 'speed' ? -1 : 0),
    logic: dashboard.skills.logic,
    math: dashboard.skills.logic,
  };
  return brainGameCategories
    .slice()
    .sort((first, second) => categoryScores[first.id] - categoryScores[second.id])
    .slice(0, 3)
    .map((category) => ({
      category: category.id,
      id: category.games.slice().sort((first, second) =>
        (progress[first.id]?.completedCount ?? 0) - (progress[second.id]?.completedCount ?? 0))[0].id,
    }));
}
