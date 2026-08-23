## Context

The site is a single-route Astro app: `src/pages/[...path].astro` is the only page, an i18n catch-all driven by `getStaticPaths()` that calls `buildSiteData()` (src/data/api.ts:119) once and threads the shared `SiteData` prop to page components via `COMPONENT_MAP` (`home: Home`, `gallery: GalleryPage`). Gallery detail pages (`/salas/<slug>`, `/es/salas/<slug>`) already follow this pattern (src/pages/[...path].astro:23-32).

Every artwork card is a dead end today: `toArtworkView` hardcodes `href: "#"` (src/data/api.ts:201). The `Artwork` type (src/lib/api/types.ts:122-138) already carries everything a detail page needs — `images[]` (multi-image, `is_primary`, per-language alt), localized `title`/`description`, `artist` ref, `year`, `dimensions`, five taxonomy ref arrays, `price_mxn`/`price_usd`, `status`, and `gallery_links`. GSAP + `ScrollTrigger` are installed and registered in `src/lib/gsap.ts`, which already re-measures on `astro:page-load` (src/lib/gsap.ts:22-25); `Hero.astro` demonstrates the `gsap.matchMedia()` + `astro:after-swap` revert + `astro:page-load` re-init lifecycle.

Visual language (src/styles/global.css): paper `#F2EDE4` ground, ink `#1A1A1A`, crimson `#C41E3A` accents, serif display + sans body, uppercase micro-eyebrows at `tracking-[0.2em]`, generous editorial whitespace (`px-6 md:px-14`, `py-16 md:py-24`), `border-b border-border-theme` dividers, and dark `bg-ink text-paper` contrast blocks (see `CuratorCard`).

## Goals / Non-Goals

**Goals:**
- A build-time generated artwork detail page per artwork, both languages, via the existing catch-all.
- A scroll-driven multi-image viewer (images **left**) with a fixed editorial info panel (right) using the installed GSAP `ScrollTrigger` pin + scrub.
- Real artwork `href`s everywhere (`toArtworkView`), slug-preserving language switch, localized SEO.
- Reuse existing atoms (`Image`, `Headline`, `Btn`) and the `LangBtns` path-override prop introduced by the gallery-detail work.

**Non-Goals:**
- No artist detail pages — the info panel shows the artist name, not a separate artist route.
- No backend changes — `buildSiteData()` already fetches all artwork data.
- No zoom/lightbox; no horizontal scrolling; no purchase/checkout.
- No changes to the homepage/gallery filter behavior.

## Decisions

### 1. Extend the catch-all route (mirror the gallery-detail pattern)
`getStaticPaths()` in `[...path].astro` iterates `siteData.artworks` and emits `{ path: "obras/<slug>" }` (es, root — same as galleries) and `{ path: "en/obras/<slug>" }` (en, `en/` prefix — same as galleries) with `props: { pageKey: "artwork", artworkSlug, lang, siteData }`; add `artwork: ArtworkPage` to `COMPONENT_MAP`. Rationale: one routing mechanism, Astro's sitemap picks up every path, and the locale prefix mirrors the gallery-detail loop exactly (`getLocalizedSalaPath` returns `/salas/<slug>` for es and `/en/salas/<slug>` for en; `routes.ts` has no artwork entry, so the paths are hardcoded in `getStaticPaths()` just like the gallery loop, not derived from `routes`).

### 2. New page component `ArtworkPage.astro` + a detail view builder
`ArtworkPage` lives at `src/components/pages/obra/ArtworkPage.astro` (mirroring `pages/landing/Home.astro` and `pages/sala/GalleryPage.astro`). It looks up the artwork by slug from `siteData.artworks`, resolves the artist name, and renders:
- a **scroll-driven image viewer** molecule on the left,
- an **editorial info panel** molecule on the right (title, artist, year, dimensions, description, price/status, spec rows).

Add `toArtworkDetailView(artwork, siteData, lang)` in `src/data/api.ts` that resolves: primary + non-primary images (each with localized alt), localized title/description, artist name, formatted prices, status, and localized taxonomy labels via the existing `getFacetLabel` (src/data/api.ts:213). Reuse `getLocalizedSalaPath`'s style to add `getLocalizedArtworkPath(slug, lang)`.

