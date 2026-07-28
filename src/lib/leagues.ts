import { supabase } from './supabase';
import { loadCurrentProfile } from './profile';
import { unlockAchievement } from './achievements';

export type LeagueId = 'bronze' | 'silver' | 'gold' | 'diamond' | 'master';

export type LeaguePlayer = {
  username: string;
  xp: number;
  league: LeagueId;
  rankPosition: number;
  isCurrentUser: boolean;
};

export const leagueLevels: Array<{
  id: LeagueId;
  minXp: number;
  icon: string;
  ru: string;
  en: string;
}> = [
  { id: 'bronze', minXp: 0, icon: '●', ru: 'Бронза', en: 'Bronze' },
  { id: 'silver', minXp: 500, icon: '◆', ru: 'Серебро', en: 'Silver' },
  { id: 'gold', minXp: 1000, icon: '★', ru: 'Золото', en: 'Gold' },
  { id: 'diamond', minXp: 2000, icon: '◇', ru: 'Алмаз', en: 'Diamond' },
  { id: 'master', minXp: 3000, icon: '♛', ru: 'Мастер', en: 'Master' },
];

type LeaderboardRow = {
  username: string;
  xp: number;
  league: LeagueId;
  rank_position: number;
  is_current_user: boolean;
};

export async function loadLeagueLeaderboard() {
  const profile = await loadCurrentProfile();
  if (!profile) return null;

  const { error: syncError } = await supabase.rpc('sync_my_league_entry', {
    chosen_username: profile.displayName.slice(0, 30),
  });
  if (syncError) throw syncError;
  void unlockAchievement('league_joined').catch(() => undefined);

  const { data, error } = await supabase.rpc('get_league_leaderboard');
  if (error) throw error;
  const players = (data as LeaderboardRow[]).map((row) => ({
    username: row.username,
    xp: row.xp,
    league: row.league,
    rankPosition: Number(row.rank_position),
    isCurrentUser: row.is_current_user,
  }));
  const currentPlayer = players.find((player) => player.isCurrentUser);
  return currentPlayer ? { currentPlayer, players } : null;
}
