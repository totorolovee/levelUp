import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

const BUCKET = 'avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function getUserAvatarUrl(user: User) {
  const path = user.user_metadata.avatar_path;
  if (typeof path !== 'string' || !path) return null;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 604800);
  return error ? null : `${data.signedUrl}&updated=${encodeURIComponent(user.updated_at ?? '')}`;
}

export async function uploadCurrentUserAvatar(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Выбери изображение JPG, PNG или WebP.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Изображение должно быть не больше 5 МБ.');
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Сначала войди в аккаунт.');
  const path = `${user.id}/avatar`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) throw uploadError;

  const { error: updateError } = await supabase.auth.updateUser({
    data: { avatar_path: path },
  });
  if (updateError) throw updateError;
  const refreshedUser = { ...user, user_metadata: { ...user.user_metadata, avatar_path: path } };
  const avatarUrl = await getUserAvatarUrl(refreshedUser);
  if (!avatarUrl) throw new Error('Не удалось открыть загруженный аватар.');
  return `${avatarUrl}&v=${Date.now()}`;
}
