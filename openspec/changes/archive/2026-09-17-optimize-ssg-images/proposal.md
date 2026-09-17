## Why

Artwork images are the LCP on almost every page and currently load as full-size backend originals via plain `<img>` (no `astro:assets`, no `srcset/sizes`, no `sharp`). Prod is slow on mobile because a 360px phone downloads the same 2400px+ file as a desktop. This change makes the SSG build emit right-sized AVIF/WebP variants per visible slot, keeping full quality at the rendered size while cutting transfer 70-90%.

## What Changes

- Enable build-time image optimization: add `sharp`, configure `image.domains/remotePatterns` for the dashboard/CDN host so remote artwork/blog/curator photos can be downloaded and transformed during `astro build`.
- Migrate the `Image` atom plus blog hero/cards (`BlogPost` hero, `PostCard`) to `astro:assets` with per-layout `widths + sizes`, `formats AVIF/WebP`, explicit `width/height` (CLS-safe), `loading/decoding/fetchpriority` per position. CMS markdown body images stay native lazy (documented out-of-scope).
- Fix LCP loading: `eager + fetchpriority=high` + `<link preload with imagesrcset/imagesizes>` for Hero, Gallery hero, ArtworkViewer first image, Artist portrait, BlogPost hero; keep grids/body `lazy + decoding=async`.
- Move optimized locals (`logo*.png|webp`, hero fallback) from `public/` to `src/assets/`; keep favicons and `og-image.jpg` in `public/` (`og-image.jpg` keeps a stable social-crawler URL — the ~9KB saving isn't worth cache churn).
- Fix delivery: nginx immutable cache for `.avif`, no double-download preloads, hidden viewer slides deferred.
- No visual redesign, no crop changes, no backend API contract change.

## Capabilities

### New Capabilities

- `ssg-responsive-images`: build-time responsive variants (widths/sizes/formats/quality) per image slot, remote allowlist, sharp pipeline, fallback to original on transform failure.
- `lcp-image-priority`: eager/high/preload contract for above-the-fold images with responsive preload (imagesrcset), single-LCP-per-page rule.

### Modified Capabilities

- `image-atom`: REQUIREMENTS change from plain `<img>` passthrough to optimized `astro:assets` contract (widths/sizes/formats/dimensions/priority props, defaults lazy/async).
- `image-banner`: REQUIREMENTS change to forward `loading/fetchpriority` and accept responsive props (currently swallowed).
- `image-card-molecule`: REQUIREMENTS change to accept responsive `sizes` variants (normal vs large/featured) instead of single full-size src.
- `image-row-card`: REQUIREMENTS change to emit half-width responsive sizes (`100vw` mobile / `50vw` desktop).
- `artwork-viewer`: REQUIREMENTS change to eager-load first image as LCP and lazy-load remaining slides with same sizes.
- `logo-atom`: REQUIREMENTS change to include intrinsic dimensions + decoding/fetchpriority.
- `blog`: REQUIREMENTS change for banner hero responsive sizes + explicit eager (currently implicit) and PostCard responsive sizes.
- `post-card`: REQUIREMENTS change for responsive card sizes incl. featured `lg:col-span-2` variant.

## Impact

- Affected: `astro.config.mjs` (image allowlist), `package.json` (sharp), `src/components/atoms/Image.astro`, `ImageBanner.astro`, `ImageCard.astro`, `ImageRowCard.astro`, `ArtworkImageViewer.astro`, `Logo.astro`, `CuratorCard/Hero`, `GalleryPage`, `ArtistPage`, `Home`, `CollectionIndex`, `CuratorSalas`, `BlogPost`, `PostCard`, `lib/markdown.ts` (documented as out-of-scope for srcset), `layouts/Layout.astro` + `pages/[...path].astro` (preload), `nginx.conf` (avif), `public/` vs `src/assets/` locals.
- Build: longer `astro build` (remote download + encode per artwork × widths × formats); Docker build stage needs sharp native deps; per-image fallback to verbatim URL + warning on transform failure (only JSON fetch stays fail-fast).
- Runtime: no adapter/server change, still static nginx; smaller transfer, same URLs for HTML pages, new hashed `/_astro/*` assets with `1y immutable`.
