import { describe, it, expect } from "vitest";
import { rankForXp, nextRank, progressToNextRank, RANKS } from "./xp";

describe("rankForXp", () => {
  it("returns Script Kiddie at 0 xp", () => {
    expect(rankForXp(0).name).toBe("Script Kiddie");
  });

  it("returns the highest rank whose min xp is met", () => {
    expect(rankForXp(249).name).toBe("Script Kiddie");
    expect(rankForXp(250).name).toBe("Code Runner");
    expect(rankForXp(3500).name).toBe("Elite Hacker");
    expect(rankForXp(999999).name).toBe("Elite Hacker");
  });
});

describe("nextRank", () => {
  it("returns the next rank in sequence", () => {
    expect(nextRank(0)?.name).toBe("Code Runner");
    expect(nextRank(300)?.name).toBe("White Hat");
  });

  it("returns null at the max rank", () => {
    expect(nextRank(RANKS[RANKS.length - 1].min)).toBeNull();
  });
});

describe("progressToNextRank", () => {
  it("returns 0 right at the start of a rank", () => {
    expect(progressToNextRank(250)).toBe(0);
  });

  it("returns 1 at the max rank", () => {
    expect(progressToNextRank(RANKS[RANKS.length - 1].min)).toBe(1);
  });

  it("returns a fraction between ranks", () => {
    const midway = 250 + (750 - 250) / 2;
    expect(progressToNextRank(midway)).toBeCloseTo(0.5);
  });
});
