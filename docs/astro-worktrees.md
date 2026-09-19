---
created: 2026-09-09
updated: 2026-09-16
tags:
  - astro
  - git
  - worktrees
  - portless
  - documentation
type: resource
status: active
---

# Git Worktrees + Portless

One checkout per branch, all runnable at once. Each checkout gets its own stable `.localhost` URL automatically — no port juggling, no stash/checkout cycles when switching branches.

This project uses **manual siblings only, in the same terminal session** (same model as vetoxzyn). Never use the `worktree_create` / `worktree_delete` plugin tools here.

## Why

Parallel branches (features, per-teammate branches, release lines) share a single checkout by default, forcing `stash` + `checkout` cycles and allowing only one dev server at a time. Git worktrees give every branch its own directory sharing one `.git`, and `portless run` gives every directory its own URL. Combined: `main` and any number of branches run side by side.

## Prerequisites

- git, Node ≥22, pnpm
- Portless installed globally:

```bash
npm install -g portless
```

### Portless integration checklist (per project)

Worktrees only get collision-free URLs if the project derives its dev URL instead of hardcoding it:

1. The `dev` script must use `portless run` — never a hardcoded app name (a hardcoded name makes every checkout fight over one URL):

```json
{
  "scripts": {
    "dev": "portless run pnpm astro dev"
  }
}
```

> Behind a MITM corporate proxy, prefix with `NODE_OPTIONS=--use-openssl-ca`.

2. `astro.config.mjs` must accept the injected `PORT`, falling back when running outside portless, and derive `site` from the injected URL:

```js
export default defineConfig({
  site: process.env.PORTLESS_URL ?? process.env.SITE_URL ?? "https://enredarte.mx",
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4321,
    strictPort: true,
  },
  vite: {
    server: {
      port: process.env.PORT ? parseInt(process.env.PORT) : 4321,
      strictPort: true,
    },
  },
})
```

Resolution chain: `PORTLESS_URL → SITE_URL → prod-domain fallback` (`https://enredarte.mx` — dev never reaches it since Portless always injects `PORTLESS_URL`; a build without env must emit prod, never localhost, into sitemap/canonicals).

3. `.env` carries the dev URL plus the backend contract (used for redirects, canonical links, API calls):

```bash
SITE_URL=https://enredarte-landing.localhost
PUBLIC_API_BASE_URL=https://enredarte-dashboard.localhost
API_TOKEN=<paste-drf-token-here>
```

(`PUBLIC_API_BASE_URL` is the single backend URL — build-time fetch and browser sales calls share it. Keep it on the shared dashboard unless testing another backend. On a fresh clone with no `.env` to copy, start from `.env.example`, which carries the same keys.)

Full portless reference → see [[astro-portless]].

## URL Model

`portless run` derives the base name automatically (in order: `package.json` `name` → git repo root → directory basename). Inside a git worktree it prepends the branch as a subdomain:

```
main checkout:                    https://enredarte-landing.localhost
worktree on branch <branch>:      https://<branch>.enredarte-landing.localhost
```

Portless also injects `PORT`, `HOST`, and `PORTLESS_URL` into each dev server process. `portless list` is the source of truth for which routes are live.

## Layout

Manual siblings in the same terminal session. Never nest a worktree inside the main checkout (it confuses watchers and build output):

```bash
/mnt/hd/develop/astro/
  enredarte-landing/          # main checkout
  enredarte-<branch>/         # sibling worktree (e.g. enredarte-mehedi)
```

> This project does NOT use the `opencode-worktree` plugin. No `worktree_create` / `worktree_delete`, no `.opencode/worktree.jsonc`, no new terminal — manual siblings in the same session only (see `AGENTS.md` § Git worktrees). The removed plugin config remains visible in git history if ever needed for reference.

## Lifecycle

0. Pre-flight in main: `git status --short --branch`. Dirty → commit or stash first, else the worktree inherits a stale `HEAD` (notably the `package.json` dev script and `astro.config.mjs` port/site handling).

```bash
git fetch origin
git worktree add ../enredarte-<branch> <branch>        # existing branch
git worktree add ../enredarte-feature -b feature/xyz main  # new branch
git worktree list
# ... after merge, stop dev first (Ctrl+C), then:
git worktree remove ../enredarte-<branch>
git worktree prune
```

