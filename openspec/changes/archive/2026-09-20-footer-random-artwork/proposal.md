## Why

Visitors browsing the collection have no serendipitous path to discovery — every route requires choosing a specific sala, artist, or artwork. A one-click "random artwork" entry point in the footer gives a low-cost discovery moment on every page.

## What Changes

- New React atom `RandomArtworkBtn` (`.tsx`) that picks a random available artwork slug and navigates same-tab to its localized detail page (`/obras/<slug>` / `/en/obras/<slug>`).
- `Footer` nav column gains the button as its last list item, styled as a distinct button (not a plain link).
- `Layout` gains an optional `artworkSlugs` pass-through prop to `Footer`.
- `[...path].astro` computes `availableSlugs` at build time (`status === "available"`) and passes them into `Layout`.
- New i18n keys `global.footer.random`: es "Descubrir una obra", en "Discover an artwork".
- `docs/component-dependencies.md` refreshed (Layout/Footer import change per repo rule).

## Capabilities

### New Capabilities

- `random-artwork-button`: random available-artwork navigation button (pick, exclude-current, hide-when-empty, localized label, same-tab navigation).

### Modified Capabilities

- `footer-organism`: nav column gains a trailing random-artwork entry sourced from build-time available slugs; all other footer requirements unchanged.

## Impact

- Affected code: `src/components/atoms/RandomArtworkBtn.tsx` (new), `src/components/organisms/Footer.astro`, `src/layouts/Layout.astro`, `src/pages/[...path].astro`, `src/messages/es.json`, `src/messages/en.json`, `docs/component-dependencies.md`.
- No new dependencies; reuses `getLocalizedArtworkPath`, existing React/`client:load` island pattern, and `zustand`-free props-only state.
- Every page ships one small additional `client:load` island (React hydration cost on all pages — accepted per explicit requirement).
