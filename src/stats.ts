import type { AppState, ReviewEvent } from "./types";

export interface Stats {
  totalCards: number;
  learnedToday: number;
  successRate: number | null; // null when there are no reviews yet
  reviewsToday: number;
}

function startOfToday(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function isToday(ts: number, now: number): boolean {
  return ts >= startOfToday(now);
}

export function computeStats(state: AppState, now: number): Stats {
  const { cards, reviews } = state;

  const reviewsToday = reviews.filter((r) => isToday(r.at, now));

  // "Learned today": distinct cards that were answered correctly today.
  const learnedIds = new Set<string>();
  for (const r of reviewsToday) {
    if (r.knew) learnedIds.add(r.cardId);
  }

  const knownCount = reviews.filter((r: ReviewEvent) => r.knew).length;
  const successRate =
    reviews.length > 0 ? knownCount / reviews.length : null;

  return {
    totalCards: cards.length,
    learnedToday: learnedIds.size,
    successRate,
    reviewsToday: reviewsToday.length,
  };
}