Bootstrap each new sibling — gitignored paths are per-checkout and don't transfer:

```bash
cd ../enredarte-<branch>
cp ../enredarte-landing/.env .env   # or: cp .env.example .env on a fresh clone, then fill values
pnpm install
pnpm run dev   # → https://<branch>.enredarte-landing.localhost
```

`.opencode` skills/commands sync (openspec stays in the sibling — markdown only, no plugin runtime):

```bash
mkdir -p ../enredarte-<branch>/.opencode/skills ../enredarte-<branch>/.opencode/commands
cp -rn .opencode/skills/openspec-* ../enredarte-<branch>/.opencode/skills/
cp -rn .opencode/commands/opsx-*.md ../enredarte-<branch>/.opencode/commands/
```

Then start the server manually (`pnpm run dev`, no autostart) and verify with `portless list`. Branch proposals stay isolated — never copy active `openspec/changes/*`; before merge, copy back only `openspec/changes/archive/` (the sole tracked openspec path).

## What Doesn't Transfer

| Path | Why | Action per sibling |
|---|---|---|
| `node_modules/` | gitignored | `pnpm install` per checkout (no symlink) |
| `.env` | gitignored (secrets) | copy from main checkout, or `.env.example` on a fresh clone |
| `.astro/`, `dist/` | generated | recreated by `dev`/`build` |
| Dotfolders (`.vscode/`, `.opencode/`, …) | gitignored via `.*/` | reconfigure if needed; sync `.opencode/skills/openspec-*` + `commands/opsx-*.md` by hand (see Bootstrap) |
| Uncommitted changes | worktrees start from committed `HEAD` | commit or stash first, or they won't be there |

> A fresh `.env` copy keeps main's `SITE_URL` — with the auto-derive chain above this is harmless (each checkout resolves its own `PORTLESS_URL` first). Override `SITE_URL` per sibling only if canonicals or redirects must differ explicitly.

## Stopping

Each checkout stops independently with Ctrl+C in its own terminal — the route unregisters when its dev process exits. Consequences worth knowing:

- There is **no per-route stop command**. `portless stop <name>` does not stop anything: portless parses `stop` as an app name and registers a bogus `stop.localhost` route instead. `portless proxy stop` stops the proxy itself.
- Routes live only while the parent `portless run` process lives. A backgrounded/nohup'd server whose parent died leaves an orphaned child and an unregistered route (proxy 404s while the direct port still answers). Keep each server in a persistent terminal or tmux window. Agent-orphaned servers (proxy 404, direct port alive) → see "Running under AI agents" in [[astro-portless]].
- Deleting a worktree does **not** stop its dev server — stop it first (Ctrl+C), then remove.

## Team Rules

- One dev server per checkout. A second `pnpm run dev` on an already-served URL fails with "already registered by PID…" — that means it's already running; open the URL instead of fighting it.
- Review before deleting. Never delete a worktree with unmerged/unreviewed work.
- Squash on merge, so small work-in-progress commits don't pollute history.
- Branch names with `/` get sanitized in the subdomain — check `portless list` for the exact URL after first run.

## Troubleshooting

| Issue | Fix |
|---|---|
| `"…localhost" is already registered by PID …` | That checkout's server is already running — open the URL, or stop that process first. Second cause: sibling built from stale `HEAD` with a hardcoded `portless <name>` script — sync `package.json` + `astro.config.mjs` from main's working tree |
| Proxy 404 but direct `http://127.0.0.1:<port>/` answers | The `portless run` parent died and the route unregistered — restart the dev server in a persistent terminal. Under agent env, see "Running under AI agents" in [[astro-portless]] |
| `.localhost` doesn't resolve (Safari, Firefox) | Run `portless hosts sync` |
| Port conflict on 443 | Portless falls back to 1355; check `portless status` |
| `command not found: portless` | Run `npm install -g portless` |

## Connection to Other Patterns

- Portless setup, commands, and env vars → see [[astro-portless]]
- `SITE_URL` consumption (redirects, canonicals) → see [[astro-site-config]]
- Production serving (Docker/nginx, not portless) → see [[astro-docker-deployment]]
