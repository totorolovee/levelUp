import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { AttentionTrainingGame } from '../components/AttentionTrainingGame';
import { BrainAssessment } from '../components/BrainAssessment';
import { BrainGameLibrary, type BrainGameId } from '../components/BrainGameLibrary';
import { MemoryTrainingGame } from '../components/MemoryTrainingGame';
import { SpeedTrainingGame } from '../components/SpeedTrainingGame';
import { PairMatchGame } from '../components/brainGames/PairMatchGame';
import { PatternRecallGame } from '../components/brainGames/PatternRecallGame';
import { QuickCompareGame } from '../components/brainGames/QuickCompareGame';
import { RapidMathGame } from '../components/brainGames/RapidMathGame';
import { RuleSwitchGame } from '../components/brainGames/RuleSwitchGame';
import { TargetScanGame } from '../components/brainGames/TargetScanGame';
import { FocusMatchGame, TargetCountGame } from '../components/brainGames/AttentionExtraGames';
import { CategorySortGame, DirectionRushGame } from '../components/brainGames/SpeedExtraGames';
import {
  GrowingMatrixGame,
  MissingItemGame,
  ReverseSequenceGame,
} from '../components/brainGames/MemoryExtraGames';
import { saveBrainGameResult } from '../lib/brainGameResults';
import {
  loadBrainTrainingProfile,
  type BrainFocus,
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
  const [category, setCategory] = useState<BrainFocus>('attention');
  const [result, setResult] = useState({ score: 0, xp: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    loadBrainTrainingProfile()
      .then((saved) => {
        setProfile(saved);
        setStage(saved ? 'library' : 'assessment');
      })
      .catch(() => setError(isRussian ? 'Не удалось загрузить игры.' : 'Could not load games.'));
  }, [isRussian]);

  const selectGame = (selectedId: BrainGameId, selectedCategory: BrainFocus) => {
    setGameId(selectedId);
    setCategory(selectedCategory);
    setError('');
    setStage('game');
  };

  const completeGame = async (score: number) => {
    try {
      const xp = await saveBrainGameResult(gameId, category, score);
      setResult({ score, xp });
      setStage('result');
    } catch {
      setError(isRussian ? 'Не удалось сохранить результат.' : 'Could not save your score.');
    }
  };

  const game = () => {
    const common = { isRussian, onComplete: completeGame };
    switch (gameId) {
      case 'shade': return <AttentionTrainingGame {...common} />;
      case 'scan': return <TargetScanGame {...common} />;
      case 'switch': return <RuleSwitchGame {...common} />;
      case 'reaction': return <SpeedTrainingGame {...common} roundsCount={12} />;
      case 'compare': return <QuickCompareGame {...common} />;
      case 'math': return <RapidMathGame {...common} />;
      case 'sequence': return <MemoryTrainingGame {...common} sequenceLength={(profile?.memoryNeed ?? 3) >= 4 ? 7 : 6} />;
      case 'pairs': return <PairMatchGame {...common} />;
      case 'pattern': return <PatternRecallGame {...common} />;
      case 'count': return <TargetCountGame {...common} />;
      case 'focus-match': return <FocusMatchGame {...common} />;
      case 'direction': return <DirectionRushGame {...common} />;
      case 'sort': return <CategorySortGame {...common} />;
      case 'missing': return <MissingItemGame {...common} />;
      case 'reverse': return <ReverseSequenceGame {...common} />;
      case 'growing-matrix': return <GrowingMatrixGame {...common} />;
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
              ? 'Шестнадцать многоуровневых игр развивают внимание, скорость и память.'
              : 'Sixteen multi-level games train attention, speed, and memory.'}</p>
          </div>
          <BrainGameLibrary focus={profile.primaryFocus} isRussian={isRussian} onSelect={selectGame} />
        </section>
      )}
      {stage === 'game' && (
        <>
          <button className="brain-game-back" onClick={() => setStage('library')} type="button">
            ← {isRussian ? 'Все игры' : 'All games'}
          </button>
          {game()}
        </>
      )}
      {stage === 'result' && (
        <section className="training-result">
          <span>✓</span>
          <p className="eyebrow">{isRussian ? 'Игра завершена' : 'Game complete'}</p>
          <h1>{result.score}/100</h1>
          <p>+{result.xp} XP</p>
          <button onClick={() => setStage('library')} type="button">
            {isRussian ? 'Выбрать другую игру' : 'Choose another game'}
          </button>
        </section>
      )}
      {error && <p className="coach-error">{error}</p>}
    </main>
  );
}
