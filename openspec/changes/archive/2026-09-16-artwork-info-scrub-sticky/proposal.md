## Why

On artwork detail pages (`/obras/<slug>`), the info panel declares `lg:sticky lg:top-0` but its ancestor `section.overflow-hidden` vetoes `position:sticky`, the `80px` header offset in both the panel height and the ScrollTrigger `start` does not match the real sticky header height, and single-image artworks get no stickiness fallback. Visibility during scrub works only as a side-effect of pinning the whole section.

## What Changes

- Replace the hardcoded `80px` offset with a single measured header token shared by `ArtworkInfoPanel` (`top` + height) and `ArtworkImageViewer` ScrollTrigger `start`.
- Switch `100vh` to `100svh` for the panel height so short viewports and browser chrome do not clip the CTA.
- Move `overflow-hidden` clipping from the `section` to the image zone so CSS `sticky` is not vetoed, keeping image-bleed clipping intact.
- Keep pinning the whole `[data-scroll-section]` for multi-image desktop scrub; keep mobile `<1024px` and `prefers-reduced-motion` stacked fallback unchanged.
- Update `docs/component-dependencies.md` artwork-detail note.

## Capabilities

### New Capabilities

- None — no new user-facing capability; this is a robustness fix.

### Modified Capabilities

- `artwork-detail-page`: info-panel sticky offset/height requirement changes (header token, `svh`, `overflow-hidden` scope).
- `artwork-viewer`: pin `start` offset requirement changes (same header token instead of hardcoded `80px`).

## Impact

- `src/components/pages/obra/ArtworkPage.astro` (section overflow scope).
- `src/components/molecules/ArtworkInfoPanel.astro` (sticky `top`, height, `self-start`).
- `src/components/molecules/ArtworkImageViewer.astro` (ScrollTrigger `start` only; trigger/`end`/lifecycle unchanged).
- `docs/component-dependencies.md` (artwork-detail note).
- No API, routing, i18n, or SEO changes. No new dependencies.
