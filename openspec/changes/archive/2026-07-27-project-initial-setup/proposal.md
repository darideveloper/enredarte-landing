## Why

The `enredarte-landing` project is a bare Astro v7 scaffold with no integrations, styling, internationalization, SEO, or deployment infra. Without the established convention stack, every feature would be built ad-hoc with inconsistent patterns. This change applies the project's documented mandatory patterns (React islands, Tailwind v4, atomic components, Zustand+Zod, site config, SEO, fetch wrapper, Docker) plus the optional i18n system to create a production-ready foundation for a bilingual art landing page.

## What Changes

- Install and configure React + Tailwind v4 + React islands via `@astrojs/react` and `@tailwindcss/vite`
- Configure path aliases (`@/*`), tsconfig for React JSX, and env type declarations
- Set up Tailwind v4 with `@theme` tokens and `tw-animate-css`
- Implement the i18n system (custom catch-all routing, JSON translation files, build-time validation)
- Implement the SEO component hierarchy (BaseSEO + PageSEO, sitemap, dynamic robots.txt)
- Create centralized site config (`src/data/site-config.ts`) and constants (`src/consts.ts`)
- Set up Zustand store with Zod validation + `useField` hook pattern
- Create typed fetch wrapper (`safeFetch`) with retry/timeout/error classes
- Create atomic component directory scaffold (atoms/molecules/organisms) with `cn()` utility
- Replace boilerplate pages with catch-all i18n router and Home page component
- Add sample page components (Services, About) with full routes and bilingual translations
- Add sample atomic components (Button, Input, ValidatedInput), molecules (LanguageSwitcher, GlobalLoader), and organisms (Header, Footer) connected to Layout
- Populate centralized data config (site-config.ts) with sample business identity constants
- Add Docker multi-stage build (node build → nginx serve) with nginx.conf
- Wire i18n build-time validation into the build pipeline
- Configure static site generation (SSG) via Astro's default static output with `getStaticPaths` in the catch-all router

## Capabilities

### New Capabilities
- `react-tailwind`: React 19 + Tailwind CSS v4 integration via Astro islands, with `@tailwindcss/vite` plugin, `@theme` tokens, and React component conventions
- `i18n`: Bilingual routing (en/es) via catch-all `[...path].astro`, JSON translation files in `src/messages/`, route definitions in `src/lib/i18n/routes.ts`, and mandatory build-time validation
- `seo`: Component-based SEO hierarchy (BaseSEO → PageSEO), auto-generated sitemap via `@astrojs/sitemap`, dynamic robots.txt, JSON-LD structured data, canonical/hreflang tags
- `site-config`: Single-source-of-truth data files (`src/data/site-config.ts`, `src/consts.ts`) for all business identity, contact, and SEO metadata
- `state-management`: Zustand store with Zod field validation, `persist` middleware, and `useField` hook for React islands
- `api-client`: Typed fetch wrapper with `FetchError` classes, exponential backoff retry, timeout, and per-endpoint modules
- `atomic-components`: 4-tier atomic component hierarchy (atoms/molecules/organisms) with strict import rules, `cn()` utility, and vanilla Tailwind styling (no shadcn/ui layer). Includes sample atoms (Button, Input, ValidatedInput), molecules (LanguageSwitcher, GlobalLoader), and organisms (Header, Footer).
- `docker-deployment`: Multi-stage Dockerfile (node:22-alpine build → nginx serve), nginx config with gzip/cache/security headers, `.dockerignore`

### Modified Capabilities
None — this is a new project scaffold with no existing specs.

## Impact

- **Dependencies**: Adds 10 runtime deps, 3 dev deps
- **Project structure**: Adds ~35 new files across src/data/, src/lib/, src/messages/, src/store/, src/styles/, src/components/seo/, src/components/pages/, src/components/atoms/, src/components/molecules/, src/components/organisms/, scripts/, plus Dockerfile, nginx.conf, .dockerignore, env.d.ts
- **Removals**: `src/pages/index.astro`, `src/components/Welcome.astro`, `src/assets/` (boilerplate content)
- **Build pipeline**: `astro build` now runs `validate-i18n` first; requires `site` URL in config for sitemap
- **Routing**: All page routes move to catch-all `[...path].astro`; new pages added by extending `routes.ts` + `COMPONENT_MAP`
