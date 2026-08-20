## Why

The site's primary audience is Spanish-speaking, yet the URL scheme and translation fallback currently treat **English** as the default language (English owns the bare, unprefixed URLs while Spanish lives under `/es`). This is backwards for an art gallery whose content is authored in Spanish and whose design-system copy is Spanish-first. Making Spanish the default gives it the cleaner, SEO-strong root URLs and makes it the natural translation fallback.

## What Changes

- Swap the default-language routing so **Spanish owns the unprefixed root paths** (`/`, `/salas/:slug`) and English moves under the `/en` prefix (`/en`, `/en/salas/:slug`).
- Change the translation fallback (`defaultLang`) from `en` to `es` so a missing key resolves to Spanish.
- Update URL→language detection so any path that is **not** `/en` resolves to Spanish.
- **BREAKING**: Bare paths change meaning — `/` was the English homepage and becomes the Spanish homepage; `/salas/:slug` was English and becomes Spanish. Old English unprefixed URLs are lost to the collision and cannot be redirected.
- Rework legacy redirects: replace the current `/en/*` → `/*` block with `/es/*` → `/*` redirects to preserve old Spanish-prefixed URLs. Redirects are generated from the `routes` table (currently only `home`, so `/es` → `/`); sala paths (`/es/salas/*`) are not covered (see design).
- Add an `x-default` hreflang tag pointing at the root (`/`) now that Spanish owns it.
- Update the default `lang` fallback in the SEO component from `en` to `es`.
- Update the i18n architecture documentation to reflect the new scheme.

## Capabilities

### New Capabilities
- `i18n-default-language`: The routing, language-detection, translation-fallback, redirect, and SEO behaviors that make Spanish the default (unprefixed) language and English the prefixed one.

### Modified Capabilities
- `lang-btns-molecule`: Scenario examples in the existing spec reference Spanish URLs under `/es/...`; these become unprefixed Spanish URLs (e.g. `/acerca-de`) after the swap. Requirement semantics (disabled active, routed inactive) are unchanged.

## Impact

- `src/lib/i18n/routes.ts` — swap `en`/`es` prefixes.
- `src/lib/i18n/ui.ts` — `defaultLang` to `"es"`.
- `src/lib/i18n/utils.ts` — `getLangFromUrl`, `getLocalizedSalaPath`.
- `src/pages/[...path].astro` — `getStaticPaths` en/es path assignment.
- `astro.config.mjs` — legacy redirects `/en/*` → `/es/*`.
- `src/components/seo/base/BaseSEO.astro` — default `lang`, `x-default` hreflang.
- `docs/astro-i18n.md` — documentation.
- Behavior that auto-adapts and needs no edit: `getLocalizedPath`, `getPageKeyFromUrl`, `LangBtns`, `getNavLinks`, Header/Footer, sitemap, `LOCALE_MAP`, i18n validation script.
- Known placeholder edge case (no action): `Hero.astro:47` hardcodes `/salas/1/obras/1`, which becomes a Spanish URL after the swap; the English page would link to it. Not a real route — follow-up only.
