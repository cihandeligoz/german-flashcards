---
date: 2026-07-02T08:54:47+00:00
git_commit: 999b670b5537ae50f0f761356c5d8ecffaf891a5
branch: main
topic: "How the spaced repetition system works (and where CEFR levels live), ahead of extending to A2/B1/B2/C1"
tags: [research, codebase, srs, leitner, cefr, seed, study-order]
status: complete
---

# Research: Spaced Repetition System & CEFR Level Model

## Research Question

> How does the spaced repetition system work in this app? I want to understand the current implementation so we can extend it with multiple vocabulary levels (A2, B1, B2, C1).

_This document describes the system as it exists today. It does not propose the A2–C1 extension design; it maps every place the current SRS and the CEFR field touch the code so that a future plan has an accurate starting map._

## Summary

The app uses a **Leitner-box spaced repetition system**, entirely contained in the pure `src/domain/` layer and driven through a pure reducer. There are **two independent "level" concepts that are easy to conflate**:

1. **Leitner `level`** (`Flashcard.level`, integer `1..5`) — the SRS box that governs _how often a card is shown_. This is the spaced-repetition mechanism.
2. **CEFR `cefr`** (`Flashcard.cefr`, string union `"A1" | "A2"`) — a _proficiency badge_ describing the vocabulary difficulty of the word. It is **display metadata only**: today it does **not** influence selection, ordering, scheduling, or filtering anywhere.

The SRS itself is tiny and lives in three pure functions in `src/domain/srs.ts` (`cardWeight`, `buildStudyOrder`, `reviewCard`). State transitions flow through `flashcardsReducer` (`src/state/reducer.ts`); the React layer (`useFlashcards`, `useStudySession`) only injects non-deterministic values (ids, timestamps, `Math.random`) and holds a study cursor. The seed deck (`src/domain/seed.ts`) ships 471 cards — 318 tagged `A1`, 153 tagged `A2` — where the CEFR tag is assigned purely by **which array an entry lives in**, not stored per-entry or computed.

### Key files

```
src/
├── domain/                     ← pure, framework-free (the SRS lives here)
│   ├── types.ts                CefrLevel union, Flashcard/AppState/NewCardInput, MIN_LEVEL/MAX_LEVEL
│   ├── srs.ts                  cardWeight · buildStudyOrder · reviewCard   ← the entire SRS
│   ├── seed.ts                 A1_SEED (318) + A2_SEED (153) → seedCards(); toCard() assigns cefr
│   └── stats.ts                aggregate stats (no per-level breakdown)
├── state/
│   └── reducer.ts              ADD_CARD / DELETE_CARD / ANSWER_CARD (pure)
├── hooks/
│   ├── useFlashcards.ts        single store; injects makeId()/Date.now()
│   └── useStudySession.ts      study cursor; rebuilds order on membership change
├── services/
│   └── storage.ts              localStorage load/save + seed migration (SEED_VERSION)
└── components/
    ├── StudyMode.tsx           renders cefr badge; delegates ordering to useStudySession
    ├── AddCard.tsx             cefr <select> hardcodes "A1"/"A2"; shows Leitner level pill
    └── Stats.tsx               aggregate stats only — no cefr/level references
```

### The two "levels" at a glance

```
                Flashcard
        ┌───────────────────────────┐
        │ cefr:  "A1" | "A2"        │  ← proficiency BADGE (display only today)
        │ level: 1..5               │  ← Leitner BOX  (drives SRS scheduling)
        └───────────────────────────┘
                     │
   cefr ─────────────┘ (used only for the badge chip in StudyMode & AddCard)
   level ───► cardWeight() = 2^(MAX_LEVEL - level) ───► buildStudyOrder() weighted shuffle
```

## Detailed Findings

### 1. The Leitner model (the actual SRS) — `src/domain/srs.ts`

Three pure functions make up the entire spaced-repetition engine:

