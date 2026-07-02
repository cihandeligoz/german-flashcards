import { MAX_LEVEL, MIN_LEVEL, type CefrLevel, type Flashcard } from "./types";

/**
 * Selection weight for a card: lower Leitner levels get exponentially more
 * weight, so words the user didn't know appear far more often than mastered
 * ones. Level 1 -> 16, level 2 -> 8, ... level 5 -> 1.
 */
export function cardWeight(card: Flashcard): number {
  return 2 ** (MAX_LEVEL - card.level);
}

/**
 * Build an ordered study sequence over the whole deck — each card exactly once,
 * so it maps cleanly onto "Card N / total" navigation. Uses weighted-random
 * shuffling (Efraimidis–Spirakis): cards with higher weight (lower Leitner
 * level = struggling words) tend to appear earlier in the pass.
 */
export function buildStudyOrder(cards: Flashcard[]): string[] {
  return cards
    .map((c) => ({ id: c.id, key: Math.random() ** (1 / cardWeight(c)) }))
    .sort((a, b) => b.key - a.key)
    .map((x) => x.id);
}

/** Cards restricted to the given CEFR levels. Empty `levels` = no filter. */
export function filterByLevels(
  cards: Flashcard[],
  levels: CefrLevel[],
): Flashcard[] {
  return levels.length === 0
    ? cards
    : cards.filter((c) => levels.includes(c.cefr));
}

/** Apply the result of a review, returning a new card object (immutable). */
export function reviewCard(
  card: Flashcard,
  knew: boolean,
  now: number,
): Flashcard {
  return {
    ...card,
    level: knew ? Math.min(MAX_LEVEL, card.level + 1) : MIN_LEVEL,
    timesSeen: card.timesSeen + 1,
    timesKnown: card.timesKnown + (knew ? 1 : 0),
    lastReviewedAt: now,
    lastKnownAt: knew ? now : card.lastKnownAt,
  };
}
