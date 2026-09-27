---
created: 2026-04-18
updated: 2026-09-27
tags:
  - astro
  - seo
  - documentation
type: resource
status: active
---

# SEO Implementation & Best Practices

This document captures the SEO strategy and implementation details for this Astro project: metadata rendering, URL policy, structured data, multimedia optimization, accessibility, and performance.

## 0. Prerequisites

- **Layout Shell:** Standard `Layout.astro` with `<slot name="seo" />` in `<head>` (plus the tracking block, RSS feed link, and favicon links).
- **i18n:** The custom i18n system is defined in [[astro-i18n]] (bilingual `es`/`en`).
- **Centralized config:** Business data lives in a single file → [[astro-site-config]].

## 1. Dependencies & Config

Add these to `astro.config.mjs`:

```text
@astrojs/sitemap                       # Automatic sitemap generation
@astrojs/rss                           # RSS feed generation
astro:assets / sharp                   # Image optimization (bundled with Astro)
```

```ts
export default defineConfig({
  // Origin chain: PORTLESS_URL → SITE_URL → prod (never localhost)
  site: process.env.PORTLESS_URL ?? process.env.SITE_URL ?? "https://enredarte.mx",
  build: { inlineStylesheets: "always" },
  integrations: [react(), sitemap({ filter: (page) => !page.includes("/compra-") })],
})
```

## 2. Favicons & Icons

Brand icons live in `public/` (all real assets, not placeholders):

