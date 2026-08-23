## Why

The Dockerized build (`docker build`) fails at `pnpm build` because `getStaticPaths` fetches the DRF API at build time and `apiFetch` hard-throws when its server-only env vars are absent. The Dockerfile only forwards `API_BASE_URL` (missing `API_TOKEN`, so passing one still fails), the `.dockerignore` excludes `.env` (no local fallback), and the failure surfaces as a bare `API_BASE_URL is not set` deep in a Vite stack trace — giving deploy operators no clue what to configure. The deploy pipeline is unusable.

## What Changes

- Add the missing `API_TOKEN` ARG/ENV pair to the `Dockerfile` so **both** server-only build-time vars can be passed via `--build-arg` (the docs already document the pattern; the Dockerfile only implemented it for `API_BASE_URL`).
- Add a fast, explicit build-time configuration check that runs before `pnpm build` in the Docker build stage and fails with an actionable message naming exactly which required vars are missing and how to pass them.
- Reword the env validation in `src/lib/api/client.ts` so `apiFetch` reports which variable is missing (`API_BASE_URL` and/or `API_TOKEN`) with a clear hint, instead of a bare `Error("API_BASE_URL is not set")` that the error log surfaces with no remediation guidance.
- Update `docs/astro-docker-deployment.md` so the Dockerfile block, build command, CI example, and Coolify instructions treat **both** `API_BASE_URL` and `API_TOKEN` as required build-time args (no commented-out placeholders).
- Keep the intended fail-fast contract from the API integration change: the build still fails if the backend env is misconfigured — but now with a clear message. **No** silent fallback to empty data or fixtures (an empty `getStaticPaths` would still crash `toHeroView` and would mask real configuration problems).

## Capabilities

### New Capabilities
- `docker-build-env`: The Dockerfile build stage forwards every server-only build-time env var the app needs (`API_BASE_URL`, `API_TOKEN`) via `ARG`/`ENV` pairs, and validates them up front so a missing var fails the build with an actionable message before any page generation runs.

### Modified Capabilities
- `api-client`: The fetch client's env validation reports the exact missing variable(s) and names the required configuration source (build-time env / `--build-arg`), instead of a generic error.

## Impact

- **Dockerfile**: add `ARG API_TOKEN` / `ENV API_TOKEN=$API_TOKEN` and a pre-build env validation step (e.g. `node -e` check) before `pnpm build`.
- **`src/lib/api/client.ts`**: replace the two bare `throw new Error(...)` env guards with one validator that lists every missing var.
- **Docs**: `docs/astro-docker-deployment.md` (Dockerfile block, build command, Coolify steps, CI workflow) updated to require both build args; `docs/astro-fetch-wrapper.md` env note aligned.
- **Deployment requirement (outside repo)**: the deploy platform must supply `API_BASE_URL` and `API_TOKEN` as **build-time** variables; the change documents this but cannot set platform config from the repo.
- **No runtime/client-bundle change**: env vars stay server-only (`process.env`/`import.meta.env` at build, never `PUBLIC_*`).