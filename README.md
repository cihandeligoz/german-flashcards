# Deutsch Flashcards 🇩🇪

A minimal German flashcard learning webapp built with **React + TypeScript + Vite**.

## Features

- **Add flashcards** — German word, English translation, and example sentences.
- **Study mode** — see the German word, guess, then reveal the answer and mark
  it **✓ Knew it** or **✗ Didn't know**.
- **Adaptive repetition** — a Leitner box system. Words you don't know drop to
  level 1 and are shown _exponentially_ more often; mastered words appear rarely.
- **Statistics** — total cards, cards learned today, overall success rate, and
  reviews today.
- **AI example generation** — auto-generate natural German example sentences
  from the MaibornWolff `aikeys` endpoint (an OpenAI-compatible LiteLLM proxy).
- All data is stored locally in your browser (`localStorage`) — nothing leaves
  your machine except the AI generation requests you trigger.

## Getting started

```bash
npm install
cp .env.example .env    # then add your AI_API_KEY
npm run dev             # http://localhost:5173
```

## AI configuration

The AI call goes through the Vite dev-server proxy (`/api/ai` → the aikeys
endpoint). This keeps your API key **server-side** — it is injected into the
proxied request and never shipped to the browser.

Set these in `.env`:

| Variable        | Purpose                                  | Example       |
| --------------- | ---------------------------------------- | ------------- |
| `AI_API_KEY`    | Bearer key for the aikeys proxy (secret) | `sk-...`      |
| `VITE_AI_MODEL` | Model id requested from the proxy        | `gpt-4o-mini` |

> If you don't set an API key, the app still works fully — you just enter
> example sentences yourself instead of generating them.

## Scripts

- `npm run dev` — start the dev server (required for AI proxying).
- `npm run build` — typecheck + production build to `dist/`.
- `npm run preview` — preview the production build.
- `npm run typecheck` — type-check the project (`tsc -b`).
- `npm run lint` / `lint:fix` — ESLint over the codebase.
- `npm run format` / `format:check` — Prettier write / check.
- `npm run test` / `test:watch` — Vitest unit + component tests.
- `npm run coverage` — tests with a V8 coverage report.

## Quality tooling

- **ESLint** (flat config) + **Prettier** keep the code consistent.
- **Vitest** + **React Testing Library** (jsdom) cover the pure logic, the
  reducer, storage migration, and the study/add-card components.
- **Husky** runs `lint-staged` on `pre-commit` (auto-fix + format staged files)
  and `typecheck + test` on `pre-push`.
- **GitHub Actions** (`.github/workflows/ci.yml`) runs typecheck, lint,
  format-check, tests, and build on every push / PR.

## Project structure

The `@/` path alias maps to `src/`. Layers are separated by intent:

```
src/
  domain/        Pure, framework-free model + logic (React never imported here)
    types.ts       Flashcard / review / AppState model
    srs.ts         Spaced repetition: weighting, study order, review
    stats.ts       Daily statistics
    seed.ts        Goethe A1 seed vocabulary
  services/      Side-effectful adapters
    storage.ts     localStorage load/save + seed migration
    ai.ts          AI example-sentence generation
  state/         reducer.ts — pure flashcard reducer (add/delete/answer)
  hooks/         useFlashcards (store + persistence), useStudySession
  lib/           id.ts — id generation
  components/    AddCard, StudyMode, Stats (UI only)
  App.tsx        Composition + tab navigation
  styles.css     Clean minimal theme
```

Each folder exposes a barrel `index.ts`, so imports read as `@/domain`,
`@/services`, `@/hooks`, etc. State lives in the `useFlashcards` hook (a
`useReducer` store) rather than in `App.tsx`, and the pure reducer/logic are
unit-tested independently of React.
