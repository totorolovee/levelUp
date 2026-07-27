import { createContext, useContext, useState, type ReactNode } from 'react';

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

  const chooseBook = (title: string) => {
    setSelectedTitles((current) =>
      current.includes(title) ? current : [...current, title],
    );
    setProgress((current) => ({ ...current, [title]: current[title] ?? 0 }));
  };

  const updateProgress = (title: string, value: number) => {
    setProgress((current) => ({ ...current, [title]: value }));
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
