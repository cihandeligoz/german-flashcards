---
date: 2026-07-02T09:09:08+00:00
git_commit: 999b670b5537ae50f0f761356c5d8ecffaf891a5
branch: main
topic: "Multiple vocabulary levels (A2/B1/B2/C1) with a study-by-level filter"
tags: [plan, cefr, srs, study-mode, storage, types]
status: implemented
---

# PLAN: Multiple vocabulary levels with a study-by-level filter

Extend the app's CEFR proficiency model from the current two levels (`A1`, `A2`)
to the full ladder (`A1`, `A2`, `B1`, `B2`, `C1`) and add a **study-by-level
filter** so learners can narrow the study deck to the level(s) they choose. The
selection is multi-select (with an `All` default) and persists across reloads.

No seed vocabulary is authored for the new levels: `B1`/`B2`/`C1` become valid,
selectable levels that users populate with their own cards. A1/A2 seed content
and all existing study progress are untouched.

Based on research: `docs/agents/research/2026-07-02-spaced-repetition-system.md`.

## Acceptance Criteria

- `CefrLevel` supports `A1 | A2 | B1 | B2 | C1`; all five render as distinct
  colored chips in Study mode and the Add-card list.
- The Add-card form offers all five levels, driven from a single source of truth
  (no hardcoded `<option>` list).
- Study mode shows a multi-select level selector (`All` + five level chips). The
  study deck and the "Card N / total" count reflect the **union** of selected
  levels.
- `All` is the default; deselecting every level reverts to `All`.
- The selection persists across reloads.
- Selecting level(s) with no cards shows a clear "no cards at the selected
  level(s)" message, distinct from the truly-empty-deck message; the selector
  stays visible so the user can change the selection.
- A1/A2 seed cards and existing study history are untouched; no seed vocabulary
  is added and `SEED_VERSION` is **not** bumped.

## Technical Key Decisions and Tradeoffs

1. **Level filter is the feature; union extension + chips + dropdown are supporting work.**
   - Why: the user-chosen scope is the filter; levels must be valid and visible
     before filtering is meaningful.
   - Impact: touches `types.ts`, `styles.css`, `AddCard.tsx`, plus new Study UI.

2. **Multi-select, `All` represented as an empty selection array.**
   - Why: robust, future-proof representation — no need to enumerate every level
     to mean "all", and adding a level later needs no migration of the "all" state.
   - Impact: filter is `levels.length === 0 ? cards : cards.filter(c => levels.includes(c.cefr))`.

3. **Persist the selection in `AppState.studyLevels` via a `SET_STUDY_LEVELS` reducer action.**
   - Why: matches the app's single-store, "everything persists to one key" pattern
     (`useFlashcards` saves the whole `AppState`).
   - Impact: `studyLevels` must be threaded through **every** `loadState` return
     path (each rebuilds an `AppState` literal) and validated/normalized on load.
     **No `SEED_VERSION` bump** — this is a schema/pref addition, not a seed change,
     and must not trigger re-seeding.

4. **`CEFR_LEVELS` ordered constant in `types.ts` as the single source of truth.**
   - Why: one canonical, ordered list feeds the selector chip order, the AddCard
     dropdown, and load-time validation of persisted levels.
   - Impact: removes the hardcoded `A1`/`A2` `<option>`s (research open question)
     and the ad-hoc enumeration that currently only lives implicitly.

5. **Filtering applies to Study only; Add list and Stats stay full-deck.**
   - Why: matches the chosen scope (study filter only).
   - Impact: reuses the existing membership-signature rebuild in
     `useStudySession` — changing the filter changes the id signature, which
     restarts the pass and re-derives "Card N / total" correctly, no new logic.

## Current State

Two unrelated "level" concepts live on `Flashcard`:

```
                 Flashcard
     ┌──────────────────────────────────┐
     │ cefr:  "A1" | "A2"               │ ← proficiency BADGE (display only)
     │ level: 1..5  (Leitner box)       │ ← drives SRS scheduling
     └──────────────────────────────────┘

  cefr  → only used to render a colored chip (StudyMode + AddCard list)
  level → cardWeight() → buildStudyOrder() weighted shuffle
```

Every place `cefr` is touched today:

```
types.ts:2        CefrLevel = "A1" | "A2"           ← the closed union
seed.ts:2635      seedCards(): A1_SEED(318)+A2_SEED(153) → seed-0..seed-470
                  cefr assigned by ARRAY MEMBERSHIP
reducer.ts:28     ADD_CARD copies input.cefr straight through
AddCard.tsx:94-95 <select> HARDCODES <option>A1</option><option>A2</option>
StudyMode.tsx:41  <span class="cefr-chip--{cefr}">{cefr}</span>
styles.css:145-152 .cefr-chip--A1 / .cefr-chip--A2  (only two colors)
storage.ts:9      SEED_VERSION=3; :32 back-fills missing cefr → "A1"
                  :35-59 loadState rebuilds AppState literals per branch
```