- **`cardWeight(card)`** (`srs.ts:8-10`) — `2 ** (MAX_LEVEL - card.level)`. With `MAX_LEVEL = 5`, level 1 → weight 16, level 2 → 8, … level 5 → 1. Lower-box (struggling) cards get exponentially more weight.
- **`buildStudyOrder(cards)`** (`srs.ts:18-23`) — lays the **whole deck** into a single stable sequence, each card exactly once, using Efraimidis–Spirakis weighted-random shuffling: `key = Math.random() ** (1 / cardWeight(c))`, sorted descending by key. Higher-weight (lower-level) cards tend to sort earlier. This is what backs "Card N / total" and Previous/Skip.
- **`reviewCard(card, knew, now)`** (`srs.ts:26-39`) — pure, immutable transition applied on an answer:
  - `knew === true` → `level = min(MAX_LEVEL, level + 1)`; increments `timesKnown`; sets `lastKnownAt = now`.
  - `knew === false` → `level = MIN_LEVEL` (**hard reset to box 1**); `lastKnownAt` unchanged.
  - Always: `timesSeen += 1`, `lastReviewedAt = now`.

There is **no time-based scheduling** (no "due date", no interval/ease factor à la SM-2). "Spacing" is achieved purely by weighting the intra-pass shuffle by Leitner box. `cefr` is **not read** by any of these functions.

### 2. Data model — `src/domain/types.ts`

- `CefrLevel = "A1" | "A2"` (`types.ts:2`) — the closed union that everything else keys off. Extending proficiency levels starts here.
- `Flashcard` (`types.ts:4-24`) carries **both** `cefr: CefrLevel` (`:9`, commented "distinct from the Leitner `level` box below") and `level: number` (`:16`, the Leitner box), plus `timesSeen`, `timesKnown`, `createdAt`, `lastReviewedAt`, `lastKnownAt`.
- `NewCardInput` (`types.ts:41-46`) — user-entered fields for a new card, including `cefr: CefrLevel`.
- `MIN_LEVEL = 1`, `MAX_LEVEL = 5` (`types.ts:48-49`) — **Leitner** bounds (not CEFR). Referenced by `srs.ts` for weighting and clamping.

### 3. State transitions — `src/state/reducer.ts`

`flashcardsReducer` (`reducer.ts:17-54`) handles three actions; non-deterministic inputs (`id`, `now`) arrive **in the action** to keep it pure/testable:

- **`ADD_CARD`** (`:22-37`) — builds a `Flashcard` from `NewCardInput`, copying `cefr` straight through (`:28`), and defaulting `level: 1`, counters `0`, timestamps `null`.
- **`DELETE_CARD`** (`:38-39`) — filters by id.
- **`ANSWER_CARD`** (`:40-50`) — maps the target card through `reviewCard(...)` and appends a `ReviewEvent { cardId, knew, at }` to `reviews`.

The reducer never inspects `cefr` beyond passing it through on add.

### 4. React store & study cursor — `src/hooks/`

- **`useFlashcards`** (`useFlashcards.ts:24-47`) — the single source of truth: `useReducer(flashcardsReducer, undefined, loadState)`, a `useEffect` that `saveState`s the whole `AppState` on every change (`:28-30`), and callbacks that inject `makeId()` / `Date.now()` at dispatch (`:32-42`). `stats` is memoized from `computeStats` (`:44`).
- **`useStudySession`** (`useStudySession.ts:26-78`) — owns the study flow over the **whole `cards` array**:
  - Holds `order` (from `buildStudyOrder`), a `pos` cursor, and `revealed`.
  - Rebuilds the order **only when deck membership changes**, tracked by `signatureOf(cards)` = the ids joined by `|` (`:4-7`, `:35-43`). Adding/removing a card resets the pass; answering does not.
  - Exposes `position`/`total`, `reveal`/`prev`/`next`/`answer`. `answer(knew)` calls `onAnswer(card.id, knew)` then advances (`:61-65`).
  - **Consumes the entire deck** — it does not receive or apply any `cefr` filter.

### 5. Persistence & seed migration — `src/services/storage.ts`

