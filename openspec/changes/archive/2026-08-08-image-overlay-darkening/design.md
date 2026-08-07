## Context

See `proposal.md` for motivation and background.

Currently `ImageBanner.astro` has no dark overlay element over its `<Image />`, making text readability dependent on the brightness of the artwork image. `ImageCard.astro` uses hardcoded inline image filters (`brightness-[0.62] group-hover:brightness-[0.42] transition-all duration-[6s]`).

## Goals / Non-Goals

**Goals:**
- Introduce a unified `overlay?: 'hover' | 'darker' | 'always' | 'none'` and optional `darkenOnHover?: boolean` prop in `ImageBanner.astro` and `ImageCard.astro`.
- Insert a gradient overlay element (`absolute inset-0 pointer-events-none transition-all duration-300`) between the `<Image />` component and overlaid content.
- Use `overlay="darker"` on `ImageBanner` in `Hero.astro` for constant high-contrast hero readability.
- Adjust `ImageCard.astro` transition speed from `duration-[6s]` to `duration-500` for responsive visual feedback.

**Non-Goals:**
- Altering existing layout dimensions or image aspect ratio props.

## Decisions

### Decision 1: Absolute gradient overlay div vs uniform CSS brightness filter
- **Approach**: Insert an absolute gradient overlay div `bg-gradient-to-t from-black/... via-black/... to-transparent` between `<Image />` and text content.
- **Rationale**: Gradient overlays preserve upper artwork detail while guaranteeing high contrast legibility behind text at the bottom.
- **Alternatives Considered**: Uniform `brightness-[0.5]` filter on the `<img>` tag. Rejected because uniform darkening makes the entire artwork dull instead of selectively darkening where text resides.

### Decision 2: Default overlay mode per component
- **Approach**: Default `ImageBanner.astro` and `ImageCard.astro` to `overlay="hover"`, while explicitly passing `overlay="darker"` in `Hero.astro`.
- **Rationale**: Hero headers demand strong static contrast at first page load, whereas grid cards benefit from interactive hover darkening.

## Risks / Trade-offs

- **[Risk]**: Z-index stacking context hiding text under the overlay.
- **[Mitigation]**: Place overlay div before card text content in DOM hierarchy, keeping text content at higher z-index (`z-10` / relative).
