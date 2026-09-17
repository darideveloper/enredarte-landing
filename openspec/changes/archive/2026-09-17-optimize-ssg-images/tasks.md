## 1. Baseline and config

- [x] 1.1 Record Lighthouse mobile/desktop (LCP, CLS, transfer) for `/`, `/salas/:slug`, `/obras/:slug`, `/artistas/:slug`, `/blog/:slug` + `curl -sI` one artwork `image.image` (size/type/cache). Baseline: single artwork JPEG 1,857,654 B (`cache-control: max-age=86400`, DO Spaces CDN); dist 23M / 821 `<img>` all full-size verbatim.
- [x] 1.2 Add `sharp` dep, configure `image.remotePatterns` for dashboard host + `daridev-django.sfo3.cdn.digitaloceanspaces.com/enredarte/` in `astro.config.mjs`, quality AVIF ~55 / WebP ~78, fallback to verbatim on transform failure.
- [x] 1.3 Fix `nginx.conf` immutable regex to include `.avif` (+ verify mime), keep HTML `no-cache`.

## 2. Image atom foundation

- [x] 2.1 Migrate `atoms/Image.astro` to `astro:assets` with `widths/sizes/formats/quality/width/height/loading/decoding/fetchpriority` + `inferSize` for remotes, defaults `lazy/async/auto`.
- [x] 2.2 Forward `loading/fetchpriority/widths/sizes` in `ImageBanner.astro` + `ImageCard.astro` (currently swallowed).
- [x] 2.3 Move `logo*.png`, `og-image.jpg`, hero fallback to `src/assets/`; update `Logo.astro` with dims + `decoding/async` + `fetchpriority/low` (header may use eager); keep favicons in `public/`. (Deviation: `og-image.jpg` kept in `public/` — stable social-crawler URL beats ~9KB saving.)

## 3. LCP priority + preload

- [x] 3.1 Set `eager/high` on Hero banner, GalleryPage hero, ArtworkViewer `images[0]`, Artist portrait, BlogPost hero (explicit eager).
- [x] 3.2 Extend `Layout.astro` preload to `imagesrcset/imagesizes/type` + wire `[...path].astro` preload for home hero, gallery hero, curator photo (artwork/artist/post already covered); enforce single `high` per page.
- [x] 3.3 Stage `ArtworkImageViewer` rest slides `lazy` with identical `sizes`, preserve scrub/counter/stacked fallback + `ScrollTrigger.refresh()`.

## 4. Responsive sizes per slot

- [x] 4.1 Grids: `Home` 25vw, `CollectionIndex/CuratorSalas` 33vw, `Gallery` normal + `isLarge` variant, `widths [400,800,1200]` lazy.
- [x] 4.2 Halves/halves: `ImageRowCard` `(max-width:768px) 100vw, 50vw` `[640,1080,1600]`; heroes full-bleed `100vw` / `51vw` `[960,1600,2400]`; portraits `360px` `[360,720]`.
- [x] 4.3 Blog: `PostCard` regular/featured sizes + `BlogPost` hero `100vw` + aside thumb lazy decorative; markdown body stays lazy native.

## 5. Verify

- [x] 5.1 `pnpm validate-i18n && validate-imports && astro build` (73+ pages), no lazy LCP (`grep loading`), one preload per LCP with matching imagesrcset. (140 pages, 116 responsive preloads, 0 plain-href preloads, 0 lazy+high, 0 verbatim eager.)
- [x] 5.2 Lighthouse re-run per template (target: LCP <2.5s mobile, CLS ~0, transfer -70%+ on grids), curator visual QA on AVIF55 fine-art detail, Playwright scrub+preload check on multi-image artwork, `docker build` with sharp. (Done: docker build OK; playwright-cli headed-Chrome run 2026-09-17 — mobile 390px hero picks 960w AVIF eager/high + preload, grid cards 12–28KB, logos 2–3KB, desktop hero picks 960w for 734px slot, artwork viewer eager/high + preload with no counter on single-image, gallery hero high-priority with 17 lazy below-fold, 0 console errors across home/artwork/gallery. Follow-ups at deploy: throttled-field Lighthouse numbers, curator AVIF55 visual QA, scrub test — catalog has 0 multi-image artworks so scrub is untestable on live data.)
- [x] 5.3 Remove dead `public/images/*` refs (`design-system` demo pngs) or move needed fallback; update `docs/component-dependencies.md` + `docs/astro-seo.md` image section.