- `STORAGE_KEY = "deutsch-flashcards-v2"` (`:3`); `SEED_VERSION = 3` (`:9`, comment: "v3 added the A2 vocabulary set and the `cefr` badge field").
- `loadState()` (`:16-64`) handles first-run seeding and migrations:
  - No stored data, or empty deck+no reviews → `initialState()` (fresh seed) (`:20`, `:28`).
  - **CEFR back-fill** (`:32`): every stored card is normalized with `cefr: c.cefr ?? "A1"`, so pre-v3 decks default to `A1`.
  - Up-to-date (`seedVersion >= SEED_VERSION`) → returned as-is (`:35-36`).
  - Stale but untouched (no user cards, no reviews) → re-seed (`:40-41`).
  - Stale with progress + existing seed cards → **top up by id**: append any `seedCards()` whose id isn't already present (`:47-56`) — this is how the A2 set reached existing users without wiping history. Matching is purely by `seed-<n>` id.
- `saveState()` (`:66-72`) — writes the whole `AppState` JSON; swallows quota/private-mode errors.

**Relevance to adding levels:** any change to `seed.ts` content requires bumping `SEED_VERSION` (per CLAUDE.md and the comment at `storage.ts:5-9`), and the top-up path (`:47-56`) keys entirely on `seed-<n>` id continuity.

### 6. Seed deck & CEFR tagging — `src/domain/seed.ts`

- Raw content lives in two `SeedEntry[]` arrays holding only `{ german, english, examples }`:
  - `A1_SEED` (`seed.ts:15-1717`) — **318 entries**, grouped by topic via comment banners (greetings, numbers, family, food, verbs, adjectives, …).
  - `A2_SEED` (`seed.ts:1724-2611`) — **153 entries** (feelings, health, work & education, travel, media, opinions, …).
- **`toCard(entry, cefr, index)`** (`seed.ts:2614-2628`) — turns a raw entry into a full `Flashcard`: `id: \`seed-${index}\``, copies content, sets `cefr`from the **argument**, and defaults`level: 1`, counters `0`, `createdAt: 0`, timestamps `null`.
- **`seedCards()`** (`seed.ts:2635-2639`) — concatenates `A1_SEED.map(... "A1", i)` then `A2_SEED.map(... "A2", A1_SEED.length + i)`. So CEFR is assigned by **array membership**, and ids are one continuous sequence: A1 = `seed-0..seed-317`, A2 = `seed-318..seed-470` (total **471** cards).

The CEFR tag is neither stored per-entry nor derived from word content — it is entirely a function of which array the word sits in and which literal (`"A1"`/`"A2"`) `seedCards()` passes for that array.

### 7. UI touchpoints for `cefr` and `level` — `src/components/`

- **`StudyMode.tsx`** — delegates all ordering to `useStudySession(cards, onAnswer)` (`:11-21`); renders the CEFR badge chip `cefr-chip--${card.cefr}` with `{card.cefr}` text (`:41-42`); `answer(false)`/`answer(true)` drive the Leitner response (`:66`, `:69`); `prev`/`next`/`canPrev` navigate (`:82`, `:85`). No hardcoded CEFR strings, no direct `level` use.
- **`AddCard.tsx`** — imports `CefrLevel` (`:2`); form state `useState<CefrLevel>("A1")` (`:15`), reset to `"A1"` after submit (`:60`); the CEFR `<select>` **hardcodes the two options** `<option value="A1">`/`<option value="A2">` (`:94-95`) and casts `e.target.value as CefrLevel` (`:92`); includes `cefr` in the `onAdd` payload (`:51`). In the card list it shows a CEFR badge (`:141-142`) and a Leitner-level pill `pill--lvl${c.level}` / `lvl {c.level}` (`:146-147`). The list renders in raw array order — no grouping/filtering by `cefr` or `level`.
- **`Stats.tsx`** — no `cefr` or `level` references; only aggregate fields (`successRate`, `totalCards`, `learnedToday`, `reviewsToday`). No per-level breakdown exists.
- **`App.tsx`** — passes the **full unfiltered `state.cards`** into both `StudyMode` (`:42`) and `AddCard` (`:48`), and threads `answerCard` as `onAnswer` (`:43`). No CEFR filtering happens at the top level.

