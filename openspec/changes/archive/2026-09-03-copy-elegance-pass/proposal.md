## Why

Landing copy reads as generic store ("Explora / Colección completa") or distant white-cube gallery ("Pabellón de Salas"). It undersells EnredArte's actual positioning: a curated atelier that places works from many artists into the right home while paying a fair 65% commission. Copy must signal quiet luxury and personal accompaniment (formal `usted`) to attract both seasoned collectors and first-time buyers.

## What Changes

- Replace hardcoded landing strings with i18n keys: hero badge/CTAs/prefix, BannerBar 4 trust signals, Gallery and Collection headers, filters/empty states, SEO description — all in formal register ES and elevated EN.
- Elevate hero title treatment to `Tierra, mundo y memoria — seis miradas` (fallback) and badge to `Sala I — Capítulo del mes`.
- Reframe BannerBar 65% proof as positive, explicit `El 65% es para el artista` / `65% goes to the artist` (no marketplace negative).
- Adopt invitation verbs (`Descubrir la Sala`, `Leer la curaduría`, `Afinar selección`) and formal empty-state (`Le invitamos a...`).
- Establish reusable voice system for future sections.

## Capabilities

### New Capabilities
- `copy-voice`: Brand voice system — formal register, matchmaker thesis, 65% proof rule, CTA verb lexicon. Single source for all future copy.

### Modified Capabilities
- `hero-section`: REQUIREMENTS change — badge/title fallback and CTA labels sourced from i18n, formal tone.
- `banner-bar-organism`: REQUIREMENTS change — 4 items sourced from i18n with explicit 65% phrasing.
- `gallery-organism`: REQUIREMENTS change — eyebrow/title from i18n.
- `homepage-gallery`: REQUIREMENTS change — collection header from i18n (replaces hardcoded Explora/Colección completa).

## Impact

- Affected code: `src/messages/{es,en}.json`, `src/components/organisms/{Hero,BannerBar,Gallery}.astro`, `src/components/pages/landing/Home.astro`, `src/components/organisms/Artworks.tsx` defaults, SEO in `src/data/site-config.ts` or page frontmatter.
- No API/breaking change; visual layout unchanged (text length similar). Requires verifying ES/EN toggle and build.
