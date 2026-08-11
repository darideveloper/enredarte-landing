## Why

The "Colección completa" filter rows scroll horizontally by snapping `scrollLeft` directly on every wheel event, so a clicky mouse wheel (or a fast trackpad) jumps the chips in harsh, discrete steps. The scroll works but feels rough next to the rest of the page, and the user asked for a buttery-smooth horizontal scroll with the same visible UI.

## What Changes

- Replace `FilterRow`'s wheel handler in `Filters.tsx` so horizontal scrolling eases instead of snapping: wheel/trackpad input accumulates a target offset and a `gsap.ticker` frame loop lerps `scrollLeft` toward it.
- Keep the existing drag-to-scroll gesture as direct manipulation (dragging already feels natural and must not fight the user).
- Keep the current visual layer unchanged: hidden scrollbar, `overflow-x-auto` chip row, and the paper-gradient edge fades driven by the existing `scroll`/`resize` listeners.
- Respect `prefers-reduced-motion`: users who request reduced motion scroll without smoothing.
- No new dependencies (GSAP is already a project dependency) and no new files.

## Capabilities

### New Capabilities
- `catalog-filter-scroll`: Defines how the "Colección completa" filter rows translate wheel/trackpad input into smoothed horizontal scrolling while preserving the existing visual treatment, drag gesture, and reduced-motion fallback.

### Modified Capabilities
<!-- None: the existing `filters-molecule` and `catalog-filter-availability` specs describe rendering and viability, not scroll feel. -->

## Impact

- `src/components/molecules/Filters.tsx` — `FilterRow` wheel-handling effect replaced with a `gsap.ticker`-based smoothing loop (`gsap` imported direct from the package; the `@/lib/gsap` shared module is not SSR-safe for a React island).
- `gsap` — already in `dependencies` (`^3.12.7`); core engine only, no additional plugins.
- `docs/component-dependencies.md` — unchanged (no components added, removed, or re-scoped).
- No store, data, or i18n changes.