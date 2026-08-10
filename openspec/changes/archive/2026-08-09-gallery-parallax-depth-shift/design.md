## Context

See `proposal.md` for motivation and background.

`src/components/organisms/Gallery.astro` renders the 5-card bento grid. We will add wrapper target classes (`gallery-header`, `gallery-card-large`, `gallery-card-item`) and a client `<script>` module.

## Goals / Non-Goals

**Goals:**
- Target `Title` container with `.gallery-header`.
- Wrap the featured card with `.gallery-card-large` and standard cards with `.gallery-card-item`.
- Implement initial entrance reveal for header and cards on scroll entry (`start: "top 80%"`).
- Implement smooth scroll-scrubbed parallax movement on `.gallery-card-large` (`gsap.to(".gallery-card-large", { y: -20, scrollTrigger: { trigger: "#salas-gallery", start: "top bottom", end: "bottom top", scrub: 1.2 } })`).

**Non-Goals:**
- Disabling or interfering with `ImageCard` hover zoom effects (`group-hover:scale-105`).

## Decisions

### Decision 1: Media Query Guard for Parallax
- **Approach**: Wrap the parallax scrub animation inside `ScrollTrigger.matchMedia({ "(min-width: 768px)": ... })` or window width check.
- **Rationale**: On mobile screens, bento grid items stack vertically into a single column where vertical parallax shift could cause unnatural overlaps or awkward gaps.

## Risks / Trade-offs

- **[Risk]**: Conflict between parallax `y` transform and `ImageCard` hover styles.
- **[Mitigation]**: Apply parallax transform to the wrapper `div` of `ImageCard` rather than directly to internal hover target elements.
