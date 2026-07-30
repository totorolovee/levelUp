function clampScore(score: number, minimum: number) {
  return Math.max(minimum, Math.min(100, Math.round(score)));
}

export function calculateSpeedGameScore(
  correct: number,
  rounds: number,
  totalResponseMs: number,
  fastResponseMs: number,
  slowResponseMs: number,
) {
  if (rounds <= 0) return 10;
  const accuracyPoints = (correct / rounds) * 80;
  const averageResponse = totalResponseMs / rounds;
  const speedRatio = Math.max(
    0,
    Math.min(1, (slowResponseMs - averageResponse) / (slowResponseMs - fastResponseMs)),
  );
  return clampScore(accuracyPoints + speedRatio * 20, 10);
}

export function calculateReactionScore(averageResponseMs: number, falseStarts: number) {
  const responsePenalty = Math.max(0, averageResponseMs - 220) / 7;
  return clampScore(100 - responsePenalty - falseStarts * 4, 20);
}
