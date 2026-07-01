# Deutsch Flashcards 🇩🇪

A minimal German flashcard learning webapp built with **React + TypeScript + Vite**.

## Features

- **Add flashcards** — German word, English translation, and example sentences.
- **Study mode** — see the German word, guess, then reveal the answer and mark
  it **✓ Knew it** or **✗ Didn't know**.
- **Adaptive repetition** — a Leitner box system. Words you don't know drop to
  level 1 and are shown *exponentially* more often; mastered words appear rarely.
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

| Variable         | Purpose                                    | Example        |
| ---------------- | ------------------------------------------ | -------------- |
| `AI_API_KEY`     | Bearer key for the aikeys proxy (secret)   | `sk-...`       |
| `VITE_AI_MODEL`  | Model id requested from the proxy          | `gpt-4o-mini`  |

> If you don't set an API key, the app still works fully — you just enter
> example sentences yourself instead of generating them.

## Scripts

- `npm run dev` — start the dev server (required for AI proxying).
- `npm run build` — typecheck + production build to `dist/`.
- `npm run preview` — preview the production build.
- `npm run typecheck` — type-check only.

## Project structure

```
src/
  types.ts              Flashcard / review data model
  storage.ts            localStorage load & save
  srs.ts                Spaced-repetition: weighting + selection + review
  stats.ts              Daily statistics
  ai.ts                 AI example-sentence generation
  App.tsx               State, persistence, tab navigation
  components/
    AddCard.tsx         Add form + AI generate + card list
    StudyMode.tsx       Reveal / knew-it flow
    Stats.tsx           Statistics dashboard
  styles.css            Clean minimal theme
```
