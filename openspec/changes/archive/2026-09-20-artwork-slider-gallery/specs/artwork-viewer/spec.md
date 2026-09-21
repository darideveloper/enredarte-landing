# artwork-viewer Specification (delta)

## MODIFIED Requirements

### Requirement: Single deterministic scrub initialization
The artwork image viewer SHALL initialize its GSAP ScrollTrigger scrub gallery at most once per view, and only when it is given more than one image. A new initialization MUST first revert any previously created `gsap.matchMedia()` instance before creating a new one, and the viewer MUST NOT initialize both at module-evaluation time and again on `astro:page-load`. When the viewer renders a single image, it SHALL take the static branch and SHALL NOT create a timeline or counter. The artwork detail page currently supplies the primary image only, so this page exercises the static branch.

#### Scenario: Detail page renders the static branch
- **GIVEN** an artwork detail page (which passes only the primary image to the viewer)
- **WHEN** the page loads
- **THEN** the viewer renders a single static image with no ScrollTrigger timeline and no counter

#### Scenario: Multi-image input initializes once
- **WHEN** the viewer is given two or more images on a desktop viewport with motion allowed
- **THEN** exactly one ScrollTrigger timeline is created and any prior `matchMedia` instance is reverted first

### Requirement: Scroll-scrub reveals sequential images only when given multiple
Only when the viewer is supplied with more than one image on a desktop viewport (≥1024px, `prefers-reduced-motion: no-preference`) SHALL it progressively reveal each additional image as the user scrolls the section (pin-less scrub inside the sticky image stage), updating the `1 / N` counter in sync with scroll progress. The scrub SHALL engage when the section's top reaches the bottom of the sticky header (`start: "top 93px"`) and complete when the section's bottom reaches the viewport bottom (`end: "bottom bottom"`), with no `pin`. This path is defensive: the artwork detail page passes only the primary image, so it does not engage there.

#### Scenario: Multi-image scroll advances the gallery
- **WHEN** the viewer is given a multi-image artwork (2+ images) on desktop with motion allowed and the user scrolls
- **THEN** each subsequent image becomes visible in sequence and the counter reflects the active image index

#### Scenario: Single-image artwork shows a static image
- **WHEN** the viewer renders an artwork with exactly one image
- **THEN** the viewer renders a single static image with no ScrollTrigger and no counter

### Requirement: Viewer first image is LCP with responsive sizes
When the viewer renders a one-image (or first) slide with `loading="eager" fetchpriority="high"`, it SHALL use `sizes="(max-width:1024px) 100vw, calc(100vw - 400px)"` (`widths [960,1600,2400]`), and remaining slides with `loading="lazy"` and identical `sizes`. On the artwork detail page the primary (single) image SHALL use the eager/high-priority variant matching these sizes so the preloaded bytes equal the rendered variant.

#### Scenario: First paint fetches right-sized LCP
- **WHEN** an artwork page loads on desktop
- **THEN** the primary image variant matching `calc(100vw - 400px)` is high-priority; no other slides are eagerly fetched