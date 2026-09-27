## Why

The site ships with a solid SEO *foundation* (canonical/hreflang, sitemap, robots, OG, image LCP discipline) but it is not fully integrated: three real bugs leak SEO signal (silently-dropped `keywords`, a double `<h1>` on blog posts, a `LegalPage` i18n namespace collision), all pages emit a single JSON-LD `@type` (`LocalBusiness`) regardless of template, social graph tags are incomplete, and `docs/astro-seo.md` describes schemas and features that were never built. This change closes those gaps and makes the SEO layer match the documented standard.

## What Changes

- **Fix** `PageSEO` silently dropping `keywords` — unblocks blog meta keywords (`BlogIndex`, `BlogPost`).
- **Fix** duplicate `<h1>` on `BlogPost` banner path (remove the `sr-only` clone).
- **Fix** `LegalPage` passing a page-key that hits a nonexistent i18n namespace (`pages.aviso-de-privacidad.*`); switch it to the explicit-alternates pattern used by slug pages.
- **Absolutize** alternate URLs in `BaseSEO` (single guard) so every hreflang is a full URL with return links — covers all 7 relative call sites at once.
- **Switch canonical/OG/hreflang origin** from hardcoded `BUSINESS_DATA.url` to the `Astro.site` origin chain (`PORTLESS_URL → SITE_URL → prod`), so canonicals match the environment. **BREAKING**: dev/branch builds now emit their own branch-subdomain canonicals instead of prod URLs — kept out of the index by the existing dev `noindex` guard.
- **Drop** the blanket `x-default → /` tag on every page (en+es cover all locales).
- **Per-template JSON-LD**: `Blog` (blog index), `BlogPosting` (posts, with `headline`/`author`/`datePublished`/`image`/`url`), `ArtGallery` (gallery pages), `VisualArtwork` (artwork pages, with `creator`/`artMedium`/`offers`), `Person` (artist & curator pages). `LocalBusiness` remains only for home/legal/index shells.
- **Complete social graph tags**: `og:type` mapping (`Blog→blog`, `BlogPosting→article`, else `website`), `twitter:title/description/image`, `og:site_name`, `og:image:width/height/alt`, plus `article:published_time`/`article:author` on posts.
- **Ship real brand favicons**: copy the finalized icon set from `~/Downloads/icons/` into `public/` — `favicon.svg` (vector logo, also `BUSINESS_DATA.logo`), `favicon.ico` (32×32 legacy), `favicon.png` (32×32), `apple-touch-icon.png` (180×180 opaque), `og-image.jpg` (1200×630 social) — replacing the current placeholder assets.
- **Wire favicon links**: add missing `<link rel="apple-touch-icon">` tag in `Layout` (plus the existing SVG/ICO links), pointing at the real assets. PWA/`webmanifest` wiring is **deferred** to a future change; `icon-192`/`icon-512` are shipped as versioned assets for that path.
- **Implement RSS** (`@astrojs/rss`) as per-locale feeds (es + en) — posts already expose localized title/description/pubDate/author/slug; feed fetch fails loudly like the blog build.
- **Implement analytics/tracking**: GTM + GA4 `is:inline` snippets in `Layout`, production-only and env-gated.
- **Complete i18n SEO keys**: `pages.curator.keywords`, `pages.artwork.{title,description,keywords}`, `pages.legal.*.keywords` (×3, ×2 langs).
- **Sync `docs/astro-seo.md`**: remove never-built schema fiction (`TravelAgency/TouristDestination/Service`, `@id`, `inLanguage`, `priceRange/geo/logo`), document the actual schema + new per-template types, fix `PageSEO` prop list, document the `Astro.site` origin invariant, absolute alternates, no `x-default`, real RSS/GTM sections, corrected favicon snippet.

### Non-goals

- No change to image optimization (already strong: required `alt`, `IMAGE_SLOTS` parity, LCP preload, `stripMarkdown` on meta).
- No change to `noindex` decisions already correct: `compra-*` (sitemap-filtered + noindex), 404, `design-system`, paginated blog page 2+ (kept indexable, self-canonical).
- No restructuring of the SEO page hierarchy — `BaseSEO` remains the engine, `PageSEO` the thin wrapper (the documented `BlogSEO`/`BlogPostSEO` wrappers stay "pattern only"; their behavior moves into `BaseSEO` via `jsonType`/`extraJson`).

## Capabilities

### New Capabilities

- `seo`: core SEO engine behavior — metadata resolution chain, canonical/hreflang/alternate URL generation, `Astro.site` origin policy, social graph tags, robots/indexing guards, `PageSEO` keyword passthrough, favicon links, per-template JSON-LD structured-data emission (with extension via `extraJson`), and analytics/tracking snippet. This is the single new spec capability; the i18n key additions and docs sync are consequences of it, not standalone capabilities.

### Modified Capabilities

- `blog` (blog schema + metadata): posts emit `BlogPosting` JSON-LD with author/date; blog index emits `Blog`; posts/index gain keyword meta; introduces an RSS feed.

## Impact

- **Code**: `src/components/seo/PageSEO.astro`, `src/components/seo/base/BaseSEO.astro`, `src/layouts/Layout.astro`, `src/pages/robots.txt.ts` (unchanged), 11 page components across `src/components/pages/**` (SEO props only).
- **i18n messages**: `src/messages/{en,es}.json` — add `pages.curator.keywords`, `pages.artwork.{title,description,keywords}`, `pages.legal.*.keywords`. Safe under existing `validate-i18n` symmetry check.
- **New dependency**: `@astrojs/rss`.
- **Assets**: copy 7 favicon/icon files from `~/Downloads/icons/` into `public/` (favicon.svg/ico/png, apple-touch-icon.png, og-image.jpg, icon-192.png, icon-512.png); the PWA `webmanifest` is **deferred** to a future change (icons shipped as versioned assets only).
- **Config**: `astro.config.mjs` — no changes required; `site` already set via `Astro.site` chain, and the RSS routes are page files (not config).
- **New routes**: per-locale RSS feeds (`src/pages/rss.xml.ts` es + en route, discoverable via head feed-links + `robots.txt` reference), GTM + GA4 `is:inline` snippets in `Layout` gated by env.
- **Docs**: `docs/astro-seo.md` rewritten; reference updates in `docs/astro-site-config.md`, `docs/astro-i18n.md`, `docs/component-dependencies.md`.
- **Environment**: analytics enabled only in production via an env flag/`import.meta.env.PROD` guard to avoid polluting dev/noindex pages.