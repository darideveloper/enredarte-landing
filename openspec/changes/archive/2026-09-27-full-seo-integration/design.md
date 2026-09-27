## Context

The site is an Astro 7 SSG, bilingual (`es` unprefixed, `en` prefixed via `routes.ts`), using a 4-layer SEO component hierarchy: `Layout.astro` (shell + `<slot name="seo"/>`) → per-page `PageSEO.astro` (thin wrapper) → `BaseSEO.astro` (engine). All pages route through the catch-all `src/pages/[...path].astro`. Rationalized data lives in `src/data/site-config.ts` (`BUSINESS_DATA`), localization-derived paths come from `src/lib/i18n/utils.ts`, and `astro.config.mjs` resolves `site` via `PORTLESS_URL → SITE_URL → prod`.

Current state: engine resolves title/desc/keywords, emits canonical + en/es alternates + blanket `x-default`, minimal `LocalBusiness` JSON-LD, partial OG/Twitter. Nine known gaps (see proposal) split across component wiring, origin policy, structured data, social tags, portability, i18n content, an RSS/GTM add-on, and docs sync.

## Goals / Non-Goals

**Goals:**
- Make the SEO engine match the documented standard and close the three real bugs (dropped `keywords`, double H1, legal namespace).
- Single origin invariant for canonical/OG/hreflang/JSON-LD via `Astro.site`.
- Typed JSON-LD per template + a complete social graph set.
- Add RSS and production-only tracking.
- Bring `docs/astro-seo.md` in line with reality.

**Non-Goals:**
- No rework of image optimization (already compliant).
- No change to already-correct `noindex` decisions (compra, 404, design-system, paginated blog page 2+ stay as-is).
- No restructuring of the component hierarchy — `BaseSEO` stays the engine, `PageSEO` the thin wrapper. The documented `BlogSEO`/`BlogPostSEO` wrappers remain "pattern only".

## Decisions

### D1 — Absolutize alternates and origin centrally in `BaseSEO`
Resolve a single `origin` once from `Astro.site` (falling back to `BUSINESS_DATA.url` if absent for safety), and expose a helper that absolutizes any relative path (`path.startsWith("/") ? new URL(path, origin).href : path`). Apply it to canonical, alternate URLs, and OG/JSON-LD image/url. All 7 existing relative `alternateUrls` call sites are then covered without editing each page.
- **Alternatives considered**: editing all 7 pages to pass absolute URLs — more diff, repeated logic, drift-prone. Central guard wins (single source of truth).

### D2 — `Astro.site` origin (not `BUSINESS_DATA.url`)
`BaseSEO` will read `Astro.site` (the configured chain). This makes dev/branch previews canonicalize to their own subdomain. Risk of polluting the index is nullified by the existing `!PROD → noindex` guard (`BaseSEO.astro:76`).
- **Alternative**: keep prod-pinned canonicals — diverges from sitemap origin and hides branch previews. Rejected per user decision (Gap 1 → `Astro.site`).

### D3 — Drop blanket `x-default`
Delete the unconditional `x-default` alternate. en+es cover all supported locales; a blanket fallback to `/` is noise. If a neutral target is ever needed it would be a per-page opt-in.
- **Alternative**: keep `x-default` only on home. Not needed — `/` is already the es home; x-default adds no signal. Rejected per user decision (Gap 2 → drop).

### D4 — LegalPage: explicit alternates, not `currentPage` for i18n
`LegalPage` will pass explicit `alternateUrls` (like slug pages) instead of relying on `currentPage` for a nonexistent `pages.aviso-de-privacidad.*` lookup. Canonical still resolves from `currentPage` path math, but title/description/keywords come from explicit props + optionally `pages.legal.*.keywords`.
- **Alternative**: split canonical/i18n keys — more surface than the symptom warrants. Rejected per user decision (Gap 3 → explicit alternates).

### D5 — Typed JSON-LD via `jsonType` + `extraJson`, delegated in `PageSEO`
`BaseSEO` currently emits one minimal `LocalBusiness` blob. Extend `PageSEO` (which already forwards `jsonType`/`extraJson`/`ogImage`) so each page supplies its type + `extraJson`. Build a small per-page `extraJson` in each page component (or a shared `src/lib/seo/schema.ts` builder) rather than an elaborate polymorphic engine:
- `Blog` / `BlogPosting` (headline, author `Person`, datePublished, image, url) — `BlogIndex` / `BlogPost`.
- `VisualArtwork` (creator, artMedium when available, offers) — `ArtworkPage`.
- `ArtGallery` — `GalleryPage`.
- `Person` — `ArtistPage`, `CuratorPage`; `LocalBusiness` — home/legal/index shells.
`BaseSEO` gains a small `ogTypeMap` (`Blog→blog`, `BlogPosting→article`, else `website`) per the social-graph requirement.
- **Alternative**: the old documented polymorphic engine (TravelAgency/TouristDestination/Service, `@id`, `inLanguage`, logo/geo/priceRange) — was never built and isn't this project's domain; it is removed from docs. Rejected.

