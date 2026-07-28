const ieltsTargets: Record<string, number> = {
  stanford: 7,
  mit: 7,
  harvard: 7,
  berkeley: 6.5,
  princeton: 7,
  yale: 7,
  caltech: 7,
  oxford: 7.5,
  cambridge: 7.5,
  imperial: 6.5,
  'st-andrews': 6.5,
  edinburgh: 6.5,
  lse: 7,
  kings: 6.5,
  manchester: 6,
  nus: 6.5,
  'ntu-singapore': 6,
  tsinghua: 6.5,
  tokyo: 6.5,
  'seoul-national': 6.5,
  hku: 6.5,
  hkust: 6.5,
  kaist: 6.5,
  melbourne: 6.5,
  sydney: 6.5,
  anu: 6.5,
  unsw: 6.5,
};

export function getIeltsTarget(universityId: string): number {
  return ieltsTargets[universityId] ?? 7;
}

export function getIeltsReadiness(score: number, target: number): number {
  if (!Number.isFinite(score)) return 0;
  if (score >= target + 0.5) return 100;
  if (score >= target) return 90;
  if (score >= target - 0.5) return 80;
  if (score >= target - 1) return 70;
  return Math.max(0, Math.round((score / Math.max(target - 1, 1)) * 70));
}
