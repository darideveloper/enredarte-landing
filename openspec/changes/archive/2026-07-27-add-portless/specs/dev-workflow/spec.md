## ADDED Requirements

### Requirement: Dev server starts via portless
The system SHALL start the Astro dev server wrapped through the portless CLI, making it accessible at a named `.localhost` URL.

#### Scenario: Start dev server with portless
- **WHEN** developer runs `pnpm run dev`
- **THEN** the Astro dev server starts as a child process of portless
- **AND** the site is accessible at `https://enredarte-landing.localhost`

#### Scenario: Portless proxy auto-starts
- **WHEN** portless proxy is not already running
- **THEN** portless starts the proxy automatically before launching the dev server

### Requirement: Astro config reads PORT env var
The Astro dev server SHALL listen on the port specified by the `PORT` environment variable when running under portless, falling back to port 4321 otherwise.

#### Scenario: Portless sets PORT
- **WHEN** portless starts the dev server
- **THEN** it sets the `PORT` environment variable in the child process
- **AND** the Astro server reads `process.env.PORT` to determine the listen port

#### Scenario: Running without portless
- **WHEN** developer runs `astro dev` directly without portless
- **THEN** the Astro server falls back to port 4321

### Requirement: Dev URL available as SITE_URL
The `.env` file SHALL define `SITE_URL` set to `https://enredarte-landing.localhost` for use by the Astro app during development.

#### Scenario: Env var available in Astro
- **WHEN** the dev server runs under portless
- **THEN** `import.meta.env.SITE_URL` resolves to `https://enredarte-landing.localhost`

### Requirement: Dev instructions updated in AGENTS.md
The `AGENTS.md` file SHALL document the portless-based development workflow, including setup, start, stop, and status commands.

#### Scenario: Developer reads AGENTS.md
- **WHEN** a new developer reads AGENTS.md
- **THEN** they see the portless dev workflow instructions
- **AND** they are instructed to install portless globally if not present
