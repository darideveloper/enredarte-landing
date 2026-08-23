## 1. Dependencies & Configuration

- [x] 1.1 Install runtime dependencies: @astrojs/react, @astrojs/sitemap, @tailwindcss/vite, react, react-dom, tailwindcss, tw-animate-css, zustand, zod
- [x] 1.2 Install dev dependencies: @types/react, @types/react-dom, tsx
- [x] 1.3 Update astro.config.mjs with React, sitemap integrations, Tailwind Vite plugin, site URL, and build.inlineStylesheets
- [x] 1.4 Update tsconfig.json with path aliases (@/*), React JSX config (jsx: "react-jsx", jsxImportSource: "react")
- [x] 1.5 Add packageManager field and update engines in package.json
- [x] 1.6 Update build script to run validate-i18n before astro build
- [x] 1.7 Add .env.example with API_BASE_URL placeholder
- [x] 1.8 Create env.d.ts with ImportMetaEnv interface (API_BASE_URL, API_TOKEN)

## 2. Tailwind & Styling

- [x] 2.1 Create src/styles/global.css with @import "tailwindcss", @import "tw-animate-css", and @theme inline custom tokens
- [x] 2.2 Create src/lib/utils.ts with cn() helper function

## 3. Site Config & Constants

- [x] 3.1 Create src/consts.ts with SITE_TITLE, SITE_DESCRIPTION, LOCALE_MAP
- [x] 3.2 Create src/data/site-config.ts with typed BUSINESS_DATA object (placeholder values) using as const
- [x] 3.3 Update the `site` URL in astro.config.mjs from placeholder to the real production domain before deploying

## 4. i18n System

- [x] 4.1 Create src/messages/en.json with translations for global.nav.home and pages.home.*
- [x] 4.2 Create src/messages/es.json with matching key structure (Spanish translations)
- [x] 4.3 Create src/lib/i18n/ui.ts with language definitions, defaultLang, and ui object importing JSON files
- [x] 4.4 Create src/lib/i18n/routes.ts with home route (en: "", es: "es") and PageKey type
- [x] 4.5 Create src/lib/i18n/utils.ts with getLangFromUrl, getLocalizedPath, and getTranslations(t) functions
- [x] 4.6 Create scripts/validate-i18n.ts with flattenKeys comparison logic

## 5. Layout & Pages

- [x] 5.1 Update src/layouts/Layout.astro: add lang prop, SEO slot in head, global.css import, body class with font-sans, preloadImage prop support
- [x] 5.2 Create src/pages/[...path].astro catch-all router with getStaticPaths iterating routes, COMPONENT_MAP, page rendering
- [x] 5.3 Create src/pages/robots.txt.ts with dynamic robots.txt generation
- [x] 5.4 Create src/components/pages/landing/Home.astro with SEO slot and basic page structure using translations
- [x] 5.5 Remove boilerplate: src/pages/index.astro, src/components/Welcome.astro, src/assets/ directory

## 6. SEO System

- [x] 6.1 Create src/components/seo/base/BaseSEO.astro with title resolution chain, canonical/hreflang, OG/Twitter tags, JSON-LD, environment-based noindex
- [x] 6.2 Create src/components/seo/PageSEO.astro as thin wrapper delegating to BaseSEO

## 7. State Management

- [x] 7.1 Create src/store/form.ts with Zustand store: buildFieldSchemaMap, Zod schemas, setField with per-field validation, validateAll, reset, persist middleware with partialize
- [x] 7.2 Create src/store/useField.ts with hydration-safe hook returning value, error, setValue, mounted

## 8. API Client

- [x] 8.1 Create src/lib/api/client.ts with FetchError class, attemptFetch internals, safeFetch with timeout and retry
- [x] 8.2 Create src/lib/api/constants.ts with API_ERROR_MESSAGE
- [x] 8.3 Create src/lib/api/types.ts with placeholder for shared response types

## 9. Docker & Infrastructure

- [x] 9.1 Create Dockerfile with multi-stage build (node:22-alpine build → nginx:alpine serve), build args, frozen lockfile
- [x] 9.2 Create nginx.conf with gzip, security headers, cache policies (immutable for _astro/, no-cache for HTML)
- [x] 9.3 Create .dockerignore excluding node_modules, dist, .git, .env, *.md

## 10. Final Cleanup

- [x] 10.1 Update README.md to describe the actual project stack instead of Astro starter template
- [x] 10.2 Run pnpm install and pnpm build to verify everything works end-to-end
- [x] 10.3 Verify dev server starts with astro dev --background

## 11. Sample Content — Pages & Components

- [x] 11.1 Create vanilla atoms: Button.tsx, Input.tsx, ValidatedInput.tsx
- [x] 11.2 Create molecules: LanguageSwitcher.astro, GlobalLoader.tsx
- [x] 11.3 Create organisms: Header.astro, Footer.astro
- [x] 11.4 Create page components: services/Services.astro, about/About.astro
- [x] 11.5 Add services and about routes to src/lib/i18n/routes.ts
- [x] 11.6 Add full translations (services, about, footer, global) to en.json and es.json
- [x] 11.7 Populate src/data/site-config.ts with sample PHONES, EMAIL, ADDRESS, SOCIAL_LINKS, GOOGLE_MAPS
- [x] 11.8 Update src/pages/[...path].astro to import and map new page components
- [x] 11.9 Update src/layouts/Layout.astro to include Header, Footer, and pageKey prop
