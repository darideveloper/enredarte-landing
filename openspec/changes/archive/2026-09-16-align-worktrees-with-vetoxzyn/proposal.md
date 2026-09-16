## Why

`enredarte-landing` and `vetoxzyn` share the same Git-worktree + Portless foundation but have diverged in automation: enredarte uses the `opencode-worktree` plugin (symlinked `node_modules`, auto-synced `openspec/changes/`, agent sessions in a central store) while vetoxzyn is manual-siblings-only with a `PORTLESS_URL → SITE_URL → prod` site chain. The divergence causes stale-`SITE_URL` bugs, symlink/TTY install failures, and snapshot-commit risks in enredarte that vetoxzyn already solved.

## What Changes

- **BREAKING**: Remove `opencode-worktree` plugin support from this project: delete `.opencode/worktree.jsonc` and forbid `worktree_create` / `worktree_delete` here; agent sessions use manual siblings in the same terminal session.
- Replace symlinked `node_modules` with a real `pnpm install` per sibling worktree.
- Adopt vetoxzyn's `site` resolution chain in `astro.config.mjs`: `process.env.PORTLESS_URL ?? process.env.SITE_URL ?? 'https://enredarte.mx'` (plus `loadEnvFile` shim so `.env` is visible to the config), making a fresh `.env` copy harmless.
- Change openspec handling to vetoxzyn's isolation model: nothing crosses automatically; only `openspec/changes/archive/` (tracked) is copied by hand when needed; new siblings get `.opencode/skills/openspec-*` + `commands/opsx-*.md` synced by hand (markdown only).
- Update `AGENTS.md` (§ Git worktrees) and `docs/astro-worktrees.md` to the manual-siblings-only workflow: same-session rule, pre-flight `git status` check, manual bootstrap + skills sync, `SITE_URL` harmless note, `portless list` verification.
- Keep `dev` script on plain `portless run pnpm astro dev` (vetoxzyn parity; `NODE_OPTIONS=--use-openssl-ca` documented for MITM proxies only); keep `.env` contract (`SITE_URL`, `API_BASE_URL`, `API_TOKEN`) unchanged.
- Add `SITE_URL=https://enredarte-landing.localhost` to `.env.example` (vetoxzyn parity) so a fresh clone can bootstrap via `cp .env.example .env` when no `.env` exists to copy from main.
- Port vetoxzyn's agent-environment server rules: canonical foreground dev start, never `--background` (it orphans the proxy route), agents never autostart servers, plus the Astro ≥7.3 auto-background orphan fix pattern (`astro dev stop` → relaunch with agent env vars stripped → verify with `portless list`).

## Capabilities

### New Capabilities

- None — no new runtime behavior is introduced.

### Modified Capabilities

- `worktree-dev-workflow`: worktree bootstrap, lifecycle, and per-checkout URL requirements change from plugin-assisted (symlink + auto openspec sync) to manual-siblings-only with `PORTLESS_URL`-first site resolution and isolated openspec proposals.

## Impact

- Affected files: `.opencode/worktree.jsonc` (deleted), `package.json` (`dev` → plain `portless run`), `astro.config.mjs` (`site` chain + env loading), `.env.example` (add `SITE_URL`), `AGENTS.md` (§ Development foreground-start rule + § Git worktrees), `docs/astro-worktrees.md` (full rewrite to vetoxzyn model + enredarte-specific `.env`/backend notes), `docs/astro-site-config.md` (add `PORTLESS_URL → SITE_URL → prod` consumer rule), `docs/astro-portless.md` (chain reference + "Running under AI agents" section).
- No API, dependency, or production-deploy changes (Docker/nginx untouched; `site` fallback still emits prod domain on builds without env).
- Workflow impact: existing agent central-store worktrees (if any) stop being supported; teammates create `../enredarte-<branch>` siblings and run one `pnpm install` each.
