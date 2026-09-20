## Why

On artwork detail pages (`/obras/<slug>`), the right info panel was a fixed-height (`calc(100svh - 93px)`) independently scrolling box on desktop. Verified live on prod (`cien-miradas`, 1280x720): panel content was 959px in a 627px box, the buy button rendered at y=939 below the 720px viewport, and scrolling the page to the footer never moved the panel (`scrollTop` stayed 0). Users could reach the footer without ever seeing the buy button — the conversion slot was hidden behind an undiscoverable second scrollbar.

## What Changes

- The sticky role moves from the info panel to the image zone: the left column becomes a sticky stage (`lg:sticky lg:top-[93px] lg:h-[calc(100svh-93px)]`) while the info column flows in normal document flow.
- The artwork page keeps exactly one scrollbar on desktop; the footer is only reachable past the buy widget / status badge.
- The GSAP ScrollTrigger crossfade keeps its timeline, scrub, counter, and lifecycle but drops `pin: true`; the section itself (`start: "top 93px"`, `end: "bottom bottom"`) drives the scrub. The timeline is skipped when the section fits the viewport.
- The viewer reserves the stage height (`height: 100%` inside the sticky box) instead of `min-height: 100vh` on desktop.
- Mobile and `prefers-reduced-motion` stacked fallback is unchanged.

## Capabilities

### New Capabilities

None — no new user-facing capability is introduced.

### Modified Capabilities

- `artwork-detail-page`: layout requirement changes from fixed info panel to sticky image stage with flowing info panel under a single page scroll; CTA reachability is now a page-scroll property.
- `artwork-viewer`: scrub requirement changes from pinned section (`pin: true`, end derived from image count) to pin-less scrub against the sticky stage (`end: "bottom bottom"`, skipped when the section fits the viewport); desktop display-box reservation follows the stage height.

## Impact

- Touched: `src/components/pages/obra/ArtworkPage.astro`, `src/components/molecules/ArtworkInfoPanel.astro`, `src/components/molecules/ArtworkImageViewer.astro`.
- Synced: `openspec/specs/artwork-detail-page/spec.md`, `openspec/specs/artwork-viewer/spec.md`, `docs/component-dependencies.md`.
- No new dependencies, no API changes, no route changes, no copy changes. Mobile layout and reduced-motion behavior are unaffected.
