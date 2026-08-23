## 1. Dockerfile

- [x] 1.1 Add `ARG API_TOKEN` / `ENV API_TOKEN=$API_TOKEN` next to the existing `API_BASE_URL` pair in the build stage
- [x] 1.2 Add a pre-build env validation step (`RUN node -e ...`) before `RUN pnpm build` that fails with an actionable message listing any missing required var (`API_BASE_URL`, `API_TOKEN`)

## 2. Fetch client

- [x] 2.1 Replace the two bare `throw new Error(...)` guards in `src/lib/api/client.ts` with a single validator that lists every missing var (`API_BASE_URL`, `API_TOKEN`) and instructs to pass them via `--build-arg <NAME>=<value>`

## 3. Documentation

- [x] 3.1 Update `docs/astro-docker-deployment.md`: uncomment the `API_TOKEN` ARG/ENV pair in the Dockerfile block, add it to the build/run command and CI example, and state both vars must be set as Coolify **Build Time** variables
- [x] 3.2 Align `docs/astro-fetch-wrapper.md` env note if it lists only `API_BASE_URL`

## 4. Verification

- [x] 4.1 Build locally with both args and confirm the image builds and serves: `docker build --build-arg API_BASE_URL=<url> --build-arg API_TOKEN=<token> -t enredarte-landing . && docker run -p 8080:80 enredarte-landing`
- [x] 4.2 Confirm the negative case: omitting `--build-arg API_TOKEN` fails the Docker build with the new actionable message naming `API_TOKEN` (no `getStaticPaths` stack trace)
- [x] 4.3 Confirm `pnpm build` locally (with `.env` present) still succeeds and routes are generated