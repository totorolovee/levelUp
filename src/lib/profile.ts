import { supabase } from './supabase';
import { recordAndLoadDailyStreak } from './dailyActivity';
import { loadExperience } from './experience';
import { getUserAvatarUrl } from './avatars';
import {
  loadAchievements,
  syncEarnedAchievements,
  type AchievementKey,
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
  registeredAt: string;
  achievements: AchievementKey[];
};

export async function loadCurrentProfile(): Promise<UserProfile | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) return null;

  const user = userData.user;
  const metadataName = user.user_metadata.full_name
    ?? user.user_metadata.name
    ?? user.user_metadata.display_name;
  const email = user.email ?? 'Email не указан';
  const displayName = typeof metadataName === 'string' && metadataName.trim()
    ? metadataName.trim()
    : email.split('@')[0];
  const activity = await recordAndLoadDailyStreak(user.id);
  const experience = await loadExperience(activity.totalActiveDays);
  await syncEarnedAchievements(activity.streak);
  const achievements = await loadAchievements();

  return {
    email,
    displayName,
    avatarLetter: displayName.charAt(0).toLocaleUpperCase('ru-RU') || '?',
    avatarUrl: await getUserAvatarUrl(user),
    dailyStreak: activity.streak,
    ...experience,
    registeredAt: user.created_at,
    achievements,
  };
}
