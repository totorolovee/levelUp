import { supabase } from './supabase';

const ranks = [
  { name: 'Новичок 1', xp: 0 },
  { name: 'Новичок 2', xp: 35 },
  { name: 'Новичок 3', xp: 70 },
  { name: 'Исследователь 1', xp: 100 },
  { name: 'Исследователь 2', xp: 165 },
  { name: 'Исследователь 3', xp: 235 },
  { name: 'Стратег 1', xp: 300 },
  { name: 'Стратег 2', xp: 400 },
  { name: 'Стратег 3', xp: 500 },
  { name: 'Мастер 1', xp: 600 },
  { name: 'Мастер 2', xp: 735 },
  { name: 'Мастер 3', xp: 870 },
  { name: 'Легенда 1', xp: 1000 },
  { name: 'Легенда 2', xp: 1335 },
  { name: 'Легенда 3', xp: 1670 },
  { name: 'Божество 1', xp: 2000 },
  { name: 'Божество 2', xp: 2500 },
  { name: 'Божество 3', xp: 3000 },
];

type ProgressRow = {
  progress: number;
};

export async function loadExperience(totalActiveDays: number) {
  const { data, error } = await supabase
    .from('reading_progress')
    .select('progress');
  if (error) throw error;

  const readingXp = ((data ?? []) as ProgressRow[])
    .reduce((sum, book) => sum + book.progress, 0);
  const xp = totalActiveDays * 25 + readingXp;
  let currentIndex = 0;
  ranks.forEach((rank, index) => {
    if (xp >= rank.xp) currentIndex = index;
  });
  const current = ranks[currentIndex];
  const next = ranks[currentIndex + 1] ?? null;
  const rankProgress = next
    ? Math.round(((xp - current.xp) / (next.xp - current.xp)) * 100)
    : 100;

  return {
    xp,
    rankName: current.name,
    nextRankName: next?.name ?? null,
    xpToNextRank: next ? next.xp - xp : 0,
    rankProgress,
  };
}