### 3. Scroll-driven multi-image viewer with ScrollTrigger pin + scrub
Structure: a section holding a left column (the image stack, absolutely-positioned, all images layered in one viewport-sized box) and a right column (the info panel — a child that stays visually fixed because the **section itself** is pinned, not the panel independently).

```
┌──────────────────────────────────────────────┐
│  ┌──────────────────┐        ┌────────────┐  │
│  │ images (left):   │  pin   │ info panel │  │
│  │  img1            │  +     │ (fixed)    │  │
│  │  img2  ─ scrub──▶│ scrub  │            │  │
│  │  img3            │        └────────────┘  │
│  └──────────────────┘                        │
└──────────────────────────────────────────────┘
```

- `ScrollTrigger.create({ trigger: section, start: "top top", end: "+=N%", pin: true, scrub: 1 })` where the end is sized by the image count (e.g. `+=100%` per extra image).
- A timeline (with `ease: "none"`) crossfades and/or translates the images (animate children only — never the pinned element). Active image alt/index drives an optional counter.
- Wrapped in `gsap.matchMedia()`:
  - `(min-width: …)` — enable the pin+scrub on desktop; stack the images normally on small screens.
  - `(prefers-reduced-motion: reduce)` — skip pin/scrub, render images stacked statically.
- Lifecycle: `mm.revert()` on `astro:after-swap`, re-init on `astro:page-load` — the exact pattern in `Hero.astro:114-115`. `ScrollTrigger.refresh()` already runs on load/page-load via `src/lib/gsap.ts`.

### 4. Single-image / edge-case fallback
If an artwork has zero or one image, the viewer renders a single static `Image` with no pin/scrub — the section degrades to a normal two-column layout. The scrub timeline and pin are only created when `images.length > 1`.

### 5. Language switch + SEO
Reuse the `LangBtns` optional path-override prop (added in the gallery-detail work) to link `/obras/<slug>` (es) ↔ `/en/obras/<slug>` (en), threaded through `Layout` → `Header` from `[...path].astro` via `getLocalizedArtworkPath`. Emit `PageSEO` with explicit localized `title`/`description`/`ogImage` (primary image).

### 6. i18n labels
Add detail-page labels (status, spec-table headers — discipline: "Disciplina", technique: "Técnica", theme: "Temática", format: "Formato", scale: "Escala" — plus CTA labels) to `src/messages/en.json` and `es.json` in the same key shape to satisfy `validate-i18n` parity. Note: `year` and `dimensions` are top-level fields shown above the spec list, not spec-table headers. Artwork title/description and taxonomy labels come from data, not message files.

## Risks / Trade-offs

- **Pin duration tuned to image count** → Mitigation: derive `end` from `images.length` so more images scroll further; cap the total to avoid excessive scroll for photo-heavy works.
- **ScrollTrigger on a route with View Transitions** → Mitigation: follow the established `astro:after-swap` revert + `astro:page-load` re-init lifecycle; `src/lib/gsap.ts` already refreshes on navigation.
- **Layout shift / CLS from layered images** → Mitigation: constrain the viewer to a fixed aspect/viewport box so images load without pushing content; reuse the adaptive-aspect work where relevant.
- **Reduced-motion and mobile** → Mitigation: `gsap.matchMedia()` disables pin/scrub on `prefers-reduced-motion` and stacks images on small screens.
- **Artwork with one image** → Mitigation: static single-image fallback, no pin.
- **Sparse optional fields** → Mitigation: info panel omits missing rows (price/description) without error, per spec.
- **Info panel taller than the viewport during the pin** → Mitigation: constrain the info panel to viewport height (`height: 100vh` / `h-screen`) with internal `overflow-y: auto` when the content (title + long description + spec table + CTA) exceeds the viewport, so it never gets clipped while the section is pinned.

## Migration Plan

No runtime migration (static site). Rollback = revert the change's commits; artwork `href`s return to `"#"` and the catch-all drops the `artwork` page key. `buildSiteData()` is unchanged, so the API data source is untouched.

## Open Questions

- Whether a "related works" strip (fed by `gallery_links`) belongs on this page — deferred; not in current scope.
- Exact pin distance per image and whether the viewer uses crossfade, translate, or both — decide in implementation with the design system.
- Whether the info panel should also link to the artist (a future artist-detail capability) — deferred.
