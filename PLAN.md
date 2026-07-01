# Plan: Harden architecture, add linting, testing & pre-commit hooks

## Context

The German flashcard webapp (`/Users/cihandeligoz/Desktop/agentic-coding`) works and has a
clean, framework-free logic core, but it has **no quality tooling**: it is not a git repo, and
there is no ESLint, Prettier, test runner, pre-commit hook, or CI. All app state and mutation
logic lives inline in `App.tsx`, persistence is an inline `useEffect`, and `StudyMode` owns
derived session state. This is fine at ~1000 lines but won't scale as features grow. The goal is
to add a professional quality baseline (lint + format + tests + hooks + CI) and a **moderate**
architectural refactor that decouples state from the root component — without a heavy rewrite.

Scope decisions confirmed with the user:
- **Testing:** unit (Vitest) **+ component** (React Testing Library + jsdom).
- **Architecture:** **moderate** — `useFlashcards` hook backed by `useReducer`, centralized
  domain layer, barrel exports, path aliases.
- **CI:** **yes** — GitHub Actions running typecheck + lint + tests.
- **Git:** **yes** — `git init` + an initial commit of the current working app before tooling.

## Current state (verified)

- React 18, Vite 5, TypeScript strict. No state library; single `useState<AppState>` in `App.tsx`
  drilled via props to `StudyMode`/`AddCard`/`Stats`.
- Pure/logic modules (React-free, already testable): `src/srs.ts`, `src/stats.ts`,
  `src/storage.ts`, `src/ai.ts`, `src/types.ts`, `src/seed.ts`.
- Mutations centralized in `App.tsx` (`addCard`, `deleteCard`, `answerCard`, local `makeId`);
  persistence via `useEffect(() => saveState(state), [state])`.
- Notable: `pickNextCard` in `srs.ts` is a **dead export**; `tsconfig.tsbuildinfo` is not
  gitignored; the AI proxy in `vite.config.ts` **only exists in the dev server** (prod build has
  no `/api/ai` backend).

---

## 1. Git baseline (do first)

- `git init`; extend `.gitignore` with `tsconfig.tsbuildinfo`, `*.tsbuildinfo`, `coverage/`.
- Initial commit of the current working tree ("Initial working app") **before** any refactor, so
  there is a clean restore point.

## 2. Architecture refactor (moderate)

Reorganize `src/` into intent-revealing folders and lift state out of `App.tsx`. Use a path alias
so imports stay stable across the moves.

**Target layout:**
```
src/
  domain/     types.ts, srs.ts, stats.ts, seed.ts      (pure logic + data, React-free)
  services/   storage.ts, ai.ts                          (side effects: persistence, network)
  state/      reducer.ts                                 (pure reducer + action types)
  hooks/      useFlashcards.ts, useStudySession.ts
  lib/        id.ts                                       (makeId, extracted from App.tsx)
  components/ AddCard.tsx, Stats.tsx, StudyMode.tsx      (UI only)
  App.tsx, main.tsx, styles.css, vite-env.d.ts
```
Each folder gets a barrel `index.ts` re-exporting its public API (e.g. `@/domain`, `@/services`).

**State decoupling:**
- `src/state/reducer.ts` — pure `flashcardsReducer(state, action)` with actions
  `ADD_CARD | DELETE_CARD | ANSWER_CARD`. `ANSWER_CARD` reuses `reviewCard` (`src/domain/srs.ts`)
  and appends a `ReviewEvent`. Fully unit-testable with no React.
- `src/hooks/useFlashcards.ts` — wraps `useReducer(flashcardsReducer, undefined, loadState)`,
  wires persistence (`useEffect` → `saveState`), and returns `{ state, addCard, deleteCard,
  answerCard, stats }` (memoized `computeStats`). This replaces the inline logic in `App.tsx`.
- `src/hooks/useStudySession.ts` — encapsulates `StudyMode`'s `order`/`pos`/`revealed` +
  membership-signature logic (currently in the component), exposing `{ card, position, total,
  revealed, reveal, next, prev, answer, canPrev }`. Makes the study flow testable in isolation.
- `App.tsx` shrinks to composition + tab nav; `StudyMode.tsx` consumes `useStudySession`.

**Cleanups:** remove the dead `pickNextCard` export; centralize `makeId` in `src/lib/id.ts`.

**Path alias `@/` → `src/`:** add `compilerOptions.paths` (`"@/*": ["src/*"]`) in the app tsconfig
and `resolve.alias` in `vite.config.ts`; Vitest inherits the Vite alias.

## 3. Linting & formatting

- **ESLint flat config** `eslint.config.js`: `@eslint/js` + `typescript-eslint` (type-checked
  rules), `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`; ignore `dist`.
- **Prettier**: `.prettierrc` (match existing 2-space style) + `.prettierignore`;
  `eslint-config-prettier` last in the ESLint chain to disable conflicting stylistic rules.
- Deps (dev): `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`,
  `eslint-plugin-react-refresh`, `globals`, `prettier`, `eslint-config-prettier`.
- Scripts: `"lint": "eslint ."`, `"lint:fix": "eslint . --fix"`,
  `"format": "prettier --write ."`, `"format:check": "prettier --check ."`.

## 4. Testing (Vitest + Testing Library)

