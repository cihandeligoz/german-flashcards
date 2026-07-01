import { describe, it, expect } from "vitest";
import { computeStats } from "./stats";
import type { AppState, Flashcard } from "./types";

const NOW = new Date("2026-07-01T12:00:00").getTime();
const EARLIER_TODAY = new Date("2026-07-01T08:00:00").getTime();
const YESTERDAY = new Date("2026-06-30T20:00:00").getTime();

const card: Flashcard = {
  id: "x",
  german: "das Haus",
  english: "the house",
  examples: [],
  cefr: "A1",
  level: 1,
  timesSeen: 0,
  timesKnown: 0,
  createdAt: 0,
  lastReviewedAt: null,
  lastKnownAt: null,
};

function state(partial: Partial<AppState> = {}): AppState {
  return { cards: [], reviews: [], ...partial };
}

describe("computeStats", () => {
  it("reports a null success rate when there are no reviews", () => {
    const s = computeStats(state(), NOW);
    expect(s.successRate).toBeNull();
    expect(s.totalCards).toBe(0);
    expect(s.learnedToday).toBe(0);
    expect(s.reviewsToday).toBe(0);
  });

  it("counts total cards from the deck", () => {
    const s = computeStats(state({ cards: [card, { ...card, id: "y" }] }), NOW);
    expect(s.totalCards).toBe(2);
  });

  it("counts distinct cards learned today and reviews today", () => {
    const s = computeStats(
      state({
        reviews: [
          { cardId: "a", knew: true, at: EARLIER_TODAY },
          { cardId: "a", knew: true, at: NOW }, // same card -> still 1 distinct
          { cardId: "b", knew: false, at: EARLIER_TODAY },
          { cardId: "c", knew: true, at: YESTERDAY }, // not today
        ],
      }),
      NOW,
    );
    expect(s.reviewsToday).toBe(3);
    expect(s.learnedToday).toBe(1);
  });

  it("computes the overall success rate across all reviews", () => {
    const s = computeStats(
      state({
        reviews: [
          { cardId: "a", knew: true, at: YESTERDAY },
          { cardId: "b", knew: true, at: EARLIER_TODAY },
          { cardId: "c", knew: false, at: EARLIER_TODAY },
          { cardId: "d", knew: false, at: NOW },
        ],
      }),
      NOW,
    );
    expect(s.successRate).toBeCloseTo(0.5);
  });
});
