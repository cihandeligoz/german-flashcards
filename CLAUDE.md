# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Vite dev server at http://localhost:5173 (required for AI generation — see below)
npm run build          # tsc -b + vite build to dist/
npm run typecheck      # tsc -b (project references; also the CI type gate)
npm run lint           # ESLint (flat config)
npm run format:check   # Prettier check (format to fix)
npm run test           # Vitest run (unit + component)
npm run test:watch     # Vitest watch mode
npm run coverage       # Vitest with V8 coverage
```

Run a single test file or filter by name:

```bash
npx vitest run src/domain/srs.test.ts        # one file
npx vitest run -t "resets to level 1"        # tests matching a name
npx vitest src/components/StudyMode.test.tsx # watch one file
```

CI (`.github/workflows/ci.yml`) runs typecheck → lint → format:check → test → build. Husky enforces `lint-staged` on pre-commit and `typecheck + test` on pre-push, so a normal `git commit` reformats/lints staged files automatically.

## Architecture

A React 18 + Vite + TypeScript single-page app for studying German flashcards. No backend, no routing, no state library — everything persists to `localStorage`. Layers are separated by intent and imported via the `@/` alias (→ `src/`), each folder exposing a barrel `index.ts`:

- **`src/domain/`** — pure, framework-free model + logic; **never import React here**. `types.ts` (Flashcard/ReviewEvent/AppState), `srs.ts` (spaced repetition), `stats.ts`, `seed.ts` (~318-word Goethe A1 seed deck).
- **`src/services/`** — side-effectful adapters: `storage.ts` (localStorage + migration) and `ai.ts` (network).
- **`src/state/reducer.ts`** — the pure `flashcardsReducer` (`ADD_CARD`/`DELETE_CARD`/`ANSWER_CARD`). Non-deterministic inputs (id, timestamps) are passed **in the action** so the reducer stays deterministic and unit-testable.
- **`src/hooks/`** — `useFlashcards` is the single store: `useReducer(flashcardsReducer, undefined, loadState)` + a `useEffect` that `saveState`s the whole `AppState` on every change; it injects `makeId()`/`Date.now()` at dispatch time. `useStudySession` owns the study cursor.
- **`src/components/`** — presentational only; they receive state and callbacks via props from `App.tsx`.

Data flow is unidirectional: components call `useFlashcards` callbacks → reducer → new `AppState` → persisted → re-render. When touching business logic, keep it in `domain/` (pure) and test it there rather than in components.

### Three things that are easy to get wrong

1. **AI generation is dev-server-only.** `ai.ts` POSTs to `/api/ai/chat/completions`, which exists **only** as a Vite dev proxy (`vite.config.ts`) that injects the `AI_API_KEY` bearer header server-side. A static `vite build` has no such backend, so AI won't work in production without adding a real proxy. The app is fully functional without a key — users just type examples manually.

2. **Study mode is an ordered deck, not per-draw random.** `buildStudyOrder` (srs.ts) lays the whole deck into a stable weighted-shuffled sequence (struggling/low-Leitner-level cards tend to appear earlier), each card once per pass — this backs the "Card N / total" position and Previous/Skip. `useStudySession` only rebuilds the order when deck _membership_ changes (tracked via an id signature). Editing selection logic means editing `buildStudyOrder`, not the component. Study mode also filters the deck by CEFR level: `StudyMode` runs `filterByLevels(cards, state.studyLevels)` (srs.ts) before `useStudySession`, so changing the selection changes the id signature and restarts the pass for free. `studyLevels` is `[]` = all levels; it persists in `AppState` and is set via the `SET_STUDY_LEVELS` reducer action / `setStudyLevels` callback.

3. **Seed loading has a migration, gated on `seedVersion`.** `loadState` seeds the deck on first run and _re-seeds a stale, untouched deck_ (older `seedVersion`, no reviews, no user-added cards) so vocabulary updates reach existing users without wiping real progress. **Bump `SEED_VERSION` in `storage.ts` whenever the seed content in `seed.ts` changes**, or existing users keep the old deck.

### Conventions

- `tsc -b` uses project references (`tsconfig.app.json` for `src/`, `tsconfig.node.json` for `vite.config.ts`). `noUncheckedIndexedAccess` is on, so array/index access is `T | undefined` — guard or assert (`arr[i]!`) deliberately.
- Nouns in the seed data carry their article (der/die/das) as part of the German field.
- `CEFR_LEVELS` (ordered `["A1", "A2", "B1", "B2", "C1"]`) in `domain/types.ts` is the single source of truth for CEFR levels — feeds the AddCard `<option>`s, the study-mode `LevelFilter`, and load-time validation (`normalizeLevels` in storage.ts). Adding a level here needs **no `SEED_VERSION` bump** — that's only for seed _vocabulary_ changes.

## Commit Message Rules

- Use conventional commits format: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`
- The description must name the concrete behavior or change, not vague verbs like "add", "update", or "begin".
  - Bad: "Add map test" / Good: `test(map): verify vehicle positions load on monitoring overview`
  - Bad: "Update TC 4.2" / Good: `test(auth): TC 4.2 — confirm login fails with expired token`
- If a ticket/TC reference exists, always append a short summary of what it verifies.
- Use the commit body when context is needed: first line = _what_, body = _why_ or what gap it closes.
- Never write two commits that look identical in `git log` without opening the diff.
