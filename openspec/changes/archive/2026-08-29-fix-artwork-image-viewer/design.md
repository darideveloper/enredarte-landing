## Context

`ArtworkImageViewer.astro` builds a desktop scroll-scrub gallery with GSAP ScrollTrigger. It is rendered by `ArtworkPage.astro` inside `Layout.astro`, and the site uses Astro View Transitions (`ClientRouter`). The viewer `<script>` currently calls `initScrub()` directly at module evaluation **and** binds it to `astro:page-load`, while `astro:after-swap` reverts a module-scoped `mm` (matchMedia) instance. `gsap.ts` also calls `ScrollTrigger.refresh()` on `astro:page-load`. The primary image is never preloaded because `ArtworkPage.astro` does not forward `preloadImage` to `Layout` (which already supports it).

Observed symptoms:
- Desktop scroll never changes the image → the scrub ScrollTrigger is mis-measured/stuck (double-init leaves a fresh trigger that is never refreshed against final layout).
- Load-time blink → pin-spacer thrash from double-init + primary image pop-in (not preloaded) + potential image decode reflow.

## Goals / Non-Goals

**Goals:**
- Exactly one scrub initialization per page view; clean revert on SPA navigation.
- Correct pin measurement so the scrub actually progresses on desktop.
- Eliminate the load-time blink (preload + reserved image box).
- Keep the existing GSAP scrub and the reduced-motion/mobile stacked fallback.

**Non-Goals:**
- Changing the visual design, layout grid, or info panel.
- Replacing GSAP with another animation library.
- Changing reduced-motion/mobile behavior beyond preserving it.
- Any backend/API changes.

## Decisions

**D1 — Single init path via `astro:page-load` only.**
Remove the direct `initScrub()` call at the bottom of the `<script>`. Rely on `astro:page-load` for initial and SPA-init, and `astro:after-swap` for revert. Rationale: the direct call is redundant with the `astro:page-load` handler and is the root of the double-init (pin-spacer created → reverted → recreated). Alternative considered: a module-scoped `initialized` boolean guard — rejected because it would break SPA re-init after navigation.

**D2 — Explicit `ScrollTrigger.refresh()` after creating the timeline.**
Inside `initScrub`, after `mm = gsap.matchMedia()` and the `mm.add(...)` branches register, call `ScrollTrigger.refresh()`. Rationale: `gsap.ts` refreshes on `astro:page-load` but its listener may run before this `initScrub` creates the new trigger (listener order), leaving the new pinned trigger un-refreshed until `window load` (which may have already fired). Explicit refresh guarantees correct measurement. Alternative: move refresh into `gsap.ts` ordering — rejected as fragile/order-dependent.

**D3 — Forward `preloadImage` to `Layout`.**
`ArtworkPage.astro` does NOT render `<Layout>` — the route `src/pages/[...path].astro` does. So `preloadImage` is computed there from the artwork's primary image (`siteData.artworks` → `is_primary` ?? first image) and passed as `preloadImage` to `<Layout>`, so `Layout.astro:26` emits the `<link rel="preload" fetchpriority="high">`. `ArtworkPage.astro` is unchanged. No change to `Layout` needed.

**D4 — Reserve the image box to prevent decode reflow.**
Scope the safeguard to the viewer only: ensure the `.artwork-image` (or its inner `<img>`) has an explicit `aspect-ratio: 4/5` / fixed dimensions so the container reserves space before the image decodes. Prefer applying this in `ArtworkImageViewer.astro` (via the existing `aspect-[4/5]` container and ensuring the `<img>` fills it with `h-full w-full`) rather than modifying the shared `Image.astro` atom, to avoid side effects on other usages.

## Risks / Trade-offs

- **[Risk]** Calling `ScrollTrigger.refresh()` on every `astro:page-load` may cause a brief re-measurement reflow on navigation. → Mitigation: refresh is cheap and only runs on artwork pages where the viewer script is present; acceptable trade-off for correct pinning.
- **[Risk]** Removing the direct `initScrub()` call could delay first paint of the scrub if `astro:page-load` fires later than expected. → Mitigation: `astro:page-load` fires reliably on full loads in Astro; the static image is visible immediately regardless, so no blank state.
- **[Risk]** Preload of a large primary image adds a high-priority request. → Mitigation: only the single primary image is preloaded; consistent with existing `Layout` behavior for other pages.

## Migration Plan

No migration needed — purely internal to the viewer. Rollback = revert the three edited files to previous versions (no schema/data impact).

## Open Questions

- None blocking. Optional: whether to also add `loading="eager"` to the primary viewer `<img>` (currently default `lazy` via plain `<img>` with no attribute) — deferred to implementation if the preload alone does not remove the pop-in.