There is **no filtering/selection by `cefr` anywhere** — `App.tsx:42` passes the
full `state.cards` into `StudyMode`, which delegates ordering to
`useStudySession` over the whole deck.

## Desired End State

```
App
 ├─ useFlashcards()  → { state: { cards, reviews, seedVersion, studyLevels }, setStudyLevels, ... }
 └─ StudyMode(cards=state.cards, selectedLevels=state.studyLevels, onLevelsChange=setStudyLevels)
       ├─ <LevelFilter selected={selectedLevels} onChange={onLevelsChange} />   ← always visible
       ├─ const shown = filterByLevels(cards, selectedLevels)                    ← pure, srs.ts
       └─ useStudySession(shown, onAnswer)   ← membership change restarts pass

Persistence: state.studyLevels ([] = All) saved with the whole AppState under the
existing storage key; validated/normalized on load.
```

Study-mode mockup (current → proposed):

```
CURRENT                              PROPOSED
┌───────────────────────────┐       ┌───────────────────────────────┐
│ Card 3 / 471              │       │ Level: [✓All][A1][A2][B1][B2][C1] │
│ ┌───────────────────┐     │       │ Card 1 / 318                   │
│ │              [A1]  │     │       │ ┌───────────────────┐         │
│ │ German            │     │       │ │              [A1]  │         │
│ │ das Haus          │     │       │ │ German            │         │
│ └───────────────────┘     │       │ │ das Haus          │         │
└───────────────────────────┘       │ └───────────────────┘         │
                                     └───────────────────────────────┘

Filter yields no cards (e.g. only B2 selected, no B2 cards):
┌───────────────────────────────┐
│ Level: [ All][A1][A2][B1][✓B2][C1] │
│ No cards at the selected level(s). │
│ Add some in the Add tab, or pick   │
│ another level above.               │
└───────────────────────────────┘
```

## Abstractions and Code Reuse

- Reuse `useStudySession`'s membership-signature rebuild — no changes needed
  there; passing a filtered array is enough to restart the pass.
- Reuse the existing `.cefr-chip` base style and per-level modifier convention;
  add three new color modifiers.
- New pure helper `filterByLevels` colocated with the other selection logic in
  `srs.ts`.
- New presentational `LevelFilter` component following the props-in pattern used
  by the other components.

File tree of changes:

- `src/domain`
  - `types.ts` — widen `CefrLevel`; add ordered `CEFR_LEVELS`; add optional
    `studyLevels` to `AppState`.
  - `srs.ts` — add `filterByLevels(cards, levels)`.
- `src/state`
  - `reducer.ts` — add `SET_STUDY_LEVELS` action.
- `src/services`
  - `storage.ts` — normalize/validate `studyLevels`; thread through all
    `loadState` return paths and `initialState()`.
- `src/hooks`
  - `useFlashcards.ts` — expose `setStudyLevels`; include `studyLevels` in state.
- `src/components`
  - `LevelFilter.tsx` (new) — `All` + five level chips, multi-select.
  - `StudyMode.tsx` — render `LevelFilter` always; filter cards; distinct empty
    messages.
  - `AddCard.tsx` — render `<option>`s from `CEFR_LEVELS`.
  - `index.ts` — export `LevelFilter`.
- `src/styles.css` — `.cefr-chip--B1/B2/C1`; level-filter chip styles.
- `CLAUDE.md` — document the study-by-level filter and `CEFR_LEVELS` source of truth.

## Logging & Observability

No logging changes — the app has no logging layer and this is client-only UI state.

## Implementation

### Phase 1: Extend the CEFR level model

Dependencies: None

Widen the proficiency union to all five levels and make every enumeration of
levels derive from one constant, so users can immediately tag and see A1–C1 cards.

**Tasks**:

- [x] In `src/domain/types.ts`, widen the union and add an ordered constant:
  ```ts
  export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";
  /** All CEFR levels in display order — the single source of truth for
   *  selectors, dropdowns, and load-time validation. */
  export const CEFR_LEVELS: readonly CefrLevel[] = [
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
  ];
  ```
- [x] In `src/components/AddCard.tsx`, import `CEFR_LEVELS` and replace the two
      hardcoded `<option>`s (`:94-95`) with `CEFR_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)`.
      Keep the default `useState<CefrLevel>("A1")` and the post-submit reset to `"A1"`.
- [x] In `src/styles.css`, add `.cefr-chip--B1`, `.cefr-chip--B2`, `.cefr-chip--C1`
      with distinct, accessible background/color pairs (continuing the A1 indigo /
      A2 pink palette), e.g. B1 teal (`#ccfbf1`/`#0f766e`), B2 amber
      (`#fef3c7`/`#b45309`), C1 violet (`#ede9fe`/`#6d28d9`).
