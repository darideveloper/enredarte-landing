## Why

Replace hardcoded `localhost:4321` with a stable, named HTTPS URL for local development — eliminating port conflicts, cookie/storage clashes between projects, and the need to remember port numbers. Enables production-like HTTPS during development.

## What Changes

- Change dev script from `astro dev` to `portless enredarte-landing pnpm astro dev`
- Add `server.port` and `vite.server.port` to `astro.config.mjs` reading `process.env.PORT` with fallback
- Create `.env` with `SITE_URL=https://enredarte-landing.localhost`
- Update `AGENTS.md` dev instructions to reflect portless workflow
- Portless is expected to be installed globally (`npm install -g portless`) — not added to `package.json` dependencies

## Capabilities

### New Capabilities
- `dev-workflow`: Portless-based local development workflow — single command to start a named, HTTPS dev server at `https://enredarte-landing.localhost`

### Modified Capabilities

*None*

## Impact

- `package.json` — `dev` script changes from `astro dev` to `portless enredarte-landing pnpm astro dev`
- `astro.config.mjs` — add `server.port` and `vite.server.port` reading `process.env.PORT` (portless injects this env var)
- `.env` — new file with `SITE_URL` set to the portless URL
- `AGENTS.md` — update dev instructions to cover portless workflow (start, stop, status)
- Developers must have `portless` installed globally (`npm install -g portless`)
