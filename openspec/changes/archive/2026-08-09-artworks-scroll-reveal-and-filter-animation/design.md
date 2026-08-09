## Context

See `proposal.md` for motivation and background.

`src/components/pages/landing/Home.astro` renders the Artworks collection section wrapping `Title`, `Filters`, and `Artworks`.

## Goals / Non-Goals

**Goals:**
- Target `<section id="artworks-collection">` in `Home.astro`.
- Add `artworks-header` to `Title` container, `filter-pill` class to filter buttons in `Filters.astro` / `FilterBtn.astro`, and `artwork-card-item` class to `Artworks.astro`.
- Add client `<script>` module constructing:
  1. `ScrollTrigger` reveal for header (`y: 30 → 0`), filter pills (`x: -15 → 0`), and artwork grid items (`y: 35 → 0`, `stagger: 0.08`).
  2. Tab click event listener on `.filter-pill` elements that animates `.artwork-card-item` elements with a GSAP scale/fade refresh (`fromTo({ scale: 0.96, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04 })`).
- Clear inline transform and opacity props upon completion.

**Non-Goals:**
- Breaking SSR HTML output or static SEO metadata.

## Decisions

### Decision 1: Target Selector Structure
- **Approach**: Keep `FilterBtn.astro` and `ImageCard.astro` intact while adding target animation classes (`filter-pill`, `artwork-card-item`).
- **Rationale**: Preserves atomic design hierarchy and existing prop signatures.

## Risks / Trade-offs

- **[Risk]**: Re-hydration on Astro View Transitions.
- **[Mitigation]**: Bind animation setup to `document.addEventListener("astro:page-load", initArtworksAnimation)`.
