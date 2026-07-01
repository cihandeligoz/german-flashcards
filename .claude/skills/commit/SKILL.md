---
name: commit
description: Analyze staged git changes, write a Conventional Commits message that follows this repo's CLAUDE.md rules, and create the commit. Use this whenever the user asks to commit, "commit my changes", "commit this", "make a commit", "commit the staged files", or otherwise wants staged work turned into a well-formed commit. Prefer this over an ad-hoc `git commit` so the message names the concrete behavior and matches the project's convention.
---

# Commit

Turn the currently **staged** changes into one well-formed Conventional Commits commit whose message describes the concrete behavior that changed — not a vague "update".

## Procedure

1. **Read what's staged.** Run these together:
   - `git diff --cached --stat` (scope of the change — which files/areas)
   - `git diff --cached` (the actual change, so the message reflects behavior, not guesswork)
   - `git log --oneline -5` (match the repo's existing message style)

2. **If nothing is staged, stop and ask.** `git diff --cached --quiet` exits 0 when the index is empty. In that case tell the user there are no staged changes and ask whether to stage everything (`git add -A`) or specific files — do **not** silently `git add` on their behalf, since what to include is their call.

3. **Check for repo rules.** If `CLAUDE.md` exists, its "Commit Message Rules" section is the source of truth — read and follow it. The rules below mirror it; if they ever diverge, CLAUDE.md wins.

4. **Compose the message** (see format and rules below).

5. **Commit.** Use a real newline-capable form so the body renders correctly:

   ```bash
   git commit -m "<subject>" -m "<body>"      # omit the second -m if no body is needed
   ```

   A global git identity is configured, so no `-c user.*` flags are needed. Never add `--no-verify` — the pre-commit hook (lint-staged) is meant to run.

6. **Confirm.** Show the resulting `git log --oneline -1` (and `git status` if anything remains unstaged) so the user sees exactly what landed.

## Message format

```
<type>(<scope>): <description>

<optional body>
```

- **type** — one of: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`.
- **scope** — the affected area, lowercase (e.g. `auth`, `srs`, `storage`, `claude`). Infer it from the staged paths; omit the parentheses only if the change is genuinely repo-wide.
- **description** — imperative, lowercase, no trailing period.

## The rules that make a message good

The point of the description is that someone scanning `git log` understands _what actually changed_ without opening the diff. That means:

- **Name the concrete behavior or change, not a vague verb.** "add", "update", "begin", "fix stuff" describe your action, not the outcome. Say what the code now does or what was corrected.
- **If a ticket or test-case reference exists** (e.g. `TC 4.2`, `JIRA-123`), keep it _and_ append a short summary of what it verifies — the reference alone is not self-explanatory in the log.
- **Use a body when context is needed.** First line = _what_; body = _why_, or what gap/bug it closes. Skip the body for small, self-evident changes.
- **Never produce two commits that look identical in `git log`.** If the subject would duplicate a recent one, differentiate it by the specific behavior each touches.

## Examples

**Example 1** — a test was added:

- Bad: `test: add map test`
- Good: `test(map): verify vehicle positions load on monitoring overview`

**Example 2** — a test tied to a test case:

- Bad: `test: update TC 4.2`
- Good: `test(auth): TC 4.2 — confirm login fails with expired token`

**Example 3** — a bug fix that benefits from a body:

```
fix(storage): reseed stale deck when seedVersion is behind

Existing users kept the old 20-word deck after a seed bump because
loadState only reseeded on empty storage; now it also refreshes an
untouched deck whose seedVersion is older than SEED_VERSION.
```

## Scope & safety

- Commit only what is already staged. If the user asks to "commit everything", stage with `git add -A` first (with their go-ahead per step 2), then proceed.
- Don't push unless the user asks.
- If staged changes span unrelated concerns, say so and suggest splitting into separate commits rather than forcing one mismatched message.
