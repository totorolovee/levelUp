import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { BrainAssessment } from '../components/BrainAssessment';
import { BrainGameLibrary, type BrainGameId } from '../components/BrainGameLibrary';
import { BrainGameRunner } from '../components/BrainGameRunner';
import {
  loadBrainGameProgress,
  saveBrainGameResult,
  type BrainGameCategory,
  type BrainGameProgress,
} from '../lib/brainGameResults';
import {
  loadBrainTrainingProfile,
  type BrainTrainingProfile,
} from '../lib/brainTrainingProfile';
import { useLanguage } from '../lib/language';

type Stage = 'loading' | 'assessment' | 'library' | 'game' | 'result';

export function BrainTrainingPage() {
  const { language } = useLanguage();
  const isRussian = language === 'ru';
  const [stage, setStage] = useState<Stage>('loading');
  const [profile, setProfile] = useState<BrainTrainingProfile | null>(null);
  const [gameId, setGameId] = useState<BrainGameId>('shade');
  const [category, setCategory] = useState<BrainGameCategory>('attention');
  const [progress, setProgress] = useState<Record<string, BrainGameProgress>>({});
  const [result, setResult] = useState({
    score: 0,
    xp: 0,
    level: 1,
    leveledUp: false,
    isNewRecord: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([loadBrainTrainingProfile(), loadBrainGameProgress()])
      .then(([savedProfile, savedProgress]) => {
        setProfile(savedProfile);
        setProgress(savedProgress);
        setStage(savedProfile ? 'library' : 'assessment');
      })
      .catch(() => setError(isRussian ? 'Не удалось загрузить игры.' : 'Could not load games.'));
  }, [isRussian]);

  const selectGame = (selectedId: BrainGameId, selectedCategory: BrainGameCategory) => {
    setGameId(selectedId);
    setCategory(selectedCategory);
    setError('');
    setStage('game');
  };

  const completeGame = async (score: number) => {
    try {
      const previousBest = progress[gameId]?.bestScore ?? 0;
      const saved = await saveBrainGameResult(gameId, category, score);
      setResult({
        score,
        xp: saved.xpEarned,
        level: saved.currentLevel,
        leveledUp: saved.leveledUp,
        isNewRecord: score > previousBest,
      });
      setProgress((current) => ({
        ...current,
        [gameId]: {
          gameId,
          currentLevel: saved.currentLevel,
          completedCount: (current[gameId]?.completedCount ?? 0) + 1,
          bestScore: Math.max(current[gameId]?.bestScore ?? 0, score),
        },
      }));
      setStage('result');
    } catch {
      setError(isRussian ? 'Не удалось сохранить результат.' : 'Could not save your score.');
    }
  };

  return (
    <main className="shell brain-training-page">
      <AppHeader />
      {stage === 'loading' && <div className="route-loading" />}
      {stage === 'assessment' && <BrainAssessment isRussian={isRussian} onComplete={(saved) => {
        setProfile(saved);
        setStage('library');
      }} />}
      {stage === 'library' && profile && (
        <section className="brain-library-screen">
          <div className="page-intro">
            <h1>{isRussian ? 'Выбери навык и начни игру' : 'Choose a skill and start playing'}</h1>
            <p>{isRussian
              ? 'Двадцать шесть многоуровневых игр развивают внимание, скорость, память, логику и математику.'
              : 'Twenty-six multi-level games train attention, speed, memory, logic, and math.'}</p>
          </div>
          <BrainGameLibrary focus={profile.primaryFocus} isRussian={isRussian} onSelect={selectGame} progress={progress} />
        </section>
      )}
      {stage === 'game' && (
        <>
          <button className="brain-game-back" onClick={() => setStage('library')} type="button">
            ← {isRussian ? 'Все игры' : 'All games'}
          </button>
          <BrainGameRunner
            difficulty={progress[gameId]?.currentLevel ?? 1}
            gameId={gameId}
            isRussian={isRussian}
            memoryNeed={profile?.memoryNeed ?? 3}
            onComplete={completeGame}
          />
        </>
      )}
      {stage === 'result' && (
        <section className="training-result">
          <span>✓</span>
          <p className="eyebrow">{isRussian ? 'Игра завершена' : 'Game complete'}</p>
          <h1>{result.score}/100</h1>
          <p>+{result.xp} XP</p>
          {result.isNewRecord && (
            <div className="new-record">
              <span>🏆</span>
              <strong>{isRussian ? 'Новый личный рекорд!' : 'New personal best!'}</strong>
              <small>{isRussian ? `Лучший score: ${result.score}/100` : `Best score: ${result.score}/100`}</small>
            </div>
          )}
          <p className="result-level">
            {result.leveledUp
              ? (isRussian ? `Новый уровень сложности: ${result.level}` : `New difficulty level: ${result.level}`)
              : (isRussian ? `Уровень сложности: ${result.level}` : `Difficulty level: ${result.level}`)}
          </p>
          <button onClick={() => setStage('library')} type="button">
            {isRussian ? 'Выбрать другую игру' : 'Choose another game'}
          </button>
        </section>
      )}
      {error && <p className="coach-error">{error}</p>}
    </main>
  );
}
