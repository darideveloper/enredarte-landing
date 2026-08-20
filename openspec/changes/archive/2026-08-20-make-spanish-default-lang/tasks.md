## 1. Core routing swap

- [x] 1.1 Update `src/lib/i18n/routes.ts` so `home` maps to `{ en: "en", es: "" }` (Spanish owns the empty prefix)
- [x] 1.2 Update `src/lib/i18n/utils.ts` `getLangFromUrl` to return `"en"` only when the first segment is `en`, else `"es"`
- [x] 1.3 Update `src/lib/i18n/utils.ts` `getLocalizedSalaPath` to use `/en/salas/${slug}` for English and unprefixed `/salas/${slug}` for Spanish
- [x] 1.4 Update `src/pages/[...path].astro` `getStaticPaths` routes loop so the Spanish push uses `params: { path: undefined }` and English uses `langPaths.en`
- [x] 1.5 Update `src/pages/[...path].astro` `getStaticPaths` gallery loop so `salas/${slug}` is Spanish and `en/salas/${slug}` is English

## 2. Fallback and SEO

- [x] 2.1 Update `src/lib/i18n/ui.ts` `defaultLang` from `"en"` to `"es"`
- [x] 2.2 Update `src/components/seo/base/BaseSEO.astro` default `lang` prop from `"en"` to `"es"`
- [x] 2.3 Add `<link rel="alternate" hreflang="x-default" href="${BUSINESS_DATA.url}/">` in `BaseSEO.astro`

## 3. Redirects and docs

- [x] 3.1 Update `astro.config.mjs` legacy redirects to generate `/es` → `/` and `/es/<path>` → `/<path>` (replacing the `/en` block)
- [x] 3.2 Update `docs/astro-i18n.md` sections 3, 4, 5, 6, 8, and 11 to reflect Spanish-unprefixed / English-prefixed scheme

## 4. Verification

- [x] 4.1 Run `pnpm run build` (gated by i18n + import validation) and confirm it passes
- [x] 4.2 Manually verify `/` renders Spanish home, `/en` renders English home, `/salas/:slug` Spanish, `/en/salas/:slug` English, `/es` 301s to `/`, and hreflang includes `x-default`
