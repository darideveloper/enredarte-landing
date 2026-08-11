## Why

The docs in `docs/` are meant to be portable: they are reused in any fresh project to replicate these same features. A detailed review found internal integrity issues — duplicated config/code owned by two docs, contradictory statements, stale version numbers, inconsistent frontmatter, project-specific notes leaking into reusable content, and a summary that miscounts its own steps. These weaken trust in the docs and force future maintainers to edit the same content in multiple places.

## What Changes

- `docs/astro-pwa.md` — remove the duplicated nginx caching block and point at `docs/astro-docker-deployment.md` as the single source of truth for SW/manifest/`/_astro/` cache headers.
- `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` — replace the full GSAP+View-Transitions code with a cross-reference to `docs/astro-client-side-page-transitions.md` §5.4 (canonical owner); change `astro@^7` to `astro@^5 || ^6`; add approach C (hybrid) to the reveal-strategy section and mark the §3 template as approach C.
- `docs/astro-client-side-page-transitions.md` — fix §9 summary "three things" → "four things".
- `docs/astro-portless.md` — remove the redundant `vite.server.port` block, keep only `server.port`.
- `docs/astro-i18n.md` — add "scales to 3+ languages" note; change `npm run validate-i18n` to `pnpm run`; add explicit `pnpm add -D tsx` step in the validation section; add cross-ref to the Client Router doc.
- `docs/astro-seo.md`, `docs/astro-client-side-page-transitions.md`, `docs/gsap-scrolltrigger/*.md` — add YAML frontmatter (`created`, `updated`, `tags`, `type`, `status`) to match the other docs.
- Project-specific notes (`docs/astro-fetch-wrapper.md`, `docs/astro-atomic-components.md`, `docs/gsap-scrolltrigger/README.md`, `docs/gsap-scrolltrigger/02-loader-and-entrance-orchestration.md`) — wrap in a consistent `🏠 Local note (enredarte-landing)` callout so readers know it is non-portable context.
- `docs/astro-docker-deployment.md`, `docs/astro-react-islands.md`, `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` — replace pinned versions with generic placeholders (e.g. `node:lts-alpine`, `pnpm@<latest>`).
- `docs/gsap-scrolltrigger/03-section-reveal-pattern.md` + `04-scroll-effects-marquee-and-counters.md` — add a stronger disclaimer that the helper code is convenience-only, not the reference implementation.
- `docs/astro-pwa.md` — unify theme color: `#dd4d57` → `#fe676e`.

## Capabilities

### New Capabilities
- `docs-consistency`: Defines the portability and integrity rules for the reusable `docs/` set — single source of truth per topic, cross-doc references instead of duplicated content, non-portable project notes marked with a consistent callout, version-agnostic placeholders, and uniform YAML frontmatter.

### Modified Capabilities
<!-- None: the existing specs in openspec/specs/ describe the codebase, not the docs. -->

## Impact

- `docs/astro-pwa.md`, `docs/astro-docker-deployment.md`, `docs/astro-client-side-page-transitions.md`, `docs/astro-portless.md`, `docs/astro-i18n.md`, `docs/astro-seo.md`, `docs/astro-react-islands.md`, `docs/astro-atomic-components.md`, `docs/astro-fetch-wrapper.md`, `docs/gsap-scrolltrigger/README.md`, `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md`, `docs/gsap-scrolltrigger/02-loader-and-entrance-orchestration.md`, `docs/gsap-scrolltrigger/03-section-reveal-pattern.md`, `docs/gsap-scrolltrigger/04-scroll-effects-marquee-and-counters.md`.
- No code, dependency, store, or data changes. `docs/component-dependencies.md` intentionally unchanged (project-specific by design).
