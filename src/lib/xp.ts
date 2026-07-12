export const RANKS = [
  { name: "Script Kiddie", min: 0 },
  { name: "Code Runner", min: 250 },
  { name: "White Hat", min: 750 },
  { name: "Bounty Hunter", min: 1800 },
  { name: "Elite Hacker", min: 3500 },
] as const;

export function rankForXp(xp: number) {
  let current: (typeof RANKS)[number] = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.min) current = r;
  }
  return current;
}

export function nextRank(xp: number) {
  const idx = RANKS.findIndex((r) => r.name === rankForXp(xp).name);
  return RANKS[idx + 1] ?? null;
}

export function progressToNextRank(xp: number) {
  const current = rankForXp(xp);
  const next = nextRank(xp);
  if (!next) return 1;
  return (xp - current.min) / (next.min - current.min);
}
