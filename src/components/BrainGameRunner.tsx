import { AttentionTrainingGame } from './AttentionTrainingGame';
import type { BrainGameId } from './BrainGameLibrary';
import { MemoryTrainingGame } from './MemoryTrainingGame';
import { SpeedTrainingGame } from './SpeedTrainingGame';
import { FocusMatchGame, TargetCountGame } from './brainGames/AttentionExtraGames';
import { PairMatchGame } from './brainGames/PairMatchGame';
import { PatternRecallGame } from './brainGames/PatternRecallGame';
import { QuickCompareGame } from './brainGames/QuickCompareGame';
import { RapidMathGame } from './brainGames/RapidMathGame';
import { RuleSwitchGame } from './brainGames/RuleSwitchGame';
import { TargetScanGame } from './brainGames/TargetScanGame';
import { CategorySortGame, DirectionRushGame } from './brainGames/SpeedExtraGames';
import { GrowingMatrixGame, MissingItemGame, ReverseSequenceGame } from './brainGames/MemoryExtraGames';
import { NumberPatternGame, OddRuleGame, TargetEquationGame } from './brainGames/LogicGamesA';
import { PathPlannerGame, RotationGame } from './brainGames/LogicGamesB';

type Props = {
  difficulty: number;
  gameId: BrainGameId;
  isRussian: boolean;
  memoryNeed: number;
  onComplete: (score: number) => void;
};

export function BrainGameRunner({
  difficulty,
  gameId,
  isRussian,
  memoryNeed,
  onComplete,
}: Props) {
  const common = { difficulty, isRussian, onComplete };
  switch (gameId) {
    case 'shade': return <AttentionTrainingGame {...common} />;
    case 'scan': return <TargetScanGame {...common} />;
    case 'switch': return <RuleSwitchGame {...common} />;
    case 'reaction': return <SpeedTrainingGame {...common} roundsCount={12} />;
    case 'compare': return <QuickCompareGame {...common} />;
    case 'math': return <RapidMathGame {...common} />;
    case 'sequence': return <MemoryTrainingGame {...common} sequenceLength={Math.min(9, (memoryNeed >= 4 ? 7 : 6) + Math.floor(difficulty / 5))} />;
    case 'pairs': return <PairMatchGame {...common} />;
    case 'pattern': return <PatternRecallGame {...common} />;
    case 'count': return <TargetCountGame {...common} />;
    case 'focus-match': return <FocusMatchGame {...common} />;
    case 'direction': return <DirectionRushGame {...common} />;
    case 'sort': return <CategorySortGame {...common} />;
    case 'missing': return <MissingItemGame {...common} />;
    case 'reverse': return <ReverseSequenceGame {...common} />;
    case 'growing-matrix': return <GrowingMatrixGame {...common} />;
    case 'number-pattern': return <NumberPatternGame {...common} />;
    case 'target-equation': return <TargetEquationGame {...common} />;
    case 'odd-rule': return <OddRuleGame {...common} />;
    case 'path-planner': return <PathPlannerGame {...common} />;
    case 'rotation': return <RotationGame {...common} />;
  }
}
