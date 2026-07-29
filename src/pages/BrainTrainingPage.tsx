import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { AttentionTrainingGame } from '../components/AttentionTrainingGame';
import { MemoryTrainingGame } from '../components/MemoryTrainingGame';
import { SpeedTrainingGame } from '../components/SpeedTrainingGame';
import {
  loadTrainingHistory,
  saveTrainingSession,
  type TrainingHistory,
  type TrainingScores,
} from '../lib/brainTraining';
import { useLanguage } from '../lib/language';
import { BrainAssessment } from '../components/BrainAssessment';
import {
  loadBrainTrainingProfile,
  type BrainTrainingProfile,
} from '../lib/brainTrainingProfile';

type Stage = 'loading' | 'assessment' | 'intro' | 'memory' | 'attention' | 'speed' | 'result';

export function BrainTrainingPage() {
  const { language } = useLanguage();
  const isRussian = language === 'ru';
  const [stage, setStage] = useState<Stage>('loading');
  const [profile, setProfile] = useState<BrainTrainingProfile | null>(null);
  const [scores, setScores] = useState<TrainingScores>({ memory: 0, attention: 0, speed: 0 });
  const [result, setResult] = useState<{ totalScore: number; xpEarned: number } | null>(null);
  const [history, setHistory] = useState<TrainingHistory[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([loadTrainingHistory(), loadBrainTrainingProfile()])
      .then(([savedHistory, savedProfile]) => {
        setHistory(savedHistory);
        setProfile(savedProfile);
        setStage(savedProfile ? 'intro' : 'assessment');
      })
      .catch(() => setError(isRussian ? 'Не удалось загрузить тренировку.' : 'Could not load workout.'));
  }, [isRussian]);

  const finish = async (speed: number) => {
    const completed = { ...scores, speed };
    setScores(completed);
    try {
      const saved = await saveTrainingSession(completed);
      setResult(saved);
      setHistory(await loadTrainingHistory());
      setStage('result');
    } catch {
      setError(isRussian ? 'Не удалось сохранить тренировку.' : 'Could not save this workout.');
    }
  };

  return (
    <main className="shell brain-training-page">
      <AppHeader />
      {stage === 'loading' && <div className="route-loading" />}
      {stage === 'assessment' && <BrainAssessment isRussian={isRussian} onComplete={(saved) => {
        setProfile(saved);
        setStage('intro');
      }} />}
      {stage === 'intro' && (
        <section className="training-intro">
          <p className="eyebrow">{isRussian ? 'Тренировка мозга' : 'Brain workout'}</p>
          <h1>{isRussian ? 'Разбуди мозг за 5 минут' : 'Wake up your brain in 5 minutes'}</h1>
          <p>{isRussian
            ? 'Три коротких упражнения проверят память, внимание и скорость реакции.'
            : 'Three quick exercises test memory, attention, and reaction speed.'}</p>
          {profile && <p className="personal-focus">
            {isRussian ? 'Главный акцент' : 'Main focus'}: <strong>{{
              memory: isRussian ? 'память' : 'memory',
              attention: isRussian ? 'внимание' : 'attention',
              speed: isRussian ? 'скорость' : 'speed',
            }[profile.primaryFocus]}</strong>
          </p>}
          <div className="training-skills">
            <article><span>01</span><strong>{isRussian ? 'Память' : 'Memory'}</strong><small>≈ 1 min</small></article>
            <article><span>02</span><strong>{isRussian ? 'Внимание' : 'Attention'}</strong><small>≈ 2 min</small></article>
            <article><span>03</span><strong>{isRussian ? 'Скорость' : 'Speed'}</strong><small>≈ 1 min</small></article>
          </div>
          <button onClick={() => setStage('memory')} type="button">
            {isRussian ? 'Начать тренировку' : 'Start workout'}
          </button>
          {history[0] && <p className="training-best">
            {isRussian ? 'Последний результат' : 'Latest score'}: <strong>{history[0].totalScore}/100</strong>
          </p>}
        </section>
      )}
      {stage === 'memory' && <MemoryTrainingGame
        isRussian={isRussian}
        sequenceLength={(profile?.memoryNeed ?? 3) >= 4 ? 7 : 6}
        onComplete={(memory) => {
        setScores((current) => ({ ...current, memory }));
        setStage('attention');
      }} />}
      {stage === 'attention' && <AttentionTrainingGame
        isRussian={isRussian}
        onComplete={(attention) => {
        setScores((current) => ({ ...current, attention }));
        setStage('speed');
      }} />}
      {stage === 'speed' && <SpeedTrainingGame
        isRussian={isRussian}
        roundsCount={Math.max(4, 5 + ((profile?.speedNeed ?? 3) - 3))}
        onComplete={finish}
      />}
      {stage === 'result' && result && (
        <section className="training-result">
          <span>✓</span>
          <p className="eyebrow">{isRussian ? 'Тренировка завершена' : 'Workout complete'}</p>
          <h1>{result.totalScore}/100</h1>
          <p>+{result.xpEarned} XP</p>
          <div>
            <strong>{isRussian ? 'Память' : 'Memory'} {scores.memory}</strong>
            <strong>{isRussian ? 'Внимание' : 'Attention'} {scores.attention}</strong>
            <strong>{isRussian ? 'Скорость' : 'Speed'} {scores.speed}</strong>
          </div>
          <button onClick={() => { setResult(null); setStage('intro'); }} type="button">
            {isRussian ? 'Готово' : 'Done'}
          </button>
        </section>
      )}
      {error && <p className="coach-error">{error}</p>}
    </main>
  );
}
