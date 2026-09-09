## 1. Dev entrypoint switch

- [x] 1.1 Change `package.json` `dev` script to `portless run pnpm astro dev` (keep `NODE_OPTIONS` prefix)
- [x] 1.2 Run `pnpm run dev` on main, confirm `portless list` shows `https://enredarte-landing.localhost` and the site loads

## 2. Worktree workflow docs (`AGENTS.md` only)

- [x] 2.1 Add `AGENTS.md` section: enforced sibling layout (`../enredarte-<branch>`), `git worktree add/list/remove/prune` commands for `dari`/`mehedi`/`silvia`
- [x] 2.2 Document per-worktree bootstrap: `pnpm install` + `cp ../enredarte-landing/.env .env`, required keys (`SITE_URL`, `API_BASE_URL`, `API_TOKEN`), shared dashboard URL unchanged
- [x] 2.3 Document gotchas: gitignored paths per worktree, `.*/` dotfolders don't transfer, new worktrees start clean (commit/stash first), concurrent URLs (`<branch>.enredarte-landing.localhost`), manual `SITE_URL` override until the `PORTLESS_URL`-fallback follow-up lands

## 3. Verification

- [x] 3.1 Create trial worktree for `mehedi`, bootstrap, run both dev servers concurrently and confirm both URLs respond
- [x] 3.2 Run `pnpm build` in the worktree (passes `validate-i18n` + `validate-imports`)
- [x] 3.3 Remove the trial worktree with `git worktree remove`, run `git worktree prune`, confirm `git worktree list` is clean
