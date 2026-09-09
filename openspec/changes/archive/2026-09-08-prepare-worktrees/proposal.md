## Why

The repo has parallel branches (`dari`, `mehedi`, `silvia`) but only one checkout, so switching branches forces stash/checkout cycles and only one `pnpm run dev` can run at a time. The hardcoded `portless enredarte-landing` dev name means two checkouts would fight over `https://enredarte-landing.localhost`. Preparing the project for git worktrees removes this friction before more parallel work lands.

## What Changes

- Switch `package.json` `dev` script from hardcoded `portless enredarte-landing ...` to `portless run ...` so each checkout/worktree gets its own URL automatically (`enredarte-landing.localhost` on main, `<branch>.enredarte-landing.localhost` in worktrees).
- Add a documented worktree workflow: sibling-directory layout, per-worktree `pnpm install` + `.env` copy, distinct dev URLs running simultaneously, and removal/prune commands.
- Document worktree-specific gotchas for this repo: `node_modules/`, `.env`, `.astro/`, `dist/` are gitignored and must be bootstrapped per worktree; `.*/` gitignore means editor/agent dotfolders don't transfer; `SITE_URL` currently points at main's URL.
- Keep the backend reference (`API_BASE_URL=https://enredarte-dashboard.localhost`) unchanged and shared across worktrees.

## Capabilities

### New Capabilities

- `worktree-dev-workflow`: run any branch checkout (main repo or git worktree) with an auto-derived portless URL, bootstrap per-worktree dependencies/env, and run multiple dev servers concurrently without name collisions.

### Modified Capabilities

- None. No existing spec requirements change; this only alters the local dev entrypoint and adds workflow docs.

## Impact

- `package.json` (`dev` script, one line); `AGENTS.md` (worktree workflow docs — single source, `README.md` stays untouched).
- Local-only behavior: dev URLs for worktrees become `<branch>.enredarte-landing.localhost`; main URL is unchanged.
- No production impact: no change to `astro.config.mjs` logic, build output, routes, or deployed `site` URL.
- Planned follow-up (separate change): make worktree `SITE_URL` fall back to `PORTLESS_URL` automatically.
