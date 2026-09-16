## Development

### Prerequisites

Install portless globally:

```bash
npm install -g portless
```

### Running the dev server

```bash
pnpm run dev
```

Run it in the foreground — never `--background` (it orphans the proxy route). Servers are started manually — agents never autostart them (see `docs/astro-portless.md` § "Running under AI agents").

The site is served at **`https://enredarte-landing.localhost`** with automatic HTTPS.

The portless proxy auto-starts on first run (port 443, falls back to 1355 without sudo).

### How it works

Portless replaces hardcoded port numbers with stable, named `.localhost` URLs. It runs a local HTTPS/2 proxy that routes requests to the Astro dev server on an ephemeral port:

```
Browser ──> https://enredarte-landing.localhost
                   │
          Portless Proxy (port 443 / 1355)
          Local CA + auto-HTTPS
                   │
          Astro Dev Server (ephemeral port, e.g. 4737)
```

Portless injects a `PORT` environment variable into the Astro dev server. The `astro.config.mjs` reads it:

```js
server: {
  port: process.env.PORT ? parseInt(process.env.PORT) : 4321,
}
```

The `.env` file sets `SITE_URL=https://enredarte-landing.localhost` so the app knows its dev URL (used for redirects, canonical links, etc.).

### Stopping

Each checkout stops independently with Ctrl+C in its own terminal — the route unregisters when its dev process exits. (There is no per-route stop command; `portless proxy stop` stops the proxy itself.)

### Checking status

```bash
portless status
```

Lists all running portless apps and their proxy state.

### Troubleshooting

| Issue | Fix |
|---|---|
| `command not found: portless` | Run `npm install -g portless` |
| `.localhost` doesn't resolve (Safari, Firefox) | Run `portless hosts sync` to add entries to `/etc/hosts` |
| Port conflict on 443 | Portless falls back to 1355; check `portless status` |
| Dev server won't start | Ensure no other process is on the assigned port; stop that checkout's server (Ctrl+C) then retry |

## Git worktrees

One checkout per branch, all runnable at once. `pnpm run dev` uses `portless run`, so each checkout gets its own URL automatically: main → `https://enredarte-landing.localhost`, a worktree on branch `<branch>` → `https://<branch>.enredarte-landing.localhost`.

Agent-driven sessions use **manual siblings only, in the same terminal session**. Never use the `worktree_create` / `worktree_delete` plugin tools here (they open a new terminal and nest under the central store). This project ships no `.opencode/worktree.jsonc` (plugin-only config, unused here).

Enforced layout — sibling directories, never nested inside the main checkout:

```bash
/mnt/hd/develop/astro/
  enredarte-landing/          # main checkout
  enredarte-<branch>/         # sibling worktree (e.g. enredarte-mehedi)
```

Lifecycle:

```bash
git status --short --branch   # pre-flight: commit or stash first, else the sibling inherits a stale HEAD
git fetch origin
git worktree add ../enredarte-mehedi mehedi                  # existing branch
git worktree add ../enredarte-feature -b feature/xyz main    # new branch
git worktree list
# ... after merge, stop dev first (Ctrl+C), then:
git worktree remove ../enredarte-mehedi
git worktree prune
```

Bootstrap each new sibling (gitignored paths are per-checkout — `node_modules/`, `.env`, `.astro/`, `dist/` don't transfer):

```bash
cd ../enredarte-mehedi
cp ../enredarte-landing/.env .env   # or: cp .env.example .env on a fresh clone, then fill values
pnpm install
pnpm run dev   # → https://mehedi.enredarte-landing.localhost
```

`.opencode` skills/commands sync (openspec stays in the sibling — markdown only, no plugin runtime):

```bash
mkdir -p ../enredarte-mehedi/.opencode/skills ../enredarte-mehedi/.opencode/commands
cp -rn .opencode/skills/openspec-* ../enredarte-mehedi/.opencode/skills/
cp -rn .opencode/commands/opsx-*.md ../enredarte-mehedi/.opencode/commands/
```

Then start the server manually (`pnpm run dev`, no autostart) and verify with `portless list`. Branch proposals stay isolated — never copy active `openspec/changes/*`; before merge, copy back only `openspec/changes/archive/` (the sole tracked openspec path).

Gotchas:

- Real `pnpm install` per sibling (no `node_modules` symlink).
- `.env` keys per worktree: `SITE_URL`, `API_BASE_URL`, `API_TOKEN`. Keep `API_BASE_URL=https://enredarte-dashboard.localhost` (shared backend) unless testing against another backend. A fresh `.env` copy keeps main's `SITE_URL` — harmless, the `PORTLESS_URL → SITE_URL → prod` chain resolves each checkout's own URL first.
- Openspec: nothing crosses automatically (see bootstrap above).
- New siblings start from committed `HEAD` only — commit or stash uncommitted changes first.
- Branch names with `/` get sanitized in the subdomain — check `portless list` after first run.
- One dev server per checkout; review before deleting; squash on merge.

## Component dependency map

`docs/component-dependencies.md` is a living diagram of pages → components → subcomponents → shared libs.

**Keep it in sync.** Whenever you add, remove, or rename a page or component, or change how components import each other (including `Layout`, `Header`, or `Footer`), update `docs/component-dependencies.md` to match the new dependency structure, and refresh the Notes section (e.g. the orphaned-components list) if relevant.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