### 8. Stats — `src/domain/stats.ts`

`computeStats(state, now)` (`stats.ts:20-40`) returns `{ totalCards, learnedToday, successRate, reviewsToday }`. "Learned today" = distinct card ids answered correctly since local midnight (`:24-29`); `successRate` = known/total over all reviews (`:31-32`). **No dimension of stats is broken down by `cefr` or Leitner `level`.**

## Code References

- `src/domain/srs.ts:8-10` — `cardWeight`: `2 ** (MAX_LEVEL - level)`.
- `src/domain/srs.ts:18-23` — `buildStudyOrder`: weighted-random full-deck shuffle.
- `src/domain/srs.ts:26-39` — `reviewCard`: promote on knew, reset to `MIN_LEVEL` on miss.
- `src/domain/types.ts:2` — `CefrLevel = "A1" | "A2"` (the union to extend).
- `src/domain/types.ts:4-24` — `Flashcard` (both `cefr` and Leitner `level`).
- `src/domain/types.ts:48-49` — `MIN_LEVEL`/`MAX_LEVEL` (Leitner bounds).
- `src/state/reducer.ts:22-50` — `ADD_CARD`/`DELETE_CARD`/`ANSWER_CARD`.
- `src/hooks/useStudySession.ts:26-78` — study cursor; membership-signature rebuild.
- `src/hooks/useFlashcards.ts:24-47` — single store + persistence + id/time injection.
- `src/services/storage.ts:9` — `SEED_VERSION = 3` (bump on seed change).
- `src/services/storage.ts:32` — CEFR back-fill default `"A1"`.
- `src/services/storage.ts:47-56` — id-keyed seed top-up (how A2 reached existing users).
- `src/domain/seed.ts:2614-2628` — `toCard` (assigns `cefr`, id, defaults).
- `src/domain/seed.ts:2635-2639` — `seedCards` (A1 then A2; continuous ids).
- `src/components/AddCard.tsx:94-95` — hardcoded `A1`/`A2` `<select>` options.
- `src/components/StudyMode.tsx:41-42` — CEFR badge chip.

## Architecture Documentation

- **Purity boundary.** All SRS logic and the CEFR model live in framework-free `src/domain/` and the pure `src/state/reducer.ts`; React never contains business logic. Non-deterministic values (`makeId`, `Date.now`, `Math.random`) are injected at the edges (`useFlashcards`, `buildStudyOrder`).
- **Two orthogonal "levels."** Leitner `level` drives scheduling; CEFR `cefr` is a badge. They share the word "level" but are unrelated in code. Nothing today couples them.
- **Whole-deck study model.** `buildStudyOrder` and `useStudySession` operate over the entire `cards` array; there is no concept of a "current level filter" or a per-level deck. Study, add, and stats all see the full deck.
- **Closed CEFR union, tagged by array membership.** `CefrLevel` is a two-member string union; seed cards get their tag from which array (`A1_SEED`/`A2_SEED`) they occupy, and the `AddCard` dropdown enumerates the same two literals by hand.
- **Seed migration is id-driven.** New vocabulary reaches existing users only via the `seed-<n>` id top-up path, gated on `SEED_VERSION`.

## Open Questions

_(Areas a follow-up — e.g. an `/rpi-plan` for the A2–C1 extension — would need to resolve. Listed as observations, not recommendations.)_

- `CefrLevel` (`types.ts:2`) is a closed 2-member union; the `AddCard` dropdown (`:94-95`) hardcodes the same two literals — both are the enumerations that currently bound "which levels exist."
- No CEFR-based **filtering/grouping/selection** exists anywhere (study, stats, or lists), so there is no current notion of "study only B1" to extend from — it would be net-new surface area.
- The CSS chip classes are per-level (`cefr-chip--${cefr}`); which concrete classes/styles exist for values beyond `A1`/`A2` was not examined in this pass (styles live outside the `.ts`/`.tsx` files surveyed).
- Seed ids are a single continuous sequence across levels (`seed-0..seed-470`); how additional level arrays would slot into that id sequence without disturbing the existing top-up migration is an open design point.