- Add a `test` block to `vite.config.ts` (via `/// <reference types="vitest/config" />`):
  `environment: 'jsdom'`, `globals: true`, `setupFiles: 'src/test/setup.ts'`,
  `coverage` (v8 provider).
- `src/test/setup.ts` imports `@testing-library/jest-dom`.
- Deps (dev): `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`,
  `@testing-library/jest-dom`, `@testing-library/user-event`.
- **Unit tests** (colocated `*.test.ts`):
  - `domain/srs.test.ts` — `cardWeight` per level; `reviewCard` promotes on knew / resets to 1 on
    miss and updates counters/timestamps; `buildStudyOrder` returns every id exactly once.
  - `domain/stats.test.ts` — `computeStats` today-boundary logic, distinct learned-today, success
    rate, null when no reviews (inject a fixed `now`).
  - `services/storage.test.ts` — first-run seeding; **stale-seed migration reseeds** when no
    user cards/reviews; user cards/reviews **preserved**; corrupt-JSON fallback (jsdom
    `localStorage`).
  - `state/reducer.test.ts` — add/delete/answer transitions produce correct immutable state.
- **Component tests** (`*.test.tsx`):
  - `StudyMode.test.tsx` — reveal shows answer; "Knew it"/"Didn't know" advance; **Previous
    disabled** on first card; progress text `Card 1 / N`; Skip advances without recording.
  - `AddCard.test.tsx` — submitting adds a card; AI button calls a **mocked** `generateExamples`
    (`vi.mock('@/services/ai')`) and populates examples; error path renders the message.
- Scripts: `"test": "vitest run"`, `"test:watch": "vitest"`,
  `"coverage": "vitest run --coverage"`.

## 5. Pre-commit hooks (Husky + lint-staged)

- Deps (dev): `husky`, `lint-staged`; `"prepare": "husky"`.
- `.husky/pre-commit` → `npx lint-staged` (fast: only staged files).
- `lint-staged` config (in `package.json`): `*.{ts,tsx}` → `eslint --fix` + `prettier --write`;
  `*.{json,css,md}` → `prettier --write`.
- Optional `.husky/pre-push` → `npm run typecheck && npm run test` (keeps commits fast while
  guarding pushes). Recommended.

## 6. CI (GitHub Actions)

- `.github/workflows/ci.yml`: trigger on push + PR to `main`; Node 20; `npm ci`; run
  `typecheck`, `lint`, `format:check`, `test` (coverage), and `build`. Mirrors local hooks as a
  server-side safety net.

## 7. tsconfig hardening

- Split into the standard Vite layout to match `tsc -b`: `tsconfig.json` (references) →
  `tsconfig.app.json` (src) + `tsconfig.node.json` (vite.config). Carry over existing strict
  flags and the `@/*` paths.
- Enable **`noUncheckedIndexedAccess`** for safer array/index access (e.g. `order[pos]`,
  `cards[0]`); add the few guards it surfaces. Recommended; flagged because it may require small
  local fixes.

---

## Resulting `package.json` scripts

`dev`, `build`, `preview`, `typecheck`, `lint`, `lint:fix`, `format`, `format:check`, `test`,
`test:watch`, `coverage`, `prepare`.

## Files created (representative) / modified

- **New:** `eslint.config.js`, `.prettierrc`, `.prettierignore`, `tsconfig.app.json`,
  `tsconfig.node.json`, `.husky/pre-commit` (+ optional `pre-push`), `.github/workflows/ci.yml`,
  `src/test/setup.ts`, `src/state/reducer.ts`, `src/hooks/useFlashcards.ts`,
  `src/hooks/useStudySession.ts`, `src/lib/id.ts`, per-folder `index.ts` barrels, and the
  `*.test.ts(x)` files above.
- **Moved:** `srs.ts`/`stats.ts`/`types.ts`/`seed.ts` → `src/domain/`;
  `storage.ts`/`ai.ts` → `src/services/` (imports updated via `@/` alias).
- **Modified:** `App.tsx` (use `useFlashcards`), `StudyMode.tsx` (use `useStudySession`),
  `AddCard.tsx` (import path), `vite.config.ts` (alias + `test`), `tsconfig.json`, `.gitignore`,
  `package.json`.

## Verification

1. `npm install` (new dev deps).
2. `npm run format:check` → clean; `npm run lint` → 0 errors; `npm run typecheck` → passes.
3. `npm run test` → all unit + component tests green; `npm run coverage` shows the domain/state
   modules well covered.
4. `npm run build` → succeeds.
5. `npm run dev`, then load `http://localhost:5173/` and confirm the app still works end-to-end
   (study a card, reveal, mark, add a card, check stats) — screenshot via headless Chrome as in
   prior steps. **No behavior change expected** from the refactor.
6. Stage a trivial edit and `git commit` → confirm the pre-commit hook runs lint-staged and
   formats/lints the staged file.

## Out of scope / notes

- **AI in production:** the `/api/ai` proxy lives only in the Vite dev server, so AI generation
  works under `npm run dev` but not a static `vite build`. Making it work in prod needs a small
  serverless/Express proxy holding the key — noted as a **future** item, not part of this plan.
- No visual redesign; `styles.css` stays a single global stylesheet.
- Refactor is behavior-preserving — the test suite is the guard that nothing regresses.
