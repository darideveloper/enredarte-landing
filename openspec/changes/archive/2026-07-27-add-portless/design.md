## Context

Currently the dev workflow runs `astro dev` which serves on `http://localhost:4321` with no HTTPS. The `AGENTS.md` documents an `astro dev --background` approach for managing the dev server. The `astro.config.mjs` has no server port configuration.

Portless is already installed globally (`~/.nvm/versions/node/v22.14.0/bin/portless`, v0.10.3) and used in sibling projects (e.g., kendallacrepairs). It runs a local HTTPS proxy (default port 443, falls back to 1355 without sudo) that routes named `.localhost` subdomains to ephemeral dev server ports.

## Goals / Non-Goals

**Goals:**
- Serve the dev server at `https://enredarte-landing.localhost`
- Replace `astro dev` with `portless enredarte-landing pnpm astro dev`
- Make `astro.config.mjs` read `process.env.PORT` (injected by portless)
- Create `.env` with `SITE_URL` pointing to portless URL
- Update `AGENTS.md` dev instructions for portless workflow

**Non-Goals:**
- Production deployment changes
- CI/CD pipeline changes
- Adding portless to `package.json` dependencies (remains global)
- Changing build, preview, or other scripts

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Portless install | Global only (`npm install -g portless`) | Matches kendallacrepairs pattern; portless is a dev tool, not a project dependency |
| Port config | `server.port: process.env.PORT ? parseInt(...) : 4321` | Portless injects `PORT` env var; fallback preserves existing behavior without portless |
| `strictPort` | `true` in `vite.server` | Fail fast if port is taken; portless manages port allocation |
| `.env` URL | `https://enredarte-landing.localhost` | Matches the name passed to `portless enredarte-landing ...`; the app reads `SITE_URL` for form redirects and canonical links |
| AGENTS.md update | Replace `astro dev --background` with portless equivalents | Portless wraps the astro dev server as a child process; `astro dev --background` no longer applies |

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Developer forgets to `npm install -g portless` | Add note in AGENTS.md; `npm run dev` fails with a clear `command not found` error |
| Portless proxy not running | Portless auto-starts the proxy when running the app command |
| `.localhost` DNS resolution in non-Chrome browsers | Portless can sync entries to `/etc/hosts` via `portless hosts sync`; document in AGENTS.md |
| Portless version differences | Pin minimum version in AGENTS.md if compatibility issues arise |
