## Context

The project is an Astro v7 scaffold generated from the `basics` template. It has a single page (`src/pages/index.astro`), a minimal `Layout.astro`, a boilerplate `Welcome.astro` component, and no integrations beyond `astro` itself. `package.json` has only one dependency. There is no styling, no routing beyond the default, no i18n, no SEO, no state management, no API client, and no deployment configuration.

The user's documented convention system (from Obsidian knowledge base) defines mandatory patterns for every project: React islands + Tailwind v4, atomic component hierarchy, Zustand+Zod state management, centralized site config, SEO hierarchy, fetch wrapper, and Docker deployment. Additionally, i18n is required for this bilingual (en/es) landing page.

This design covers the initial scaffold — applying all conventions to create a production-ready foundation. Page content and styling are out of scope.

## Goals / Non-Goals

**Goals:**
- Configure React 19 + Tailwind CSS v4 via `@astrojs/react` and `@tailwindcss/vite`
- Set up TypeScript path aliases (`@/*`) and React JSX config
- Create Tailwind v4 global CSS with `@theme` tokens and animation support
- Implement the custom i18n system: catch-all router, JSON translation files, route definitions
- Implement the SEO component hierarchy: BaseSEO, PageSEO, sitemap, robots.txt
- Create centralized site config (`src/data/site-config.ts`) and constants (`src/consts.ts`)
- Set up Zustand store with Zod validation and `useField` hook
- Create typed fetch wrapper (`safeFetch` with retry/timeout/error types)
- Scaffold atomic component directories (atoms/molecules/organisms) with `cn()` utility
- Replace starter boilerplate with catch-all router + Home page component
- Set up Docker multi-stage build (node:22-alpine → nginx:alpine)
- Wire i18n build-time validation into the `build` script

**Non-Goals:**
- Page content, copy, or visual design
- Custom components beyond the Home page scaffold
- Actual business data population (placeholder config values)
- CI/CD pipeline configuration
- Analytics or cookie consent
- PWA setup
- Testing framework configuration

## Decisions

### React + Tailwind via Vite plugin (not PostCSS)
Tailwind v4 uses the Vite plugin approach (`@tailwindcss/vite`) instead of the PostCSS-based setup from v3. This is the recommended path for Tailwind v4 and simplifies configuration — no `postcss.config.js` or `tailwind.config.js` needed. The CSS file uses `@import "tailwindcss"` directly.

### Custom i18n over Astro's built-in i18n
Astro has built-in i18n support, but the user's documented pattern uses a custom catch-all router (`[...path].astro`). This gives explicit control over route definitions, slug mappings, and the English-unprefixed / Spanish-prefixed convention. It also enables the build-time validation script, which is absent from Astro's built-in approach.

### Vanilla Tailwind (no shadcn)
The user chose vanilla Tailwind. This means atoms are self-contained components with Tailwind utility classes directly, no `ui/` layer. The atomic hierarchy still applies (atoms → molecules → organisms), just without shadcn wrappers.

### tw-animate-css for runtime animations
`tw-animate-css` is included (as specified in the documented React+Tailwind setup) to provide Tailwind-compatible animation utilities — `animate-*` classes like `animate-fade-in`, `animate-slide-up`, etc. This avoids shipping a full animation library while enabling subtle entry animations for landing page sections.

### Zustand + Zod for cross-island state
React islands in Astro cannot share React context. Zustand with `persist` middleware provides a store that all islands read from independently, and Zod schemas provide per-field validation. The `useField` hook wraps hydration safety to prevent SSR/CSR mismatches.

### English unprefixed, Spanish prefixed
English routes have no language prefix (`/` for home, `/services`), Spanish routes use `/es/` prefix (`/es`, `/es/servicios`). This makes English the canonical/default language and keeps URLs clean for the primary audience.

### Build-time i18n validation mandatory
The validation script (`scripts/validate-i18n.ts`) runs as part of `npm run build` before `astro build`. This catches missing translation keys at build time rather than silently falling back to the default language in production.

### Inline stylesheets for performance
`build.inlineStylesheets: "always"` eliminates render-blocking CSS requests. For small-to-medium sites like this landing page, the CSS is small enough to inline without significant HTML size increase.

### SEO slot pattern
SEO metadata is injected into `<head>` via Astro's `slot="seo"` pattern. The Layout declares a `<slot name="seo" />` in `<head>`, and page components render `<PageSEO slot="seo" />` inside the Layout. This keeps the Layout framework-agnostic about SEO.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Catch-all `[...path].astro` could conflict with future static routes | Named routes take priority over catch-all in Astro; add specific page files before the catch-all runs |
| Zustand persist + SSR hydration causes flash of incorrect content | `useField` hook uses `mounted` state (from `useEffect`) to return initial values before hydration completes |
| i18n validation fails builds when translations are out of sync | This is intentional — better to fail at build time than serve missing translations in production |
| `site` URL hardcoded in `astro.config.mjs` must match production domain | Set to placeholder now; must be updated before deployment or sitemap URLs will be wrong |
| Fetch wrapper adds complexity that a simple landing page may never use | Mandatory pattern per conventions; zero cost as long as no endpoints import it |
