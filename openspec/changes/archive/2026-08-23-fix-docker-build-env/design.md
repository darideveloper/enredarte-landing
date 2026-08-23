## Context

The landing site is a static Astro app whose `getStaticPaths` (`src/pages/[...path].astro`) calls `buildSiteData()` (`src/data/api.ts`), which fans out to `fetchAll` over 10 DRF endpoint modules, all routed through `apiFetch` (`src/lib/api/client.ts`). `apiFetch` reads `import.meta.env.API_BASE_URL` and `import.meta.env.API_TOKEN` and throws `Error("API_BASE_URL is not set")` when the var is absent. The site is deployed as a multi-stage Docker build (`Dockerfile`): a `node:22-alpine` stage runs `pnpm build`, and `nginx:alpine` serves `dist/`. The deploy failed at `pnpm build` because the build environment lacked `API_BASE_URL` (and `API_TOKEN` is not even forwarded by the Dockerfile). `.dockerignore` excludes `.env`/`.env.*`, so there is no local fallback inside the container.

The intended contract (from the archived `integrate-backend-api` change) is fail-fast: the backend must be reachable and configured at build time; no silent fallback to fixtures. This change preserves that contract while making the failure clear and making it possible to actually configure both vars.

## Goals / Non-Goals

**Goals:**
- Make `docker build` accept and forward both server-only build-time vars (`API_BASE_URL`, `API_TOKEN`).
- Fail before any page generation when a required var is missing, with a message naming the missing variable(s) and how to supply them.
- Keep the fail-fast, no-silent-fallback contract (a misconfigured build is a hard error, never an empty site).
- Align the deployment docs so operators configure both build args.

**Non-Goals:**
- No runtime/client-side fetching; env vars remain server-only, never `PUBLIC_*`.
- No BFF/proxy route, no cache of API responses, no fallback to fixtures or empty data.
- No change to `getStaticPaths` route generation logic itself — it still requires real API data.
- No change to the deploy platform's configuration (documented, not automatable from the repo).

## Decisions

### 1. Forward both env vars in the Dockerfile
Add the missing pair to the build stage:
```dockerfile
ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL
ARG API_TOKEN
ENV API_TOKEN=$API_TOKEN
```
This mirrors the pattern already documented in `docs/astro-docker-deployment.md` and used for `API_BASE_URL`. Rationale: `apiFetch` requires both vars; forwarding only one guarantees the next build fails on the other. Alternative considered: hardcoding defaults — rejected, would leak a token into the image and a wrong base URL into every page.

### 2. Validate env before building
Add a small pre-build check in the Dockerfile build stage, before `RUN pnpm build`:
```dockerfile
RUN node -e 'const req=["API_BASE_URL","API_TOKEN"];const m=req.filter(v=>!process.env[v]);if(m.length){console.error("Missing build-time env var(s): "+m.join(", ")+"\nPass them with: --build-arg <NAME>=<value>");process.exit(1)}'
```
Rationale: the failure surfaces as a single, actionable message at the start of the stage instead of a bare `Error("API_BASE_URL is not set")` buried in a Vite stack trace from `getStaticPaths`. Alternative considered: relying solely on the improved `apiFetch` error — still worthwhile (see Decision 3), but a pre-build check fails earlier and names all missing vars at once; both are cheap, so keep both.

### 3. Improve `apiFetch` env validation
In `src/lib/api/client.ts`, replace the two bare throws with a single validator:
```ts
const missing = ["API_BASE_URL", "API_TOKEN"].filter((name) => !import.meta.env[name])
if (missing.length) {
  throw new Error(
    `Missing build-time env var(s): ${missing.join(", ")}\n` +
    `Supply them as Docker build args: --build-arg <NAME>=<value>`,
  )
}
```
Rationale: even outside the container (e.g. `pnpm build` locally without `.env`), the error names the exact gap. Alternative: a custom `ConfigError` class — unnecessary; `Error` with an actionable message is enough and matches existing style (no new abstraction).

### 4. Update deployment docs
Edit `docs/astro-docker-deployment.md`: uncomment the `API_TOKEN` ARG/ENV pair in the Dockerfile block, require both `--build-arg` flags in the build/run and CI examples, and change the Coolify section to say both vars must be added as **Build Time** variables. Align the env note in `docs/astro-fetch-wrapper.md` if it lists only `API_BASE_URL`.

## Risks / Trade-offs

- **[Operator still must configure the platform]** → Mitigation: docs make both vars explicit and required; the fail-fast check tells them exactly what is missing. The repo cannot set Coolify/CI variables.
- **[`.dockerignore` excludes `.env`]** → Intended and preserved: secrets must come from build args, not a committed/ignored file. Docs already state this; no change needed.
- **[Fail-fast could block deploys again if config is stale]** → Mitigation: this is the designed contract (no silent fallback); the clear error makes the fix one build-arg away.
- **[Check script adds a Docker build step]** → Negligible cost (node one-liner, no dependency changes).

## Migration Plan

1. Edit `Dockerfile`: add `ARG API_TOKEN`/`ENV API_TOKEN` and the pre-build env check.
2. Edit `src/lib/api/client.ts`: consolidate env validation into one actionable error.
3. Update `docs/astro-docker-deployment.md` and `docs/astro-fetch-wrapper.md`.
4. Verify locally:
   ```bash
   docker build --build-arg API_BASE_URL=<url> --build-arg API_TOKEN=<token> -t enredarte-landing .
   docker run -p 8080:80 enredarte-landing
   ```
   Also verify the negative case (omit `--build-arg API_TOKEN`) fails with the new message.
5. Redeploy; the platform must supply both vars as build-time env.

## Open Questions

- None blocking. The only external dependency is the operator configuring both build args on the deploy platform (Coolify: Build Time vars; CI: `secrets.API_URL`/`secrets.API_TOKEN`), which this change documents.