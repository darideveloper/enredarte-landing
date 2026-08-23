# docker-build-env Specification

## Purpose
Defines how the Docker build stage receives and validates the server-only build-time environment variables (`API_BASE_URL`, `API_TOKEN`) the static site needs during `pnpm build`.

## Requirements
### Requirement: Forward all server-only env vars as build args
The system's Dockerfile SHALL declare an `ARG`/`ENV` pair for every server-only build-time environment variable the app requires (`API_BASE_URL` and `API_TOKEN`), so each can be passed with `--build-arg <NAME>=<value>` during `docker build` and is available to `pnpm build` via `import.meta.env`/`process.env`.

#### Scenario: Both vars forwarded
- **GIVEN** a Docker build invoked with `--build-arg API_BASE_URL=https://api.example.com --build-arg API_TOKEN=abc123`
- **THEN** the build stage exposes `API_BASE_URL=https://api.example.com` and `API_TOKEN=abc123` to the `pnpm build` step

#### Scenario: Token is not forgotten
- **GIVEN** the Dockerfile forwards `API_BASE_URL`
- **THEN** the Dockerfile also forwards `API_TOKEN` (no `ARG`/`ENV` pair for a required server-only var is left commented out)

### Requirement: Validate required env vars before building
The build stage SHALL check, before running `pnpm build`, that every required server-only env var is set. If any is missing, the build SHALL fail with an actionable message that lists the missing variable(s) and instructs how to supply them (`--build-arg <NAME>=<value>` or build-time environment variables).

#### Scenario: Missing variable fails fast with guidance
- **GIVEN** a Docker build where `API_TOKEN` is not passed
- **WHEN** the build stage validation runs
- **THEN** the build fails before page generation with a message naming `API_TOKEN` and telling the operator to pass it as a build arg

#### Scenario: All variables present builds
- **GIVEN** a Docker build where both `API_BASE_URL` and `API_TOKEN` are passed
- **WHEN** the build stage validation runs
- **THEN** validation passes and `pnpm build` proceeds

### Requirement: Fail loudly, never degrade silently
When a required server-only env var is missing, the build SHALL fail (per the validation requirement) and SHALL NOT silently fall back to empty data or fixtures. A missing env var is a configuration error that must surface.

#### Scenario: No silent fallback
- **GIVEN** a build where `API_BASE_URL` is unset
- **THEN** the build fails with a clear error and does not generate a site from empty API data