- `favicon.svg`: Primary vector icon (also `BUSINESS_DATA.logo`).
- `favicon.ico`: Legacy 32×32 MS Windows fallback.
- `favicon.png`: Standard 32×32 PNG.
- `apple-touch-icon.png`: iOS Home Screen — **180×180 opaque** PNG (no transparency per Apple's rule).
- `og-image.jpg`: Open Graph image, **1200×630** px.
- `icon-192.png` / `icon-512.png`: PWA/Android sizes, shipped as versioned assets (manifest wiring deferred to a future change).

**Snippet (`Layout.astro`):**
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

## 3. The SEO Component Hierarchy

A **2-layer hierarchy** — `PageSEO.astro` (thin wrapper) delegates everything to `BaseSEO.astro` (engine).

```
BaseSEO.astro (core engine)
├── Resolves title/desc/keywords: prop → i18n(pageKey) → SITE_TITLE/desc constant → default
├── Auto-tagline: appends " | Business Name" for non-home pages (useTagLine prop)
├── Canonical URL: from Astro.site origin via getLocalizedPath() / Astro.url.pathname
├── Hreflang alternates: en/es auto-generated or via alternateUrls prop (absolutized)
├── Open Graph / Twitter: og:type map (Blog→blog, BlogPosting→article, else website),
│   og:site_name, og:image:width/height/alt (when resolvable), twitter:title/description/image
├── article:published_time / article:author (when jsonType === "BlogPosting")
├── JSON-LD: per-template @type via jsonType + extension via extraJson
└── Robots: !PROD guard + noIndex prop; sitemap link (robots.txt)
```

### 3.1 BaseSEO.astro — The Core Engine

**Origin policy:** All canonical/OG/hreflang/JSON-LD URLs use the resolved origin from `Astro.site` (the `PORTLESS_URL → SITE_URL → prod` chain), matching the sitemap origin per environment. A fallback to `BUSINESS_DATA.url` guards against a missing `Astro.site`. Relative path input is absolutized against the origin so hreflang/OG always emit full URLs.

**Title resolution chain:** explicit title → i18n `pages.{key}.title` → `SITE_TITLE`.

**Description resolution chain:** explicit description → i18n `pages.{key}.description` → `SITE_DESCRIPTION`. Descriptions are run through `stripMarkdown` so meta tags are always plain text.

**Keywords:** resolved and rendered only when non-empty (`keywords` prop or i18n `pages.{key}.keywords`).

**Tagline logic (default on):**
```astro
{useTagLine && resolvedTitle !== BUSINESS_DATA.name && currentPage !== 'home'
  ? `${resolvedTitle} | ${BUSINESS_DATA.name}` : resolvedTitle}
```

**Hreflang alternates:** auto-generated en/es for route-map pages via `getLocalizedPath`, or taken from an `alternateUrls` prop for slug pages (gallery/artwork/artist/curator/blog/legal). No `hreflang="x-default"` is emitted — en/es cover all supported locales.

**Per-template JSON-LD:** The engine emits `@type` from `jsonType` and merges `extraJson` (which overrides base `name`/`url`/`image`). Template builders live in `src/lib/seo/schema.ts`:

| Template | @type | extraJson fields |
|----------|-------|------------------|
| Blog index | `Blog` | — |
| Blog post | `BlogPosting` | headline, author Person, datePublished, image, url |
| Gallery | `ArtGallery` | name, description, image |
| Artwork | `VisualArtwork` | creator Person, dateCreated (year), artMedium (first technique), size (dimensions), offers (when available), image |
| Artist / Curator | `Person` | name, image, email, website (url), sameAs |
| Home / legal / index shells | `LocalBusiness` | telephone, address, sameAs (default) |

### 3.2 PageSEO.astro — Thin Wrapper

Forwards `currentPage`, `lang`, `title`, `description`, `keywords`, `jsonType`, `extraJson`, `ogImage`, `ogImageAlt`, `ogImageWidth`, `ogImageHeight`, `alternateUrls`, `noIndex`, `useTagLine`, `articlePublishedTime`, `articleAuthor` to `BaseSEO`.

## 4. The Slot Pattern

SEO components use the Astro slot pattern (`slot="seo"`) to inject metadata into `<head>`:

```astro
<Layout>
  <PageSEO currentPage={pageKey} slot="seo" />
  <!-- page content -->
</Layout>
```

## 5. Sitemap & Robots.txt

### 5.1 Sitemap

Generated by `@astrojs/sitemap` at `/sitemap-index.xml`. `site` in `astro.config.mjs` must resolve correctly for absolute URLs. `/compra-*` pages are filtered from the sitemap.

### 5.2 Dynamic robots.txt

`src/pages/robots.txt.ts` emits `Allow: /`, the sitemap URL, and the RSS feed URL(s), derived from `site`:

```ts
export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site)
  const feedURL = new URL("rss.xml", site)
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL.href}\nSitemap: ${feedURL.href}\n`)
}
```

Exclusion of `compra-*` relies on the sitemap filter + `noIndex` meta (shells must still exist as files).

## 6. Performance & Environment Logic

### 6.1 Environment-Based Indexing

```astro
{!import.meta.env.PROD && <meta name="robots" content="noindex, nofollow" />}
```
Gate all index-sensitive output by `import.meta.env.PROD`. Dev/branch builds canonicalize to their own subdomain and are kept out of the index by this guard.

### 6.2 Multimedia Optimization

Use `astro:assets` `Image` component (AVIF/WebP conversion, resizing). Slots in `src/lib/images.ts` (`IMAGE_SLOTS`) map widths/sizes to CSS slots.

**Best Practices:**
- **Eager:** hero / LCP images — `loading="eager"` + `fetchpriority="high"` + responsive `imagesrcset` preload.
- **Lazy:** everything else — `loading="lazy"` + `decoding="async"`.

## 7. Core Web Vitals Optimization

- `inlineStylesheets: "always"`.
- LCP preload (`preloadImage` / `preloadSrcSet` / `preloadSizes`) computed in `[...path].astro` via `lcpPreload` with the same transform the `Image` atom applies (no double-download).
- Preconnect/preload external origins and fonts as needed per page.

## 8. Island Architecture + SEO

Content inside Astro slots renders as static HTML — crawlers see it without JS hydration. React islands receive localized copy as props; they never emit index-critical markup pre-hydration. Conversion islands (`OrderFlow`, `BuyWidget`) live on `noIndex` pages where that is acceptable.

## 9. Internationalization (i18n) + SEO

### 9.1 Canonical Links & Hreflang

Handled by `BaseSEO`: every route-map page gets absolute en/es alternates (no x-default). Slug pages pass `alternateUrls` via `getLocalized*Path`.

### 9.2 Internal Linking

All internal links use localized paths from [[astro-i18n]] (`LangLink` / `getLocalized*Path`).

### 9.3 Legacy Redirects

Old `/es/<path>` → `/<path>` mapping in `astro.config.mjs` preserves SEO authority.

## 10. Headings & Hierarchy

- One **unique H1** per page (no duplicate/sr-only clones).
- H2–H6 for sections, never skipping levels.

## 11. Accessibility (ARIA)

Interactive elements use descriptive labels / `aria-label` when text is not enough. Decorative images use `alt=""` + `aria-hidden`. Every content image requires an `alt`.

## 12. 404 Page

Include links to primary sections; clear messaging; `noIndex` (no hreflang needed).

## 13. Analytics & Tracking (consent-gated)

Tracking is strict opt-in under the legal consent posture — no tag fires before the visitor grants analytics. `src/components/seo/base/Tracking.astro` (injected in `Layout`, production-only via `import.meta.env.PROD` so dev/noindex pages stay clean) injects `gtm.js` only when a stored `enredarte-consent` grant exists; grants made after page load are handled by `ensureGtmLoaded()` in `src/lib/analytics.ts` (same localStorage contract, DOM-guarded, no double-inject). There is no `<noscript>` fallback (it would bypass consent). GA4 stays owned by `lib/analytics.ts` `ensureGaLoaded()` behind the same gate, with Consent Mode v2 defaults (all denied) in `Layout`. IDs come from typed env vars:

```env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX  # GA4 measurement ID (canonical)
PUBLIC_GTM_ID=GTM-XXXXXXX           # Google Tag Manager container ID (optional)
```

When neither ID is set, nothing renders.

## 14. RSS Feed

Per-locale feeds via `@astrojs/rss`, built from the published blog posts:

- `/rss.xml` (es) and `/en/rss.xml` (en) — `src/pages/rss.xml.ts` + `src/pages/en/rss.xml.ts`, sharing `src/lib/seo/rss.ts` (`buildRssFeed(lang)` reusing `fetchAll(listPosts)`).
- Each feed carries localized title/description/pubDate/author/link; only published (non-draft) posts.
- Feed fetch errors fail the build loudly (consistent with blog contract).
- Feeds are discoverable via `<link rel="alternate" type="application/rss+xml">` in `Layout`.

## 15. SEO Validation Checklist

Before every deployment:

- [ ] **Google PageSpeed Insights:** Score > 90 Mobile and Desktop.
- [ ] **Schema Markup Validator:** No errors in JSON-LD (check Blog/BlogPosting/ArtGallery/VisualArtwork/Person).
- [ ] **Lighthouse:** Run accessibility and SEO audits.
- [ ] **Canonical/Hreflang:** Absolute cross-lingual links, no x-default.
- [ ] **i18n Sync:** `pnpm run validate-i18n`.
- [ ] **Favicons:** All icons load with no 404s; `apple-touch-icon` 180×180 opaque.
- [ ] **Robots.txt:** Exists, points to sitemap + feed.
- [ ] **og:image:** Renders correctly on social preview tools.