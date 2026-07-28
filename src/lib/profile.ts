import { supabase } from './supabase';

export type UserProfile = {
  email: string;
  displayName: string;
  avatarLetter: string;
  entriesCount: number;
  registeredAt: string;
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
  const { count, error: countError } = await supabase
    .from('entries')
    .select('id', { count: 'exact', head: true });

  if (countError) throw countError;

  return {
    email,
    displayName,
    avatarLetter: displayName.charAt(0).toLocaleUpperCase('ru-RU') || '?',
    entriesCount: count ?? 0,
    registeredAt: user.created_at,
  };
}
