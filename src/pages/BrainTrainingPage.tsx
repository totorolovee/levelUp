import { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { BrainAssessment } from '../components/BrainAssessment';
import { BrainGameLibrary } from '../components/BrainGameLibrary';
import { BrainGamePreview } from '../components/BrainGamePreview';
import { BrainGameResultScreen, type BrainGameResultData } from '../components/BrainGameResultScreen';
import { BrainGameRunner } from '../components/BrainGameRunner';
import { BrainTrainingDashboard } from '../components/BrainTrainingDashboard';
import { DailyTrainingResult } from '../components/DailyTrainingResult';
import type { BrainGameId } from '../lib/brainGameCatalog';
import {
  saveBrainGameResult,
  type BrainGameCategory,
} from '../lib/brainGameResults';
import { useLanguage } from '../lib/language';
import { useBrainTrainingData } from '../lib/useBrainTrainingData';

export function BrainTrainingPage() {
  const { language } = useLanguage();
  const isRussian = language === 'ru';
  const {
    completeAssessment, dashboard, error, plan, profile, progress, recommendation,
    refreshDashboard, setError, setProgress, setStage, stage,
  } = useBrainTrainingData(language);
  const [gameId, setGameId] = useState<BrainGameId>('shade');
  const [category, setCategory] = useState<BrainGameCategory>('attention');
  const [result, setResult] = useState<BrainGameResultData>({ score: 0, xp: 0, level: 1, leveledUp: false, isNewRecord: false });
  const [dailyIndex, setDailyIndex] = useState(0);
  const [dailyResults, setDailyResults] = useState<BrainGameResultData[]>([]);
  const [isDailyTraining, setIsDailyTraining] = useState(false);
  const selectGame = (id: BrainGameId, selectedCategory: BrainGameCategory) => {
    setIsDailyTraining(false);
    setGameId(id);
    setCategory(selectedCategory);
    setError('');
    setStage('preview');
  };

  const startDailyTraining = () => {
    const first = plan[0];
    if (!first) return;
    setIsDailyTraining(true);
    setDailyIndex(0);
    setDailyResults([]);
    setGameId(first.id);
    setCategory(first.category);
    setStage('game');
  };

  const completeGame = async (score: number) => {
    try {
      const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
      const previousBest = progress[gameId]?.bestScore ?? 0;
      const saved = await saveBrainGameResult(gameId, category, normalizedScore);
      const nextResult = {
        score: normalizedScore,
        xp: saved.xpEarned,
        level: saved.currentLevel,
        leveledUp: saved.leveledUp,
        isNewRecord: normalizedScore > previousBest,
      };
      setResult(nextResult);
      if (isDailyTraining) setDailyResults((current) => [...current, nextResult]);
      setProgress((current) => ({
        ...current,
        [gameId]: {
          gameId,
          currentLevel: saved.currentLevel,
          completedCount: (current[gameId]?.completedCount ?? 0) + 1,
          bestScore: Math.max(previousBest, normalizedScore),
        },
      }));
      setStage('result');
    } catch {
      setError(isRussian ? 'Не удалось сохранить результат.' : 'Could not save your score.');
    }
  };

  const continueAfterResult = () => {
    if (!isDailyTraining) {
      setStage('library');
      refreshDashboard();
      return;
    }
    const next = plan[dailyIndex + 1];
    if (!next) {
      setStage('daily-result');
      return;
    }
    setDailyIndex((value) => value + 1);
    setGameId(next.id);
    setCategory(next.category);
    setStage('game');
  };

  const finishDailyTraining = () => {
    setIsDailyTraining(false);
    setStage('library');
    refreshDashboard();
  };

  const leaveGame = () => {
    setIsDailyTraining(false);
    setDailyResults([]);
    setStage('library');
  };

  return (
    <main className="shell brain-training-page">
      <AppHeader />
      {stage === 'loading' && <div className="route-loading" />}
      {stage === 'assessment' && <BrainAssessment isRussian={isRussian} onComplete={completeAssessment} />}
      {stage === 'library' && profile && dashboard && (
        <section className="brain-library-screen">
          <BrainTrainingDashboard dashboard={dashboard} isRussian={isRussian} onStart={startDailyTraining} plan={plan} recommendation={recommendation} />
          <div className="all-games-heading"><p className="eyebrow">{isRussian ? 'Каталог' : 'Library'}</p><h2>{isRussian ? 'Все игры' : 'All games'}</h2></div>
          <BrainGameLibrary focus={profile.primaryFocus} isRussian={isRussian} onSelect={selectGame} progress={progress} />
        </section>
      )}
      {stage === 'game' && <>
        <button className="brain-game-back" onClick={leaveGame} type="button">← {isRussian ? 'Выйти из игры' : 'Leave game'}</button>
        <BrainGameRunner difficulty={progress[gameId]?.currentLevel ?? 1} gameId={gameId} isRussian={isRussian} memoryNeed={profile?.memoryNeed ?? 3} onComplete={completeGame} />
      </>}
      {stage === 'preview' && <BrainGamePreview category={category} gameId={gameId} isRussian={isRussian} onBack={() => setStage('library')} onStart={() => setStage('game')} progress={progress[gameId]} />}
      {stage === 'result' && <BrainGameResultScreen dailyPosition={isDailyTraining ? { current: dailyIndex + 1, total: plan.length } : undefined} isRussian={isRussian} onContinue={continueAfterResult} result={result} />}
      {stage === 'daily-result' && dashboard && <DailyTrainingResult dashboard={dashboard} isRussian={isRussian} onDone={finishDailyTraining} results={dailyResults} />}
      {error && <p className="coach-error">{error}</p>}
    </main>
  );
}
