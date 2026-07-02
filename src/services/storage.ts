import {
  CEFR_LEVELS,
  seedCards,
  type AppState,
  type CefrLevel,
} from "@/domain";

const STORAGE_KEY = "deutsch-flashcards-v2";

// Bump whenever the seed vocabulary changes. A stored deck from an older seed
// generation is refreshed on load — but only when the user hasn't added their
// own cards or built up any study history, so real progress is never lost.
// v3 added the A2 vocabulary set and the `cefr` badge field.
const SEED_VERSION = 3;

/**
 * Keep only valid, de-duplicated CEFR levels from persisted input; anything
 * unrecognized (or a non-array) collapses to `[]`, i.e. "all levels".
 */
function normalizeLevels(v: unknown): CefrLevel[] {
  if (!Array.isArray(v)) return [];
  return CEFR_LEVELS.filter((l) => v.includes(l));
}

/** First-run state: seeded with the current A1 vocabulary; no level filter. */
function initialState(): AppState {
  return {
    cards: seedCards(),
    reviews: [],
    seedVersion: SEED_VERSION,
    studyLevels: [],
  };
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
    const studyLevels = normalizeLevels(parsed.studyLevels);

    // Nothing to lose — seed it.
    if (cards.length === 0 && reviews.length === 0) return initialState();

    // Ensure every card carries a `cefr` badge — decks stored before v3 predate
    // the field, so default them to A1.
    const normalized = cards.map((c) => ({ ...c, cefr: c.cefr ?? "A1" }));

    // Deck is up to date — return as-is.
    if (seedVersion >= SEED_VERSION)
      return { cards: normalized, reviews, seedVersion, studyLevels };

    // Deck came from an older seed. If it's untouched (no custom cards, no
    // study history) just refresh to the current vocabulary.
    const hasUserCards = cards.some((c) => !c.id.startsWith("seed-"));
    if (reviews.length === 0 && !hasUserCards) return initialState();

    // Otherwise the user has progress: keep their cards but top up any seed
    // cards added since (e.g. the A2 set) so new vocabulary reaches everyone
    // without discarding history. Matching is by id, so existing progress and
    // custom cards are untouched.
    const hasSeedCards = cards.some((c) => c.id.startsWith("seed-"));
    if (hasSeedCards) {
      const haveIds = new Set(normalized.map((c) => c.id));
      const additions = seedCards().filter((c) => !haveIds.has(c.id));
      return {
        cards: [...normalized, ...additions],
        reviews,
        seedVersion: SEED_VERSION,
        studyLevels,
      };
    }

    // Purely user-built deck — don't inject seed cards; just record the version.
    return {
      cards: normalized,
      reviews,
      seedVersion: SEED_VERSION,
      studyLevels,
    };
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