### D6 — Complete social graph set in `BaseSEO`
Emit `og:type` (mapped), `og:site_name` (`SITE_TITLE`), `og:image:width/height/alt`, `twitter:title/description/image`, and (for posts) `article:published_time` / `article:author`. Omit dimension tags when the image is remote and dimensions are unknown, or forward them via an optional prop (artwork/og:image typically has known dimensions from `lib/images.ts`).

### D7 — RSS via `@astrojs/rss` (per-locale feeds, discoverable)
Add dependency `@astrojs/rss`. Create two feeds — `src/pages/rss.xml.ts` (es, `/rss.xml`) and `src/pages/en/rss.xml.ts` (en, `/en/rss.xml`) — each reusing `fetchAll(listPosts)` per the blog spec Fork-A pattern, with localized titles and localized post URLs per locale. Feeds SHALL include published posts only. Make each feed discoverable via `<link rel="alternate" type="application/rss+xml">` head tags (per locale) in `Layout` and reference the feed URLs in `robots.txt.ts`.

### D8 — GTM/GA4 guarded to production
Inject both GTM container and GA4 (gtag) inline snippets in `Layout.astro` as one block gated by `import.meta.env.PROD`, with typed tracking IDs from `env.d.ts` (IDs are placeholders until deploy). Keeps dev/noindex pages clean. Uses Astro `is:inline` (per `docs/astro-seo.md §13`).

### D9 — i18n key completion
Add to `src/messages/{en,es}.json`: `pages.curator.keywords`, `pages.artwork.{title,description,keywords}`, `pages.legal.*.keywords`. All additions are symmetric across locales, so the existing `validate-i18n` build gate passes.

### D10 — Docs rewrite of `astro-seo.md`
Rewrite the doc to reflect the real engine + new per-template types, correct `PageSEO` prop list, document `Astro.site` origin, absolute alternates, no `x-default`, real RSS/GTM, corrected favicon snippet, and mark removed schema fiction. Mirror in `component-dependencies.md` (SEO chain) and `astro-i18n.md`/`astro-site-config.md` where they reference SEO localization.

### D11 — Ship the real favicon asset set
The finalized icon set lives at `~/Downloads/icons/` (outside the repo). Copy the 7 files into `public/` so the brand assets are versioned with the site: `favicon.svg` (also `BUSINESS_DATA.logo`), `favicon.ico` (32×32), `favicon.png` (32×32), `apple-touch-icon.png` (180×180, opaque — user verified), `og-image.jpg` (1200×630), plus `icon-192.png`/`icon-512.png`. Wire the links in `Layout`: SVG + ICO (already present) plus the missing `apple-touch-icon`. `og-image.jpg` is already referenced by `BUSINESS_DATA.ogImage` and emitted via `og:image`.
- **Manifest/PWA decision**: `icon-192`/`icon-512` are copied as versioned assets only; wiring a `webmanifest` is **deferred** to a future change — the icons exist for that path without blocking this one.

## Risks / Trade-offs

- **[R] Canonicals change in dev** → dev builds canonicalize to branch subdomains. Mitigated by the `!PROD → noindex` guard; document as the intended invariant.
- **[R] JSON-LD `VisualArtwork`/`ArtGallery` fields may be missing from the DRF API** (e.g. `artMedium`, `offers`) → make `extraJson` tolerant: emit only fields that resolve; leave others out (schema stays valid, just sparse).
- **[R] OG dimensions for remote images unknown** → omit `og:image:width/height` when absent; `alt` can still be emitted. No build failure.
- **[R] RSS fetch can fail the build** → keep the loud-failure posture: RSS reuses the blog fetch (`fetchAll(listPosts)`) and propagates `FetchError`/missing env loudly, consistent with the site's no-silent-fallback contract.
- **[R] Mandatory `apple-touch-icon` format** → shipped as 180×180 opaque PNG (verified 0% transparency) per Apple's no-transparency rule; if regenerated, re-flatten onto a solid background.
- **[R] Tracking IDs as typed env** → requires them in `.env`/build args (Docker). Missing IDs render no snippet; must not crash the build.
- **[R] Favicon assets originate outside the repo** (`~/Downloads/icons/`) → copy into `public/` at implementation time; once copied they are versioned with the site, so the build no longer depends on that external path. If the source is unavailable, the copy task is blocked until supplied.

## Migration Plan

1. Land the component fixes (keywords forward, H1, legal alternates) — isolated, low risk.
2. Add origin/alternate absolutization + drop x-default in `BaseSEO`.
3. Wire `jsonType`/`extraJson` per page + `ogTypeMap` + social set + `apple-touch-icon`.
4. Add i18n keys (applies cleanly across locales; `validate-i18n` enforces symmetry).
5. Add RSS (new dep + route) and prod-guarded GTM/GA4.
6. Rewrite docs.
Rollback is per-commit; no data migration. Each step is independently buildable and verifiable.

## Open Questions

- None blocking — all previously open questions resolved: per-locale RSS feeds (es + en), GTM + GA4 in one prod-gated block, `VisualArtwork`/`ArtGallery`/`Person` fields confirmed available from the DRF API, and RSS fails loudly on build. Tracking IDs remain deploy-time placeholders.