import { supabase } from './supabase';

const ranks = [
  { name: 'Новичок', xp: 0 },
  { name: 'Исследователь', xp: 100 },
  { name: 'Стратег', xp: 300 },
  { name: 'Мастер', xp: 600 },
  { name: 'Легенда', xp: 1000 },
  { name: 'Божество', xp: 2000 },
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
