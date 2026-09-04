## 1. i18n keys

- [x] 1.1 Add keys to `src/messages/es.json` and `en.json`: `pages.home.hero.badge/title/description/ctaPrimary/ctaSecondary/curationBy/priceFallback`, `global.banner.*` (4), `pages.home.salas.eyebrow/title`, `pages.home.collection.eyebrow/title`, formal `global.filters.*` and `global.filters.noResults/reset` updates, `pages.home.description` thesis line
- [x] 1.2 Verify no duplicate keys and JSON validity

## 2. Component wiring

- [x] 2.1 `src/components/organisms/Hero.astro` — source badge/title/description fallbacks, CTAs, curator prefix, priceFallback from `t()`
- [x] 2.2 `src/components/organisms/BannerBar.astro` — source 4 items from `t(global.banner.*)`
- [x] 2.3 `src/components/organisms/Gallery.astro` — source header from `t(pages.home.salas.*)`
- [x] 2.4 `src/components/pages/landing/Home.astro` — source collection header and pass formal filter/empty labels
- [x] 2.5 `src/components/organisms/Artworks.tsx` — update default prop fallbacks to formal phrasing

## 3. Verification

- [x] 3.1 `pnpm run build` passes with no missing i18n keys
- [x] 3.2 Visual QA at `https://enredarte-landing.localhost` — ES and EN toggle shows formal copy, no wrapping regressions, BannerBar 65% explicit
