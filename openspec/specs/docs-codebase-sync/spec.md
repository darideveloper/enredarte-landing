## Purpose

Defines the alignment rules between the reusable `docs/` set and the actual codebase: inaccurate content must be removed, config templates must match deployed reality, undocumented build steps must be documented, and documented conventions must be enforced in code.

## Requirements

### Requirement: PWA documentation removed
The project SHALL NOT contain PWA documentation when PWA is not implemented. All references to PWA across the docs set SHALL be removed.

#### Scenario: PWA doc file deleted
- **WHEN** the docs directory is inspected
- **THEN** `docs/astro-pwa.md` does not exist

#### Scenario: PWA removed from docs hub
- **WHEN** reading `docs/astro.md`
- **THEN** the optional section does not list `[[astro-pwa|PWA Out of the Box]]`

#### Scenario: PWA references removed from nginx template
- **WHEN** the nginx template in `docs/astro-docker-deployment.md` is read
- **THEN** it does not reference `offline/index.html`, `sw.js`, `workbox-*.js`, or `manifest.webmanifest` as mandatory configuration
- **AND** any PWA-specific blocks are explicitly annotated as optional and removable

### Requirement: Nginx config is a single reusable template
The nginx configuration in `docs/astro-docker-deployment.md` SHALL be a single complete config block that works for both PWA and non-PWA projects. PWA-only sections SHALL be explicitly marked with removal instructions. The actual project `nginx.conf` SHALL match the template with PWA sections removed.

#### Scenario: Template includes all security headers
- **WHEN** the nginx template is read
- **THEN** it includes `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, and `Referrer-Policy` headers

#### Scenario: Template includes extended gzip types
- **WHEN** the nginx template is read
- **THEN** `gzip_types` includes `application/rss+xml`, `application/atom+xml`, and `application/manifest+json`

#### Scenario: Template includes static assets cache block
- **WHEN** the nginx template is read
- **THEN** it includes a location block caching `ico`, `gif`, `jpe?g`, `png`, `woff2?`, `svg`, `webp` files with immutable cache

#### Scenario: PWA blocks are annotated
- **WHEN** a PWA-specific location block appears in the template
- **THEN** it is preceded by a comment marking it as PWA-only with removal instructions (e.g., `## PWA: remove this block if not using PWA`)

#### Scenario: Actual nginx config matches no-PWA template
- **WHEN** comparing actual `nginx.conf` to the doc template
- **THEN** `nginx.conf` contains all non-PWA blocks from the template and no PWA-only blocks

### Requirement: Legacy English-prefix redirects configured
The Astro config SHALL generate redirects from `/en/<path>` to `/<path>` for every route defined in `src/lib/i18n/routes.ts`. Redirects SHALL be generated at build time from the `routes` object so new routes get redirects automatically.

#### Scenario: Home route redirect exists
- **WHEN** the site is built
- **THEN** `/en` redirects to `/`

#### Scenario: Redirects are route-driven
- **WHEN** a new route is added to `src/lib/i18n/routes.ts`
- **THEN** its `/en/` legacy redirect is generated automatically without config changes

### Requirement: env.d.ts type declarations match documentation
The `docs/astro-site-config.md` §3 example SHALL show only types that are actually valid for `ImportMetaEnv`. `SITE_URL` (server-only, accessed via `process.env`) SHALL NOT appear in `ImportMetaEnv`. `PUBLIC_ANALYTICS_ID` SHALL be marked as optional.

#### Scenario: SITE_URL removed from ImportMetaEnv example
- **WHEN** the env.d.ts example in the docs is read
- **THEN** it does not include `SITE_URL` in the `ImportMetaEnv` interface

#### Scenario: PUBLIC_ANALYTICS_ID marked optional
- **WHEN** the env.d.ts example in the docs is read
- **THEN** `PUBLIC_ANALYTICS_ID` appears with a comment indicating it is optional

### Requirement: validate-imports script documented
The `scripts/validate-imports.ts` script SHALL be documented in `docs/astro-i18n.md` §9 as part of the build pipeline. The documentation SHALL describe what it validates (cross-directory relative imports, `@/` alias enforcement) and show it in the build command.

#### Scenario: Build command includes validate-imports
- **WHEN** the build pipeline section of the i18n doc is read
- **THEN** the `build` script shown includes `pnpm validate-imports`

#### Scenario: validate-imports purpose documented
- **WHEN** the build pipeline section is read
- **THEN** it describes that `validate-imports` enforces `@/` path aliases and bans `../` cross-directory imports

### Requirement: Missing data files annotated in site-config doc
The architecture diagram in `docs/astro-site-config.md` §0 SHALL annotate data files that are shown as examples but do not exist in the current project with a clear indicator that they are optional patterns.

#### Scenario: Example-only files marked
- **WHEN** the architecture diagram lists `prices.ts`, `vehicle-features.ts`, or `faq.ts`
- **THEN** each is suffixed with `(example)` to indicate it is a reusable pattern, not a current project file

### Requirement: Semicolons removed from all source files
All `.tsx`, `.ts` (non-i18n), and `.astro` source files SHALL use the no-semicolons convention documented in `docs/astro-react-islands.md`. The "No semicolons" rule in §7 SHALL be updated to reflect that the codebase enforces this convention.

#### Scenario: React components have no semicolons
- **WHEN** any `.tsx` file in `src/components/` is read
- **THEN** it contains no semicolons at statement ends

#### Scenario: Lib files have no semicolons
- **WHEN** `src/lib/gsap.ts` is read
- **THEN** it contains no semicolons at statement ends

#### Scenario: Astro frontmatter has no semicolons
- **WHEN** any `.astro` file in `src/components/` is read
- **THEN** its frontmatter block contains no semicolons at statement ends

#### Scenario: Astro script blocks have no semicolons
- **WHEN** any `<script>` block in a `.astro` file is read
- **THEN** it contains no semicolons at statement ends

### Requirement: React Islands doc versions updated
The dependency versions in `docs/astro-react-islands.md` §1 SHALL match the actual versions in `package.json` for the current project. Where versions differ between doc and reality, the doc SHALL be updated.

#### Scenario: @astrojs/react version correct
- **WHEN** the React Islands doc dependency section is read
- **THEN** `@astrojs/react` version matches the installed version in `package.json`

### Requirement: Layout uses semantic main wrapper
The site layout (`Layout.astro`) SHALL wrap page content in a `<main>` element to match the semantic structure documented in `docs/astro-client-side-page-transitions.md` §3.2 and to improve accessibility.

#### Scenario: Slot wrapped in main
- **WHEN** `Layout.astro` is rendered
- **THEN** the `<slot />` is wrapped in `<main>...</main>`

### Requirement: All source imports use the @/ alias
All project imports in `src/**/*.{astro,ts,tsx}` SHALL use the `@/` alias. Single-dot (`./`) and parent (`../`) relative project imports SHALL NOT be used. The Astro config file is the sole documented exception: it is loaded directly by Node (not through Vite aliases), so it imports `routes` via a relative path.

#### Scenario: No relative project imports in src
- **WHEN** `scripts/validate-imports.ts` scans `src/**/*.{astro,ts,tsx}`
- **THEN** no `./` or `../` relative project imports are found and the validation passes

#### Scenario: Config-file exception is documented
- **WHEN** `astro.config.mjs` is read
- **THEN** it imports `routes` from `./src/lib/i18n/routes.ts` with a comment explaining that the `@/` alias does not resolve in the Astro config file
