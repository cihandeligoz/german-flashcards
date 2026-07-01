export interface Flashcard {
  id: string;
  german: string;
  english: string;
  examples: string[];
  /**
   * Leitner-style box level (1 = struggling, 5 = mastered). Lower levels are
   * shown more often. A wrong answer drops the card to level 1; a correct one
   * promotes it by one level (capped at MAX_LEVEL).
   */
  level: number;
  timesSeen: number;
  timesKnown: number;
  createdAt: number;
  /** Timestamp of the last review, used for "learned today" stats. */
  lastReviewedAt: number | null;
  /** Timestamp of the most recent "Knew it" answer. */
  lastKnownAt: number | null;
}

/** A single review event, kept for computing daily statistics. */
export interface ReviewEvent {
  cardId: string;
  knew: boolean;
  at: number;
}

export interface AppState {
  cards: Flashcard[];
  reviews: ReviewEvent[];
  /** Which seed generation populated the deck; drives seed refresh on upgrade. */
  seedVersion?: number;
}

/** The user-provided fields for a new card, before defaults/ids are applied. */
export interface NewCardInput {
  german: string;
  english: string;
  examples: string[];
}

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 5;