- [x] Add/extend a component test for `AddCard` asserting the level `<select>`
      renders all five options (`A1`–`C1`).

**Automated Verification**:

- [x] `npm run typecheck` passes (union widening compiles cleanly).
- [x] `npx vitest run src/components/AddCard.test.tsx` passes (five options).
- [x] `npm run lint` and `npm run test` pass.

### Phase 2: Persist a study-level selection

Dependencies: Phase 1 (needs `CefrLevel`/`CEFR_LEVELS`)

Add the persisted selection state and the pure filter, wired through the store —
no UI yet. Internal plumbing, fully covered by automated tests.

**Tasks**:

- [x] In `src/domain/types.ts`, add optional field to `AppState`:
  ```ts
  /** Selected CEFR levels for the study filter. Empty = all levels. */
  studyLevels?: CefrLevel[];
  ```
- [x] In `src/domain/srs.ts`, add the pure filter:
  ```ts
  /** Cards restricted to the given CEFR levels. Empty `levels` = no filter. */
  export function filterByLevels(
    cards: Flashcard[],
    levels: CefrLevel[],
  ): Flashcard[] {
    return levels.length === 0
      ? cards
      : cards.filter((c) => levels.includes(c.cefr));
  }
  ```
- [x] In `src/state/reducer.ts`, add the action to `FlashcardAction` and a case:
  ```ts
  | { type: "SET_STUDY_LEVELS"; levels: CefrLevel[] }
  // ...
  case "SET_STUDY_LEVELS":
    return { ...state, studyLevels: action.levels };
  ```
- [x] In `src/services/storage.ts`:
  - Add a helper `normalizeLevels(v: unknown): CefrLevel[]` that returns only
    valid, de-duplicated `CEFR_LEVELS` members from an array input, else `[]`.
  - Set `studyLevels: []` in `initialState()`.
  - Compute `const studyLevels = normalizeLevels(parsed.studyLevels)` in
    `loadState`, and add `studyLevels` to **each** object-literal return branch
    (`:36`, `:51-55`, `:59`). Confirm the `initialState()` returns (`:20`, `:28`,
    `:41`, catch) also carry it via the updated `initialState()`.
  - Do **not** bump `SEED_VERSION`; the untouched-deck and top-up branches must
    behave exactly as before.
- [x] In `src/hooks/useFlashcards.ts`, add `setStudyLevels` to `UseFlashcards`,
      a `useCallback` dispatching `SET_STUDY_LEVELS`, and return it. `state.studyLevels`
      is already available via `state`.
- [x] Add tests:
  - `src/domain/srs.test.ts` — `filterByLevels`: empty levels → all cards; single
    level → only that level; multiple → union; unknown level → empty.
  - `src/state/reducer.test.ts` — `SET_STUDY_LEVELS` sets `studyLevels` and leaves
    `cards`/`reviews` untouched.
  - `src/services/storage.test.ts` — `loadState` defaults `studyLevels` to `[]`
    when absent; preserves a valid persisted selection through the up-to-date and
    top-up branches; drops invalid entries; the untouched/top-up/seed behavior is
    unchanged.

**Automated Verification**:

- [x] `npx vitest run src/domain/srs.test.ts src/state/reducer.test.ts src/services/storage.test.ts` passes.
- [x] `npm run typecheck` passes.
- [x] `npm run test` passes (no regression in existing storage/seed tests).

### Phase 3: Study-mode level filter UI

Dependencies: Phase 2 (needs `filterByLevels`, `studyLevels`, `setStudyLevels`)

Add the visible selector and wire the filtered deck into Study mode, completing
the user-facing feature.

**Tasks**:

- [x] Create `src/components/LevelFilter.tsx`: a presentational multi-select.
      Props: `selected: CefrLevel[]`, `onChange: (next: CefrLevel[]) => void`.
      Renders an `All` chip (active when `selected.length === 0`) plus a chip per
      `CEFR_LEVELS` entry (active when included). Click handlers:
  - `All` → `onChange([])`.
  - a level → toggle membership; the toggle logic lives here so the array stays
    the single representation (`[]` = All).
    Mark active chips with an `aria-pressed`/class and use `<button>`s.
  ```tsx
  // toggle: selected.includes(l) ? selected.filter(x=>x!==l) : [...selected, l]
  ```
