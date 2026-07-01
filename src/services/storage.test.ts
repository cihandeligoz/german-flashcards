import { describe, it, expect, beforeEach } from "vitest";
import { loadState, saveState } from "./storage";
import type { AppState, Flashcard } from "@/domain";

const KEY = "deutsch-flashcards-v2";

function userCard(): Flashcard {
  return {
    id: "user-1",
    german: "eigenes Wort",
    english: "own word",
    examples: [],
    cefr: "A2",
    level: 3,
    timesSeen: 2,
    timesKnown: 1,
    createdAt: 1,
    lastReviewedAt: 1,
    lastKnownAt: 1,
  };
}

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("seeds the full deck on first run", () => {
    const state = loadState();
    expect(state.cards.length).toBeGreaterThan(100);
    expect(state.seedVersion).toBe(3);
    // Seed ids are namespaced so they never collide with user cards.
    expect(state.cards.every((c) => c.id.startsWith("seed-"))).toBe(true);
  });

  it("refreshes a stale, untouched seed deck to the current version", () => {
    // Simulate an old deck: a couple of seed cards, no version, no reviews.
    const stale: AppState = {
      cards: [
        { ...userCard(), id: "seed-0" },
        { ...userCard(), id: "seed-1" },
      ],
      reviews: [],
    };
    localStorage.setItem(KEY, JSON.stringify(stale));

    const state = loadState();
    expect(state.seedVersion).toBe(3);
    expect(state.cards.length).toBeGreaterThan(100); // reseeded
  });

  it("preserves a deck once the user has personalized it", () => {
    const personalized: AppState = {
      cards: [userCard()],
      reviews: [{ cardId: "user-1", knew: true, at: 10 }],
      seedVersion: 1,
    };
    localStorage.setItem(KEY, JSON.stringify(personalized));

    const state = loadState();
    expect(state.cards).toHaveLength(1);
    expect(state.cards[0]!.id).toBe("user-1");
    expect(state.reviews).toHaveLength(1);
  });

  it("round-trips state through save and load", () => {
    const original = loadState();
    saveState(original);
    const reloaded = loadState();
    expect(reloaded.cards.length).toBe(original.cards.length);
  });

  it("falls back to a seeded deck on corrupt storage", () => {
    localStorage.setItem(KEY, "{not valid json");
    const state = loadState();
    expect(state.cards.length).toBeGreaterThan(100);
    expect(state.seedVersion).toBe(3);
  });
});
