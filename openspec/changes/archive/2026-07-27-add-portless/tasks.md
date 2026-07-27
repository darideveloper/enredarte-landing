## 1. Package.json

- [x] 1.1 Change `dev` script from `"astro dev"` to `"portless enredarte-landing pnpm astro dev"`

## 2. Astro Config

- [x] 2.1 Add `server.port` reading `process.env.PORT` with fallback to 4321
- [x] 2.2 Add `vite.server.port` reading `process.env.PORT` with fallback to 4321
- [x] 2.3 Add `vite.server.strictPort: true`

## 3. Environment

- [x] 3.1 Create `.env` with `SITE_URL=https://enredarte-landing.localhost`

## 4. Documentation

- [x] 4.1 Update `AGENTS.md` to document portless dev workflow (setup, start, stop, status)
