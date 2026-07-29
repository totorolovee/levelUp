import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loadReadingProgress, saveReadingProgress } from './readingProgress';
import { supabase } from './supabase';
import { unlockAchievement } from './achievements';

type ReadingContextValue = {
  selectedTitles: string[];
  progress: Record<string, number>;
  chooseBook: (title: string) => void;
  updateProgress: (title: string, value: number) => void;
};

const ReadingContext = createContext<ReadingContextValue | null>(null);

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      try {
        const rows = await loadReadingProgress();
        if (!isActive) return;
        setSelectedTitles(rows.map((row) => row.book_title));
        setProgress(Object.fromEntries(rows.map((row) => [row.book_title, row.progress])));
      } catch {
        // Локальный прогресс продолжает работать, даже если сеть временно недоступна.
      }
    };

    void load();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') window.setTimeout(() => void load(), 0);
      if (event === 'SIGNED_OUT') {
        setSelectedTitles([]);
        setProgress({});
      }
    });

    return () => {
      isActive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const chooseBook = (title: string) => {
    setSelectedTitles((current) =>
      current.includes(title) ? current : [...current, title],
    );
    setProgress((current) => ({ ...current, [title]: current[title] ?? 0 }));
    void saveReadingProgress(title, progress[title] ?? 0);
    void unlockAchievement('first_book').catch(() => undefined);
  };

  const updateProgress = (title: string, value: number) => {
    setProgress((current) => {
      const previous = current[title] ?? 0;
      const next = Math.max(previous, value);
      if (next !== previous) {
        void saveReadingProgress(title, next);
        if (next >= 100) {
          void unlockAchievement('book_completed').catch(() => undefined);
        }
      }
      return { ...current, [title]: next };
    });
  };

  return (
    <ReadingContext.Provider
      value={{ selectedTitles, progress, chooseBook, updateProgress }}
    >
      {children}
    </ReadingContext.Provider>
  );
}

export function useReading() {
  const context = useContext(ReadingContext);
  if (!context) throw new Error('useReading must be used inside ReadingProvider');
  return context;
}
