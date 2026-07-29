export type BrainGameProps = {
  difficulty: number;
  isRussian: boolean;
  onComplete: (score: number) => void;
};
