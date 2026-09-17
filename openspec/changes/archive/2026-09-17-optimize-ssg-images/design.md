## Context

Fully static SSG (`[...path].astro getStaticPaths()` → `buildSiteData()`, `dist/` → `nginx:alpine`, no adapter). All artwork/curator/artist/blog images are absolute backend URLs rendered verbatim via plain `<img>` (`Image.astro` wrapper, raw `<img>` in blog/markdown). No `astro:assets`, no `sharp`, no `image.domains`, no `srcset/sizes`. LCP images (Hero, Gallery hero, ArtworkViewer first, Artist portrait) inherit `loading=lazy` or lack preload. `nginx` long-caches `/_astro/` but omits `.avif`. Locals live in `public/` (verbatim copy, unoptimized).

## Goals / Non-Goals

**Goals:**
- Right-sized AVIF/WebP per visible slot (phone 400w → desktop 1600-2400w) at equal-or-better visual quality, 70-90% transfer cut.
- One eager/high LCP per page with responsive preload; everything else lazy/async.
- CLS-safe (explicit dims / constrained layout), no crop/design change.
- Fail-safe build: single bad remote never fails whole site.

**Non-Goals:**
- No art-direction crop changes (`object-cover` vs natural ratio preserved), no CDN/image-service migration, no markdown-body srcset pipeline, no runtime `/_image` endpoint, no backend API change.

## Decisions

- **Pure Astro build-time (sharp + remotePatterns) over backend thumbs/CDN.** Why: zero backend change, fits SSG (all slugs known at build), keeps static nginx. Alternative backend thumbs rejected (needs Django work); CDN transforms deferred (cost/infra, revisit if catalog >1000s images makes build painful).
- **Per-component `sizes`, not global.** Why: 25vw card vs 100vw hero need different strings or bytes are wrong (see explore Q&A table). Alternative single `sizes="100vw"` rejected (wastes 4× on grids, blurs heroes if inverted).
- **Widths tiers:** cards `[400,800,1200]`, half-width `[640,1080,1600]`, full-bleed `[960,1600,2400]`; portraits/logos fixed-ish `[360,720]`. Why: covers 1×/2× DPR for each slot with 3 entries (build cost control). Alternative 7-width exhaustive rejected (encode × formats explosion).
- **`formats ['avif','webp']` + original fallback, quality AVIF ~55 / WebP ~78.** Why: max compression at best quality for rendered size + curator QA; fallback covers odd CMYK/progressive JPEGs sharp can't parse.
- **`inferSize` for remotes, explicit dims for locals.** Why: remotes lack build-known dims; locals get checked-in dims for CLS without runtime probe.
- **Responsive preload (`imagesrcset+imagesizes`), single LCP.** Why: plain `href` preload double-downloads once srcset resolves; two `high` images compete.
- **Locals to `src/assets/`, favicons stay in `public/`.** Why: only `src/assets/` flows through optimizer; `public/` is verbatim.
- **Viewer staging (img0 eager, rest lazy).** Why: scrub needs all slides in DOM but not all bytes on first paint.

## Risks / Trade-offs

- [Build time/memory blowup: N artworks × widths × formats] → cap to 3 widths/slot, AVIF-first for LCP only if needed, measure `astro build` before/after on full catalog.
- [sharp native in `node:22-alpine` Docker] → add apk `vips` deps or `sharp` prebuilt; verify `docker build` in CI.
- [Remote 500/timeout fails build] → per-image try/catch fallback to verbatim URL + warning; only JSON fetch stays fail-fast.
- [AVIF encode slow + old-browser fallback] → keep WebP + original fallback; nginx add `avif` to immutable regex + correct mime.
- [Markdown CMS images uncontrolled] → documented out-of-scope, stay lazy.
- [GSAP scrub pin measured before optimized images settle] → keep `ScrollTrigger.refresh()` after load; CLS box already reserved.

## Migration Plan

1. Land config+deps+atom (`image.domains`, `sharp`, `Image` responsive props) behind existing visuals (byte-identical crop).
2. Roll out per-component `sizes` + LCP flags + preloads page by page (home → gallery → artwork → artist/curator → blog).
3. Move locals, fix nginx avif, delete dead `public/images/*` except fallback (or move it).
4. Lighthouse before/after per template; rollback = revert to verbatim `src` (atom keeps `fallbackSrc` path).

## Resolved Decisions (user answers)

- Hosts: dashboard same-base `API_BASE_URL` + DigitalOcean Spaces CDN `https://daridev-django.sfo3.cdn.digitaloceanspaces.com/enredarte/` → both in `image.remotePatterns`.
- Quality: max compression AVIF ~55 / WebP ~78 with curator QA on fine-art detail.
- Catalog: small (<100 artworks) → pure build-time sharp, 3 widths/slot, no CDN phase needed.
- Crop: keep `object-cover` uniform grid (no design change); rows stay natural ratio.
- Preload: all LCPs (home + gallery + artwork + artist/curator + blog hero) with responsive imagesrcset.
- Budget: LCP <2.5s mobile + grid transfer -70%+ declares done.
