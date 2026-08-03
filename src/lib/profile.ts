import { supabase } from './supabase';
import { recordAndLoadDailyStreak } from './dailyActivity';
import { loadExperience } from './experience';
import { getUserAvatarUrl } from './avatars';
import {
  loadAchievementProgress,
  type AchievementProgress,
} from './achievements';

export type UserProfile = {
  email: string;
  displayName: string;
  avatarLetter: string;
  avatarUrl: string | null;
  dailyStreak: number;
  xp: number;
  rankName: string;
  nextRankName: string | null;
  xpToNextRank: number;
  rankProgress: number;
  leaguePosition: number | null;
  usernameChangeAvailableAt: string | null;
  registeredAt: string;
  achievements: AchievementProgress[];
};

type LeagueStanding = {
  rank_position: number;
  is_current_user: boolean;
};

async function loadLeaguePosition(displayName: string) {
  await supabase.rpc('sync_my_league_entry', {
    chosen_username: displayName.slice(0, 30),
  });
  const { data, error } = await supabase.rpc('get_league_leaderboard');
  if (error) return null;
  const standing = (data as LeagueStanding[] | null)
    ?.find(({ is_current_user }) => is_current_user);
  return standing ? Number(standing.rank_position) : null;
}

async function loadUsernameChangeAvailability(userId: string) {
  const { data, error } = await supabase
    .from('username_changes')
    .select('last_changed_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const availableAt = new Date(data.last_changed_at);
  availableAt.setDate(availableAt.getDate() + 14);
  return availableAt.toISOString();
}

export async function loadCurrentProfile(): Promise<UserProfile | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (!userData.user) return null;
  if (userError) throw userError;

  const user = userData.user;
  const metadataName = user.user_metadata.display_name
    ?? user.user_metadata.full_name
    ?? user.user_metadata.name;
  const email = user.email ?? 'Email не указан';
  const displayName = typeof metadataName === 'string' && metadataName.trim()
    ? metadataName.trim()
    : email.split('@')[0];
  const activity = await recordAndLoadDailyStreak(user.id).catch(() => ({
    streak: 0,
    totalActiveDays: 0,
  }));
  const experience = await loadExperience(activity.totalActiveDays).catch(() => ({
    xp: 0,
    rankName: 'Новичок 1',
    nextRankName: 'Новичок 2',
    xpToNextRank: 35,
    rankProgress: 0,
  }));
  const [leaguePosition, usernameChangeAvailableAt] = await Promise.all([
    loadLeaguePosition(displayName).catch(() => null),
    loadUsernameChangeAvailability(user.id).catch(() => null),
  ]);
  const achievements = await loadAchievementProgress(activity.streak).catch(() => []);

  return {
    email,
    displayName,
    avatarLetter: displayName.charAt(0).toLocaleUpperCase('ru-RU') || '?',
    avatarUrl: await getUserAvatarUrl(user),
    dailyStreak: activity.streak,
    ...experience,
    leaguePosition,
    usernameChangeAvailableAt,
    registeredAt: user.created_at,
    achievements,
  };
}

export async function updateCurrentUsername(value: string) {
  const displayName = value.trim();
  if (displayName.length < 2 || displayName.length > 30) {
    throw new Error('Username должен содержать от 2 до 30 символов.');
  }
  const { data, error } = await supabase.rpc('change_my_username', {
    new_username: displayName,
  });
  if (error) throw error;
  const { error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) throw refreshError;
  await supabase.rpc('sync_my_league_entry', {
    chosen_username: displayName,
  });
  return {
    displayName,
    nextChangeAt: String(data),
  };
}
