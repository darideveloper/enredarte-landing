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
| Dev server won't start | Ensure no other process is on the assigned port; `portless stop enredarte-landing` then retry |

## Git worktrees

One checkout per branch, all runnable at once. `pnpm run dev` uses `portless run`, so each checkout gets its own URL automatically: main → `https://enredarte-landing.localhost`, a worktree on branch `<branch>` → `https://<branch>.enredarte-landing.localhost`.

Enforced layout — sibling directories, never nested inside the main checkout:

```bash
/mnt/hd/develop/astro/
  enredarte-landing/          # main checkout
  enredarte-mehedi/           # worktree (branch mehedi)
  enredarte-dari/             # worktree (branch dari)
```

Lifecycle:

```bash
git fetch origin
git worktree add ../enredarte-mehedi mehedi                  # existing branch
git worktree add ../enredarte-feature -b feature/xyz main    # new branch
git worktree list
# ... after merge:
git worktree remove ../enredarte-mehedi
git worktree prune
```

Bootstrap each new worktree (gitignored paths are per-checkout — `node_modules/`, `.env`, `.astro/`, `dist/` don't transfer):

```bash
cd ../enredarte-mehedi
cp ../enredarte-landing/.env .env
pnpm install
pnpm run dev   # → https://mehedi.enredarte-landing.localhost
```

Gotchas:

- `.env` keys per worktree: `SITE_URL`, `API_BASE_URL`, `API_TOKEN`. Keep `API_BASE_URL=https://enredarte-dashboard.localhost` (shared backend) unless testing against another backend.
- `SITE_URL` still points at main's URL in a fresh copy — override it per worktree if canonicals/redirects matter there. Planned follow-up: fall back to `PORTLESS_URL` automatically.
- Dotfolders (`.vscode/`, `.opencode/`, …) are gitignored via `.*/` and don't transfer — reconfigure per worktree if needed.
- New worktrees start from committed `HEAD` only — commit or stash uncommitted changes first, or they won't be there.
- Branch names with `/` get sanitized in the subdomain — check `portless list` for the exact URL after first run.

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
