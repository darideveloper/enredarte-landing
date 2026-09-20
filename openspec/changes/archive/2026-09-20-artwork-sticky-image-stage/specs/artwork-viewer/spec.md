## MODIFIED Requirements

### Requirement: Single deterministic scrub initialization
The artwork image viewer SHALL initialize its GSAP ScrollTrigger scrub gallery exactly once per page view. A new initialization MUST first revert any previously created `gsap.matchMedia()` instance before creating a new one, and the viewer MUST NOT initialize both at module-evaluation time and again on `astro:page-load`.

#### Scenario: Initial page load initializes once
- **WHEN** the artwork page loads
- **THEN** exactly one ScrollTrigger timeline is created for the viewer, and no stale/duplicate trigger remains in the DOM

#### Scenario: Client-side navigation re-initializes cleanly
- **WHEN** the user navigates to an artwork page via an Astro View Transition
- **THEN** `astro:after-swap` reverts the prior `matchMedia` instance and `astro:page-load` creates a single fresh timeline

### Requirement: Scroll-scrub reveals sequential images on desktop
For viewports at or above 1024px with `prefers-reduced-motion: no-preference`, the viewer SHALL progressively reveal each additional image as the user scrolls the section (pin-less scrub inside the sticky image stage), updating the `1 / N` counter in sync with scroll progress. The scrub SHALL engage when the section's top reaches the bottom of the sticky header (`start: "top 93px"`) and complete when the section's bottom reaches the viewport bottom (`end: "bottom bottom"`), with no `pin`.

#### Scenario: Scrolling advances the gallery
- **WHEN** a multi-image artwork (2+ images) is viewed on a desktop viewport (≥1024px) with motion allowed and the user scrolls through the section
- **THEN** each subsequent image becomes visible in sequence and the counter reflects the active image index

#### Scenario: Scrub engages immediately below the header
- **WHEN** the user scrolls on a multi-image artwork at desktop width
- **THEN** the scrub begins as soon as the section top reaches the header's bottom edge, with no dead-zone where the user scrolls without animation

#### Scenario: Single-image artwork shows a static image
- **WHEN** an artwork has exactly one image
- **THEN** the viewer renders a single static image with no ScrollTrigger and no counter

## RENAMED Requirements

- FROM: `### Requirement: Pin is measured against final layout`
- TO: `### Requirement: Scrub trigger is measured against final layout`

## MODIFIED Requirements

### Requirement: Scrub trigger is measured against final layout
After the scrub timeline is (re)created, the viewer MUST call `ScrollTrigger.refresh()` so the trigger is measured after images and fonts have settled. The measured scrub range SHALL NOT be zero/collapsed; when the section fits the viewport (no scroll distance to drive the scrub) the timeline SHALL be skipped and the first image shown statically.

#### Scenario: Scrub range is valid after load
- **WHEN** the viewer initializes on a multi-image artwork
- **THEN** the ScrollTrigger end is computed from the final layout (non-zero scroll distance) so the scrub actually progresses

### Requirement: No load-time layout shift or blink
The viewer SHALL reserve its display box at the sticky stage height on desktop (`calc(100svh - 93px)` at ≥1024px) and at a minimum of `60vh` on viewports below 1024px, so decoding images does not cause a layout shift or blink on load.

#### Scenario: Images reserve space before decode
- **WHEN** the artwork page loads and images decode
- **THEN** no visible reflow/blink occurs because the image container's display box is reserved at the sticky stage height on desktop (and at least `60vh` below `1024px`)

### Requirement: Verification via automated browser check
The change SHALL be verified with the `playwright-cli` skill: load a multi-image artwork on desktop (motion allowed), scroll through the section, and assert that the visible image and the `1 / N` counter change, that the scrub engages immediately (no dead-zone below the header), that the page keeps a single scrollbar with no nested panel scroll, that the buy widget is passed before the footer, and that the primary image is preloaded (no late pop-in).

#### Scenario: Playwright confirms scrub and preload
- **WHEN** the Playwright check runs against a multi-image artwork page
- **THEN** scrolling changes the displayed image and counter, the scrub begins below the sticky header, the page scrolls with a single scrollbar, the buy widget passes through the viewport before the footer, and the network/preload confirms the primary image was preloaded
