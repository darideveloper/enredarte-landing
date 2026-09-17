## Why

The blog grid looks off-center and narrower than the landing page because the site has three competing container dialects: full-bleed landing sections (`px-6 md:px-14`, no cap), centered capped blocks (`mx-auto max-w-6xl`), and broken hybrids (`max-w-6xl` without `mx-auto`, which clamp width but stick left). Every non-landing page needs one shared horizontal-margin / max-width rule so all pages read as one site.

## What Changes

- Establish a two-tier container contract: **canvas** tier (full-bleed `px-6 md:px-14`, no max-width — galleries, grids, hero, immersive) and **reading** tier (`mx-auto max-w-6xl px-6 md:px-14`, legal keeps `max-w-3xl`).
- Migrate all pages and section organisms to the contract:
  - `BlogIndex.astro` (3 spots), `GalleryPage.astro` (header, artworks header, filters + missing section padding), `ArtistPage.astro` (inner grid cap), `BlogPost.astro` hero (2 spots), `CollectionIndex.astro`, `CuratorHero` / `CuratorSalas` inners, `BannerBar` (`md:px-12` → `md:px-14`).
  - Explicitly out of scope: `ArtworkPage` (bespoke immersive split), `LegalPage` measure (`max-w-3xl` stays), `PostCard` internals, grid spans, pagination, animations.
- Encode the contract once as a shared Tailwind `@utility` (or `Container.astro`) with `canvas` / `reading` / `narrow` variants so future pages cannot drift.
- Footer standard (decided): full-bleed section background + centered `max-w-6xl` inner — the one place a mismatch would otherwise remain visible.
- Landing reference sections (`Home` artworks collection, `Gallery`, `Header`) also adopt the canvas variant so the contract has zero hand-rolled page containers (pixel-identical output).

## Capabilities

### New Capabilities

- `page-container-system`: the two-tier horizontal container contract (canvas vs reading vs narrow), the exact Tailwind classes per tier, which pages/sections belong to which tier, and the shared utility/component that encodes it.

### Modified Capabilities

- None. Existing page specs describe content and behavior, not container widths; this change adds the container contract without altering those requirements.

## Impact

- Files: `src/components/pages/blog/BlogIndex.astro`, `src/components/pages/blog/BlogPost.astro`, `src/components/pages/sala/GalleryPage.astro`, `src/components/pages/artista/ArtistPage.astro`, `src/components/pages/index/CollectionIndex.astro`, `src/components/organisms/CuratorHero.astro`, `src/components/organisms/CuratorSalas.astro`, `src/components/organisms/BannerBar.astro` (class-only edits), `src/components/organisms/Footer.astro` (bleed section bg + centered inner), landing reference (`Home.astro`, `Gallery.astro`, `Header.astro`, pixel-identical adoption), plus one new shared utility/component and `src/styles/global.css` (if `@utility`).
- No API, routing, i18n, or data-layer changes. No new dependencies.
- Visual change on viewports wider than ~1152px: previously left-clamped blocks become full-bleed (canvas) or centered (reading). Mobile (<768px) unchanged (`px-6` everywhere already).
