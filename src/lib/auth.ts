import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export async function loadCurrentSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function getAuthErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  if (message.includes('invalid login credentials')) {
    return 'Неверный email или пароль.';
  }
  if (message.includes('email not confirmed')) {
    return 'Сначала подтверди email по ссылке из письма.';
  }
  if (message.includes('user already registered')) {
    return 'Аккаунт с таким email уже существует. Переключись на «Вход».';
  }
  if (message.includes('password should be') || message.includes('weak password')) {
    return 'Пароль слишком простой. Используй минимум 6 символов.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Слишком много попыток. Подожди несколько минут и попробуй снова.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Нет связи с сервером. Проверь интернет и попробуй снова.';
  }
  return 'Не удалось войти. Проверь данные и попробуй ещё раз.';
}
