import { describe, it, expect } from "vitest";
import { cardWeight, buildStudyOrder, filterByLevels, reviewCard } from "./srs";
import type { Flashcard } from "./types";

function makeCard(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: "c1",
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
    ...overrides,
  };
}

describe("cardWeight", () => {
  it("gives struggling (low-level) cards exponentially more weight", () => {
    expect(cardWeight(makeCard({ level: 1 }))).toBe(16);
    expect(cardWeight(makeCard({ level: 5 }))).toBe(1);
    expect(cardWeight(makeCard({ level: 1 }))).toBeGreaterThan(
      cardWeight(makeCard({ level: 5 })),
    );
  });
});

describe("reviewCard", () => {
  it("promotes and records a hit when known (immutably)", () => {
    const original = makeCard({ level: 2, timesSeen: 3, timesKnown: 1 });
    const result = reviewCard(original, true, 1000);

    expect(result.level).toBe(3);
    expect(result.timesSeen).toBe(4);
    expect(result.timesKnown).toBe(2);
    expect(result.lastReviewedAt).toBe(1000);
    expect(result.lastKnownAt).toBe(1000);
    expect(original.level).toBe(2); // source untouched
  });

  it("resets to level 1 on a miss and preserves lastKnownAt", () => {
    const original = makeCard({
      level: 4,
      timesSeen: 5,
      timesKnown: 5,
      lastKnownAt: 500,
    });
    const result = reviewCard(original, false, 2000);

    expect(result.level).toBe(1);
    expect(result.timesSeen).toBe(6);
    expect(result.timesKnown).toBe(5);
    expect(result.lastReviewedAt).toBe(2000);
    expect(result.lastKnownAt).toBe(500);
  });

  it("caps promotion at the maximum level", () => {
    expect(reviewCard(makeCard({ level: 5 }), true, 1).level).toBe(5);
  });
});

describe("buildStudyOrder", () => {
  it("returns every card id exactly once", () => {
    const cards = [
      makeCard({ id: "a" }),
      makeCard({ id: "b" }),
      makeCard({ id: "c" }),
    ];
    const order = buildStudyOrder(cards);

    expect(order).toHaveLength(3);
    expect([...order].sort()).toEqual(["a", "b", "c"]);
  });

  it("returns an empty order for an empty deck", () => {
    expect(buildStudyOrder([])).toEqual([]);
  });
});

describe("filterByLevels", () => {
  const a1 = makeCard({ id: "a1", cefr: "A1" });
  const a2 = makeCard({ id: "a2", cefr: "A2" });
  const b1 = makeCard({ id: "b1", cefr: "B1" });
  const cards = [a1, a2, b1];

  it("returns all cards when no levels are selected", () => {
    expect(filterByLevels(cards, [])).toEqual(cards);
  });

  it("keeps only cards at a single selected level", () => {
    expect(filterByLevels(cards, ["A2"])).toEqual([a2]);
  });

  it("returns the union across multiple selected levels", () => {
    expect(filterByLevels(cards, ["A1", "B1"])).toEqual([a1, b1]);
  });

  it("returns no cards when the selected level has none", () => {
    expect(filterByLevels(cards, ["C1"])).toEqual([]);
  });
});
