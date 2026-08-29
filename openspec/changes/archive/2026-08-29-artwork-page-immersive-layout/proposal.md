## Why

The artwork detail page (`/obras/<slug>`) rendered its artwork inside a `max-w-6xl` container with a 50/50 two-column grid and a fixed `aspect-[4/5]` image box. On desktop the artwork — the page's entire reason to exist — was visually subordinate to the surrounding chrome. The change makes the artwork the dominant element: an immersive, full-height, edge-to-edge presentation where the image leads and the editorial info recedes into a fixed side panel. This also documents the supporting fixes (scroll-trigger header offset, pin-gap removal, base paper background, description color token) that make the immersive layout render cleanly. All of the above is already implemented in the working tree and documented here as the incumbent state; the only new feature this change introduces is repositioning the inquiry CTA to follow the artwork's spec data instead of anchoring to the bottom of the panel.

## What Changes

- **ArtworkPage layout**: replaced the constrained `max-w-6xl` + equal-column layout with an asymmetric full-bleed grid (`lg:grid-cols-[1fr_380px]` / `xl:grid-cols-[1fr_420px]`) with no horizontal container padding. The artwork image zone spans the full remaining viewport width; the info panel becomes a fixed-width companion column.
- **ArtworkImageViewer**: removed the fixed `aspect-[4/5]` box on desktop so images fill the full viewport height (`min-height: 100vh` at `lg`). The ScrollTrigger pin-and-scrub gallery now engages at `1024px` (was `768px`) to match the desktop-only immersive layout, and its pin `start` is offset to `top 80px` so the scrub begins immediately below the sticky header with no scroll dead-zone.
- **ArtworkInfoPanel**: switched from a bottom `border-t` divider to a left `border-l` gallery-wall separator; on `lg+` it becomes `sticky top-0 overflow-y-auto` with a height of `calc(100vh - 80px)` (viewport minus the pinned section's `top: 80px` offset, so the panel bottom aligns with the viewport bottom) with the inquiry CTA rendered in normal document flow after the spec data (spaced by the panel's `gap-8` rhythm, not anchored to the panel bottom). Title scales up (`lg:text-[2.75rem]`).
- **Body base background**: `<body>` in `Layout.astro` now carries `bg-paper`, so any viewport seam exposed by pinned elements or the page canvas renders in the paper tone instead of the browser-default white.
- **Description color token**: added `--color-description: #7A7568` to the Tailwind theme (`global.css`) and migrated the hardcoded `text-[#7A7568]` description text in `ArtworkInfoPanel`, `Hero`, and `GalleryPage` to the `text-description` utility.
- **Documentation**: created `PRODUCT.md`, `DESIGN.md`, and `.impeccable/design.json` (project product truth, design-system spec, and design metadata sidecar). These are documentation artifacts that describe the incumbent product and visual system; they are not behavior changes.

## Capabilities

### New Capabilities

- *(none — all behavior changes extend existing capabilities)*

### Modified Capabilities

- `artwork-detail-page`: the detail-page layout requirement changes from a constrained equal-column container to an immersive full-bleed asymmetric grid with a sticky fixed-width info panel.
- `artwork-viewer`: the scroll-scrub gallery now targets the immersive full-height layout — desktop breakpoint moves from 768px to 1024px, the pin `start` is header-aware (`top 80px`), and the image box is viewport-height instead of `4/5` aspect.
- `global-colors`: adds the `description` color token and the base `bg-paper` body background as part of the established token system.

## Impact

- **Components**: `src/components/pages/obra/ArtworkPage.astro`, `src/components/molecules/ArtworkImageViewer.astro`, `src/components/molecules/ArtworkInfoPanel.astro`
- **Layout**: `src/layouts/Layout.astro` (`<body>` gains `bg-paper`)
- **Theme**: `src/styles/global.css` (new `--color-description` token)
- **Migrated call sites**: `src/components/organisms/Hero.astro`, `src/components/pages/sala/GalleryPage.astro` (hardcoded hex → `text-description`)
- **Docs**: `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json` (new)
- **No API, dependency, or build-config changes.** Build verified via `pnpm build` (19 pages).