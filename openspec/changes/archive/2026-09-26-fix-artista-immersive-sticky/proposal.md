## Why

`/artistas/{slug}` reuses `ImageRowCard[immersive]` like `/salas/{slug}`, but its info cards don't stick at `md:top-[35svh]` while tall artwork images scroll. Same component, different page wrapper and reveal animation — the artist page silently lost the immersive sticky parity.

## What Changes

- `#artista-obras` section in `ArtistPage.astro`: remove `overflow-hidden` so the `md:sticky` info wrapper can stick to the viewport (sala section has no `overflow-hidden`).
- `ArtistPage.astro` reveal script: replace the group `gsap.fromTo(rows, …, trigger: works)` tween with per-row `gsap.fromTo(Array.from(row.children), …, trigger: row, start: "top 85%")`, copied from `GalleryPage.astro`, so the sticky wrapper itself is never animated.
- Keep header fade, featured `ImageBanner` fade, and `#artista-salas` grid stagger unchanged. No API, i18n, routing, or data-model changes.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `scroll-reveal-sections`: artista rows reveal inner cells only via per-row triggers instead of animating whole rows with a single section trigger.
- `artist-detail-page`: artworks section preserves immersive sticky parity with sala; no `overflow:hidden` ancestor above sticky rows.

## Impact

- `src/components/pages/artista/ArtistPage.astro` — section class + `<script>` reveal block only.
- Untouched: `GalleryPage.astro`, `ImageRowCard.astro`, `ImageBanner.astro`, `Artworks` island, `src/lib/gsap.ts`, routing/SSG in `[...path].astro`, SEO.
- `docs/component-dependencies.md`: no import change, no update needed.
