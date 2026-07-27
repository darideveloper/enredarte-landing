## ADDED Requirements

### Requirement: Multi-stage Docker build
The project SHALL have a `Dockerfile` with at least two stages:
- **build**: Uses `node:22-alpine` with corepack/pnpm to install deps and run `pnpm build`
- **serve**: Uses `nginx:alpine` to serve the built static files from `/usr/share/nginx/html`

Build-time environment variables (PUBLIC_*) SHALL be passed as Docker build args.

#### Scenario: Docker build succeeds
- **WHEN** `docker build -t enredarte-landing .` is run
- **THEN** the build SHALL complete with exit code 0 and produce a runnable image

#### Scenario: Build args are available at build time
- **WHEN** `--build-arg PUBLIC_API_BASE_URL=https://api.example.com` is passed
- **THEN** the value SHALL be available as `import.meta.env.PUBLIC_API_BASE_URL` during `pnpm build`

### Requirement: Nginx configuration
The project SHALL include an `nginx.conf` with:
- Gzip compression for text-based assets
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Immutable caching for content-hashed `/_astro/` assets (1 year)
- No-cache for HTML pages
- Custom 404 error page

#### Scenario: HTML pages have no-cache header
- **WHEN** an HTML page is served
- **THEN** the response SHALL include `Cache-Control: no-cache`

#### Scenario: Content-hashed assets have immutable cache
- **WHEN** a file under `/_astro/` is served
- **THEN** the response SHALL include `Cache-Control: public, max-age=31536000, immutable`

### Requirement: .dockerignore
The project SHALL include a `.dockerignore` that excludes `node_modules/`, `dist/`, `.git/`, `.env*`, `*.md`, and `.gitignore` from the Docker build context.

#### Scenario: .dockerignore reduces build context
- **WHEN** `docker build` runs
- **THEN** `node_modules/` SHALL NOT be copied to the build stage

### Requirement: pnpm lockfile
The project SHALL use `pnpm install --frozen-lockfile` in the Docker build to ensure reproducible installs.

#### Scenario: Lockfile mismatch fails build
- **WHEN** `pnpm-lock.yaml` is out of sync with `package.json`
- **THEN** `pnpm install --frozen-lockfile` SHALL fail
