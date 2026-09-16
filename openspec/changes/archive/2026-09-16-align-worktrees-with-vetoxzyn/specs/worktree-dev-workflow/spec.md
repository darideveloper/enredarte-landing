## MODIFIED Requirements

### Requirement: Auto-derived dev URL per checkout
The dev entrypoint SHALL derive the portless URL automatically instead of hardcoding one app name, so concurrent checkouts do not collide. The Astro `site` SHALL resolve per checkout as `process.env.PORTLESS_URL ?? process.env.SITE_URL ?? 'https://enredarte.mx'`, so a worktree never needs a `.env` edit for correct canonicals.

#### Scenario: Main checkout keeps stable URL
- **WHEN** a developer runs `pnpm run dev` in the main checkout on `main`
- **THEN** the site is served at `https://enredarte-landing.localhost` (unchanged from today)

#### Scenario: Worktree gets branch-prefixed URL
- **WHEN** a developer runs `pnpm run dev` in a git worktree on branch `mehedi`
- **THEN** the site is served at `https://mehedi.enredarte-landing.localhost` without any manual `--name` flag or file edit in that worktree

#### Scenario: Worktree resolves its own site URL without env edits
- **WHEN** a worktree runs with a freshly copied `.env` whose `SITE_URL` still points at main's URL
- **THEN** `site` resolves to that checkout's injected `PORTLESS_URL` first, and sitemap/canonicals emit the branch-subdomain URL

#### Scenario: Concurrent dev servers do not collide
- **WHEN** `main` and at least one worktree run `pnpm run dev` simultaneously
- **THEN** each serves on its own URL and `portless list` shows both routes active

### Requirement: Per-worktree bootstrap
Each worktree SHALL be bootstrappable independently using only the repo's documented manual workflow in the same terminal session, given that gitignored paths are not shared between worktrees. No `node_modules` symlink SHALL be used; each sibling runs a real `pnpm install`. Openspec proposals SHALL stay isolated: active `openspec/changes/*` never cross checkouts automatically.

#### Scenario: Fresh worktree boots after documented steps
- **WHEN** a developer creates a worktree with `git worktree add`, then runs the documented bootstrap (copy `.env`, real `pnpm install`, manual `.opencode` skills/commands sync)
- **THEN** `pnpm run dev` starts successfully and `pnpm build` passes `validate-i18n` and `validate-imports`

#### Scenario: Required env is documented
- **WHEN** a developer reads the worktree workflow docs
- **THEN** they learn which variables each worktree needs (`SITE_URL`, `API_BASE_URL`, `API_TOKEN`), that `API_BASE_URL` stays pointed at the shared dashboard (`https://enredarte-dashboard.localhost`) unless they override it, and that a stale `SITE_URL` copy is harmless because the `PORTLESS_URL → SITE_URL → prod` chain resolves each checkout's own URL first

#### Scenario: Fresh clone falls back to .env.example
- **WHEN** a developer bootstraps a worktree on a fresh clone with no `.env` to copy from main
- **THEN** copying `.env.example` to `.env` provides `SITE_URL` (plus the backend placeholders to fill), and `pnpm run dev` serves the checkout's own portless URL

#### Scenario: Openspec proposals stay isolated
- **WHEN** a developer starts a proposal in one checkout
- **THEN** no other checkout receives it automatically, and only `openspec/changes/archive/` (the tracked path) is copied back to main by hand before merge

### Requirement: Worktree lifecycle docs
The repo docs SHALL describe the manual-siblings-only layout, lifecycle commands, and repo-specific gotchas, and SHALL forbid the `opencode-worktree` plugin tools (`worktree_create` / `worktree_delete`) in this project.

#### Scenario: Developer follows docs end to end
- **WHEN** a developer follows the docs to check pre-flight `git status`, add a worktree for an existing branch, list worktrees, verify with `portless list`, and remove the worktree after merge (stopping dev first)
- **THEN** all commands succeed with sibling directories (e.g. `../enredarte-mehedi`), no nested worktree inside the main checkout is required, no new terminal or central-store path is used, and `git worktree list` / `prune` behave as documented

#### Scenario: Gotchas are visible before first worktree
- **WHEN** a developer reads the gotchas section
- **THEN** they learn that `node_modules/`, `.env`, `.astro/`, `dist/` must be recreated per worktree (real install, no symlink), that dotfolders (`.*/` gitignore) do not transfer (sync `.opencode/skills/openspec-*` + `commands/opsx-*.md` by hand), that uncommitted changes in one checkout do not appear in a new worktree, and that one dev server runs per checkout with squash on merge

#### Scenario: Servers run manually in the foreground
- **WHEN** a developer or agent starts a dev server in any checkout
- **THEN** it runs in the foreground via `pnpm run dev` (never `--background`), agents never autostart servers, and an orphaned route (proxy 404 while the direct port answers) is fixed by stopping the orphan and relaunching with agent env vars stripped, verified with `portless list`

## ADDED Requirements

### Requirement: No plugin-assisted worktrees
The project SHALL NOT support `opencode-worktree` plugin sessions: no `.opencode/worktree.jsonc`, no central-store worktrees, no auto snapshot commits.

#### Scenario: Plugin config is absent
- **WHEN** a developer inspects the repo
- **THEN** `.opencode/worktree.jsonc` does not exist and no `postCreate`/`preDelete` hook copies env, dependencies, or openspec state

#### Scenario: Agent uses manual siblings
- **WHEN** an agent needs a branch checkout
- **THEN** it creates a `../enredarte-<branch>` sibling with `git worktree add` in the same session instead of invoking `worktree_create` / `worktree_delete`
