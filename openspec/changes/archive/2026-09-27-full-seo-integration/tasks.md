## 1. Component bug fixes

- [x] 1.1 `PageSEO.astro`: destructure and forward `keywords` to `BaseSEO`
- [x] 1.2 `BlogPost.astro`: remove the duplicate `sr-only` `<h1>` in the banner path (keep exactly one H1)
- [x] 1.3 `LegalPage.astro`: pass explicit `alternateUrls` (via `getLocalizedPath` for the legal page keys) instead of the phantom `pages.aviso-de-privacidad.*` lookup; keep title/description props

## 2. Origin + alternate URL policy in BaseSEO

- [x] 2.1 `BaseSEO.astro`: resolve `origin` from `Astro.site` (fallback `BUSINESS_DATA.url`)
- [x] 2.2 `BaseSEO.astro`: add `absolutize()` helper; apply to canonical, alternate URLs, and OG/JSON-LD image/url
- [x] 2.3 `BaseSEO.astro`: remove the unconditional `hreflang="x-default"` emission (auto-alternate path only)

## 3. Per-template JSON-LD + social graph

- [x] 3.1 `BaseSEO.astro`: add `ogTypeMap` (`Blog→blog`, `BlogPosting→article`, else `website`) and use it for `og:type`
- [x] 3.2 `BaseSEO.astro`: emit `og:site_name`, `og:image:width/height/alt`, `twitter:title/description/image`; emit `article:published_time`/`article:author` when `jsonType="BlogPosting"` (via props)
- [x] 3.3 Create `src/lib/seo/schema.ts` (or co-locate) with per-template `extraJson` builders: `BlogPosting`, `VisualArtwork` (creator, dateCreated=year, artMedium=first technique, size=dimensions, offers only when available, image), `ArtGallery` (name/description/logo), `Person` (name/image/email/website/sameAs) — tolerant of null/empty fields
- [x] 3.4 `BlogPost.astro`: pass `jsonType="BlogPosting"` + BlogPosting `extraJson` (headline/author/datePublished/image/url)
- [x] 3.5 `BlogIndex.astro`: pass `jsonType="Blog"`
- [x] 3.6 `ArtworkPage.astro`: pass `jsonType="VisualArtwork"` + creator (artist name+url), dateCreated, artMedium, size, offers (priceCurrency via lang, only when available), image
- [x] 3.7 `GalleryPage.astro`: pass `jsonType="ArtGallery"` + name/description/logo
- [x] 3.8 `ArtistPage.astro` / `CuratorPage.astro`: pass `jsonType="Person"` + name/image/email/website/sameAs
- [x] 3.9 Confirm home/legal/index shells stay `LocalBusiness` (default)

## 4. Favicon assets + Layout wiring

- [x] 4.1 Copy the finalized icon set from `~/Downloads/icons/` into `public/` (favicon.svg, favicon.ico, favicon.png, apple-touch-icon.png, og-image.jpg, icon-192.png, icon-512.png), replacing the placeholder assets
- [x] 4.2 Verify `apple-touch-icon.png` is 180×180 opaque (0% transparency) and `og-image.jpg` is 1200×630
- [x] 4.3 `Layout.astro`: add `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` (SVG + ICO links already present); do NOT wire a `webmanifest` (deferred to a future change — `icon-192`/`icon-512` are shipped as versioned assets only)
- [x] 4.4 Confirm `BUSINESS_DATA.logo` (`/favicon.svg`) and `BUSINESS_DATA.ogImage` (`/og-image.jpg`) still point at the real files

## 5. i18n SEO key completion

- [x] 5.1 `src/messages/{en,es}.json`: add `pages.curator.keywords`
- [x] 5.2 `src/messages/{en,es}.json`: add `pages.artwork.{title,description,keywords}`
- [x] 5.3 `src/messages/{en,es}.json`: add `pages.legal.{privacy,terms,cookies}.keywords` (both locales)
- [x] 5.4 Verify symmetric against `validate-i18n` (build gate passes)

## 6. RSS feed

- [x] 6.1 Add `@astrojs/rss` dependency
- [x] 6.2 Create `src/pages/rss.xml.ts` (es) reusing `fetchAll(listPosts)` for published posts; emit localized es title/description/pubDate/author/link
- [x] 6.3 Create the English RSS route at `src/pages/en/rss.xml.ts` (`/en/rss.xml`); emit localized en fields and en post URLs
- [x] 6.4 Confirm feed fetch errors fail the build loudly (consistent with blog contract)
- [x] 6.5 Emit `<link rel="alternate" type="application/rss+xml">` head tags per locale in `Layout` (or per page near the SEO slot) pointing at each feed
- [x] 6.6 Reference the feed URL(s) in `src/pages/robots.txt.ts`

## 7. Analytics / tracking

- [x] 7.1 Add typed tracking env vars (GTM + GA4 IDs) to `env.d.ts`
- [x] 7.2 `Layout.astro`: inject GTM + GA4 `is:inline` snippets as one block gated by `import.meta.env.PROD`
- [x] 7.3 Confirm snippet absent in dev/noindex builds

## 8. Docs sync

- [x] 8.1 Rewrite `docs/astro-seo.md`: real schema + per-template types, correct `PageSEO` props, `Astro.site` origin, absolute alternates, no `x-default`, real RSS/GTM, corrected favicon snippet; remove never-built schema fiction
- [x] 8.2 Update `docs/component-dependencies.md` SEO chain note
- [x] 8.3 Update `docs/astro-i18n.md` and `docs/astro-site-config.md` SEO-localization references

## 9. Verification

- [x] 9.1 Run `pnpm build` (runs validate-i18n/imports/markdown/404) successfully
- [x] 9.2 Schema Markup Validator: home, blog index, blog post, artwork, gallery, artist, curator all valid
- [ ] 9.3 Lighthouse SEO/accessibility + PSI >90 (mobile & desktop)
- [x] 9.4 View-source spot-check: canonical/hreflang (absolute, no x-default)/OG/twitter/JSON-LD per template (route-map, slug, paginated, noindex)
- [x] 9.5 Verify all favicon/icon files (favicon.svg/ico/png, apple-touch-icon.png, og-image.jpg, icon-192/512) load with no 404s; confirm apple-touch-icon renders on device if available