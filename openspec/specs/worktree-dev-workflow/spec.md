# worktree-dev-workflow Specification

## Purpose
Defines how any branch checkout of this repo (main checkout or git worktree) gets a collision-free portless dev URL, how worktrees are bootstrapped from gitignored state, and the supported worktree lifecycle.

## Requirements
### Requirement: Auto-derived dev URL per checkout
The dev entrypoint SHALL derive the portless URL automatically instead of hardcoding one app name, so concurrent checkouts do not collide.

#### Scenario: Main checkout keeps stable URL
- **WHEN** a developer runs `pnpm run dev` in the main checkout on `main`
- **THEN** the site is served at `https://enredarte-landing.localhost` (unchanged from today)

#### Scenario: Worktree gets branch-prefixed URL
- **WHEN** a developer runs `pnpm run dev` in a git worktree on branch `mehedi`
- **THEN** the site is served at `https://mehedi.enredarte-landing.localhost` without any manual `--name` flag or file edit in that worktree

#### Scenario: Concurrent dev servers do not collide
- **WHEN** `main` and at least one worktree run `pnpm run dev` simultaneously
- **THEN** each serves on its own URL and `portless list` shows both routes active

### Requirement: Per-worktree bootstrap
Each worktree SHALL be bootstrappable independently using only the repo's documented workflow, given that gitignored paths are not shared between worktrees.

#### Scenario: Fresh worktree boots after documented steps
- **WHEN** a developer creates a worktree with `git worktree add`, then runs the documented bootstrap (`pnpm install` + copy `.env`)
- **THEN** `pnpm run dev` starts successfully and `pnpm build` passes `validate-i18n` and `validate-imports`

#### Scenario: Required env is documented
- **WHEN** a developer reads the worktree workflow docs
- **THEN** they learn which variables each worktree needs (`SITE_URL`, `API_BASE_URL`, `API_TOKEN`), that `API_BASE_URL` stays pointed at the shared dashboard (`https://enredarte-dashboard.localhost`) unless they override it, and that `SITE_URL` still points at main's URL unless overridden per worktree

### Requirement: Worktree lifecycle docs
The repo docs SHALL describe the supported worktree layout, lifecycle commands, and repo-specific gotchas.

#### Scenario: Developer follows docs end to end
- **WHEN** a developer follows the docs to add a worktree for an existing branch, list worktrees, and remove the worktree after merge
- **THEN** all commands succeed with sibling directories (e.g. `../enredarte-mehedi`), no nested worktree inside the main checkout is required, and `git worktree list` / `prune` behave as documented

#### Scenario: Gotchas are visible before first worktree
- **WHEN** a developer reads the gotchas section
- **THEN** they learn that `node_modules/`, `.env`, `.astro/`, `dist/` must be recreated per worktree, that dotfolders (`.*/` gitignore) do not transfer, and that uncommitted changes in one checkout do not appear in a new worktree
