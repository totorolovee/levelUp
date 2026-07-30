import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createDailyPlan,
  loadBrainDashboard,
  type BrainDashboardData,
  type DailyBrainGame,
} from './brainDashboard';
import {
  loadBrainGameProgress,
  type BrainGameProgress,
} from './brainGameResults';
import { generateBrainRecommendation } from './brainRecommendation';
import type { Language } from './language';
import {
  loadBrainTrainingProfile,
  type BrainTrainingProfile,
} from './brainTrainingProfile';

export type BrainTrainingStage =
  'loading' | 'assessment' | 'library' | 'preview' | 'game' | 'result' | 'daily-result';

export function useBrainTrainingData(language: Language) {
  const isRussian = language === 'ru';
  const recommendationRequest = useRef(0);
  const [stage, setStage] = useState<BrainTrainingStage>('loading');
  const [profile, setProfile] = useState<BrainTrainingProfile | null>(null);
  const [dashboard, setDashboard] = useState<BrainDashboardData | null>(null);
  const [progress, setProgress] = useState<Record<string, BrainGameProgress>>({});
  const [plan, setPlan] = useState<DailyBrainGame[]>([]);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  const prepareDashboard = useCallback((
    savedDashboard: BrainDashboardData,
    savedProfile: BrainTrainingProfile,
    savedProgress: Record<string, BrainGameProgress>,
  ) => {
    const dailyPlan = createDailyPlan(savedDashboard, savedProfile, savedProgress);
    const requestId = ++recommendationRequest.current;
    setDashboard(savedDashboard);
    setPlan(dailyPlan);
    setRecommendation('');
    void generateBrainRecommendation(savedDashboard, dailyPlan, language)
      .then((text) => {
        if (requestId === recommendationRequest.current) setRecommendation(text);
      })
      .catch(() => {
        if (requestId !== recommendationRequest.current) return;
        setRecommendation(isRussian
          ? 'Сегодня начни с навыков, которые тренировались реже всего.'
          : 'Start today with the skills you have practiced least.');
      });
  }, [isRussian, language]);

  useEffect(() => {
    let isActive = true;
    setStage('loading');
    setError('');
    Promise.all([loadBrainTrainingProfile(), loadBrainGameProgress(), loadBrainDashboard()])
      .then(([savedProfile, savedProgress, savedDashboard]) => {
        if (!isActive) return;
        setProfile(savedProfile);
        setProgress(savedProgress);
        if (savedProfile) prepareDashboard(savedDashboard, savedProfile, savedProgress);
        else setDashboard(savedDashboard);
        setStage(savedProfile ? 'library' : 'assessment');
      })
      .catch(() => {
        if (isActive) setError(isRussian ? 'Не удалось загрузить тренировки.' : 'Could not load training.');
      });
    return () => {
      isActive = false;
      recommendationRequest.current += 1;
    };
  }, [isRussian, prepareDashboard]);

  const completeAssessment = (savedProfile: BrainTrainingProfile) => {
    setProfile(savedProfile);
    if (dashboard) prepareDashboard(dashboard, savedProfile, progress);
    setStage('library');
  };

  const refreshDashboard = () => {
    if (!profile) return;
    void loadBrainDashboard()
      .then((next) => prepareDashboard(next, profile, progress))
      .catch(() => setError(isRussian ? 'Не удалось обновить прогресс.' : 'Could not refresh progress.'));
  };

  return {
    completeAssessment, dashboard, error, plan, profile, progress, recommendation,
    refreshDashboard, setError, setProgress, setStage, stage,
  };
}
