import type { AppState } from "./types";
import { seedCards } from "./seed";

const STORAGE_KEY = "deutsch-flashcards-v2";

// Bump whenever the seed vocabulary changes. A stored deck from an older seed
// generation is refreshed on load — but only when the user hasn't added their
// own cards or built up any study history, so real progress is never lost.
const SEED_VERSION = 2;

/** First-run state: seeded with the current A1 vocabulary. */
function initialState(): AppState {
  return { cards: seedCards(), reviews: [], seedVersion: SEED_VERSION };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // No stored data yet (first visit) — start with the seed deck.
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const cards = Array.isArray(parsed.cards) ? parsed.cards : [];
    const reviews = Array.isArray(parsed.reviews) ? parsed.reviews : [];
    const seedVersion =
      typeof parsed.seedVersion === "number" ? parsed.seedVersion : 0;

    // Nothing to lose — seed it.
    if (cards.length === 0 && reviews.length === 0) return initialState();

    // Deck came from an older seed and the user hasn't personalized it (no
    // custom cards, no reviews) — refresh to the current vocabulary.
    const hasUserCards = cards.some((c) => !c.id.startsWith("seed-"));
    if (seedVersion < SEED_VERSION && reviews.length === 0 && !hasUserCards) {
      return initialState();
    }

    return { cards, reviews, seedVersion };
  } catch {
    // Corrupt or unavailable storage — start fresh rather than crashing.
    return initialState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / private-mode write failures.
  }
}
