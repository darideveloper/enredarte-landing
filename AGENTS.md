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

```bash
portless stop enredarte-landing
```

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
