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

A React 18 + Vite + TypeScript single-page app for studying German flashcards. No backend, no routing, no state library — everything persists to `localStorage`. Code is split into intent-based layers (`domain/`, `services/`, `state/`, `hooks/`, `components/`) imported via the `@/` alias, with unidirectional data flow through the single `useFlashcards` store.

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for the full layer breakdown, data flow, conventions (`@/` alias, `noUncheckedIndexedAccess`, `CEFR_LEVELS` source of truth), and the three things that are easy to get wrong (dev-server-only AI, the ordered study deck, and `seedVersion` migration).

## Commit Message Rules

- Use conventional commits format: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`
- The description must name the concrete behavior or change, not vague verbs like "add", "update", or "begin".
  - Bad: "Add map test" / Good: `test(map): verify vehicle positions load on monitoring overview`
  - Bad: "Update TC 4.2" / Good: `test(auth): TC 4.2 — confirm login fails with expired token`
- If a ticket/TC reference exists, always append a short summary of what it verifies.
- Use the commit body when context is needed: first line = _what_, body = _why_ or what gap it closes.
- Never write two commits that look identical in `git log` without opening the diff.