- [x] Export `LevelFilter` from `src/components/index.ts`.
- [x] Update `src/components/StudyMode.tsx`:
  - Extend `Props` with `selectedLevels: CefrLevel[]` and
    `onLevelsChange: (next: CefrLevel[]) => void`.
  - Compute `const shown = useMemo(() => filterByLevels(cards, selectedLevels), [cards, selectedLevels])`
    and pass `shown` to `useStudySession`.
  - Render `<LevelFilter>` **above** the early-return branches so it is always
    visible (restructure so the selector is not inside the `if (!card)` return).
  - Empty-state messaging:
    - deck truly empty (`cards.length === 0`): keep the existing "No cards to
      study yet / Add your first card" panel.
    - filter yields none but deck non-empty: show "No cards at the selected
      level(s). Add some in the Add tab, or pick another level above." with the
      selector still shown.
- [x] Update `src/App.tsx` to pass `selectedLevels={state.studyLevels ?? []}` and
      `onLevelsChange={setStudyLevels}` into `<StudyMode>` (destructure
      `setStudyLevels` from `useFlashcards`).
- [x] Add level-filter chip styles in `src/styles.css` (reuse `.cefr-chip` look
      or a dedicated `.level-filter` row; active vs inactive states).
- [x] Tests:
  - `src/components/LevelFilter.test.tsx` — clicking a level calls `onChange`
    with it added; clicking again removes it; clicking `All` calls `onChange([])`;
    active states reflect `selected`.
  - `src/components/StudyMode.test.tsx` — with cards across levels, selecting a
    level narrows the deck and the "Card N / total" total; selecting a level with
    no cards shows the filter-empty message while the selector stays visible; the
    empty-deck message still appears when `cards` is empty.
- [x] Update `CLAUDE.md`: note the study-by-level filter (Study mode now filters
      the deck by `AppState.studyLevels`, `[]` = all) and that `CEFR_LEVELS` in
      `types.ts` is the single source of truth for levels; reiterate that adding
      levels here needs no `SEED_VERSION` bump unless seed vocabulary changes.

**Automated Verification**:

- [x] `npx vitest run src/components/LevelFilter.test.tsx src/components/StudyMode.test.tsx` passes.
- [x] `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test`, `npm run build` all pass.
- [x] `npm run dev`: in Study mode, `All` is selected by default and the count
      matches the full deck; selecting `A2` narrows the deck to A2 and updates
      "Card N / total"; selecting `A1`+`A2` shows the union.
- [x] Add a `B1` card in the Add tab, return to Study, select `B1`, and confirm
      it appears; selecting `B2` (still empty) shows the filter-empty message with
      the selector visible.
- [x] Reload the page and confirm the last selection is restored.

## Implementation Notes

All three phases implemented. Automated verification green throughout:
`typecheck`, `lint`, `format:check` (source), `test` (43 pass, +15 new), `build`.
Manual verification (`npm run dev` steps below) still pending user confirmation.

- **Plan-review agent findings — both addressed.** The pre-implementation review
  confirmed every file:line reference and that no `loadState` return path was
  left un-threaded. Its two non-blocking reminders were handled:
  - `StudyMode.tsx` now imports `useMemo` (`import { useMemo } from "react"`).
  - `storage.ts` now imports `CEFR_LEVELS` for `normalizeLevels`.
- **`normalizeLevels` also canonicalizes order + de-dupes.** Implemented as
  `CEFR_LEVELS.filter((l) => v.includes(l))`, so a persisted selection is always
  returned in display order with duplicates dropped (covered by a storage test).
- **`StudyMode` restructured, not just extended.** The single `if (!card)` early
  return became: an empty-deck guard (`cards.length === 0`, selector hidden) that
  returns early, then the main panel always renders `<LevelFilter>` with the
  card UI vs. the filter-empty message chosen inside. This keeps the selector
  visible whenever the deck is non-empty.
- **Stale doc comments refreshed** alongside the code: the `cefr` field comment,
  the `.cefr-chip` CSS section header (both `A1/A2` → `A1–C1`), plus new CLAUDE.md
  notes on the study-by-level filter and `CEFR_LEVELS` as the source of truth.
- **Pre-existing, out-of-scope:** `format:check` still warns on two docs markdown
  files (this plan + the research doc) — both were flagged before this work began
  and are untouched by the feature.

## References

- Research: `docs/agents/research/2026-07-02-spaced-repetition-system.md`
- `src/domain/types.ts:2` — `CefrLevel` union to extend.
- `src/domain/srs.ts:18-23` — `buildStudyOrder` (selection logic lives here).
- `src/hooks/useStudySession.ts:35-43` — membership-signature rebuild reused by the filter.
- `src/services/storage.ts:16-64` — `loadState` return paths that must thread `studyLevels`.
- `src/components/AddCard.tsx:94-95` — hardcoded options to replace.
- `src/components/StudyMode.tsx:23-32,41` — empty-state branch and CEFR chip.
- `src/styles.css:137-160` — `.cefr-chip` base and per-level modifiers.
