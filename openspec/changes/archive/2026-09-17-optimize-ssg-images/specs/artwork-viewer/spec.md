## MODIFIED Requirements

### Requirement: Single deterministic scrub initialization
The artwork image viewer SHALL initialize its GSAP ScrollTrigger scrub gallery exactly once per page view. A new initialization MUST first revert any previously created `gsap.matchMedia()` instance before creating a new one, and the viewer MUST NOT initialize both at module-evaluation time and again on `astro:page-load`.

#### Scenario: Initial page load initializes once
- **WHEN** the artwork page loads
- **THEN** exactly one ScrollTrigger timeline is created for the viewer, and no stale/duplicate pin-spacer remains in the DOM

#### Scenario: Client-side navigation re-initializes cleanly
- **WHEN** the user navigates to an artwork page via an Astro View Transition
- **THEN** `astro:after-swap` reverts the prior `matchMedia` instance and `astro:page-load` creates a single fresh timeline

### Requirement: Scroll-scrub reveals sequential images on desktop
For viewports at or above 1024px with `prefers-reduced-motion: no-preference`, the viewer SHALL pin the artwork section and progressively reveal each additional image as the user scrolls, updating the `1 / N` counter in sync with scroll progress. The pin SHALL engage when the section's top reaches the bottom of the sticky header (`start: "top 80px"`).

#### Scenario: Scrolling advances the gallery
- **WHEN** a multi-image artwork (2+ images) is viewed on a desktop viewport (≥1024px) with motion allowed and the user scrolls through the pinned range
- **THEN** each subsequent image becomes visible in sequence and the counter reflects the active image index

#### Scenario: Scrub engages immediately below the header
- **WHEN** the user scrolls on a multi-image artwork at desktop width
- **THEN** the pin-and-scrub begins as soon as the section top reaches 80px from the viewport top, with no dead-zone where the user scrolls without animation

#### Scenario: Single-image artwork shows a static image
- **WHEN** an artwork has exactly one image
- **THEN** the viewer renders a single static image with no ScrollTrigger and no counter

### Requirement: Pin is measured against final layout
After the scrub timeline is (re)created, the viewer MUST call `ScrollTrigger.refresh()` so the pinned trigger is measured after images and fonts have settled. The measured pin range SHALL NOT be zero/collapsed.

#### Scenario: Pin range is valid after load
- **WHEN** the viewer initializes on a multi-image artwork
- **THEN** the ScrollTrigger end is computed from the final layout (non-zero scroll distance) so the scrub actually progresses

### Requirement: Primary image is preloaded
The artwork page MUST pass the primary artwork image to `<Layout>` as `preloadImage` so the browser fetches the responsive variant via `<link rel="preload" as="image" imagesrcset imagesizes fetchpriority="high">` before render.

#### Scenario: No hero pop-in on load
- **WHEN** the artwork page loads
- **THEN** the primary image variant matching the viewer `sizes` is preloaded (no plain-`href`/double-download) and rendered without a deferred pop-in flash

### Requirement: No load-time layout shift or blink
The viewer SHALL reserve its display box at full viewport height on desktop (`min-height: 100vh` at ≥1024px) and at a minimum of `60vh` on viewports below 1024px, so decoding images does not cause a layout shift or blink on load.

#### Scenario: Images reserve space before decode
- **WHEN** the artwork page loads and images decode
- **THEN** no visible reflow/blink occurs because the image container's display box is reserved at full viewport height

### Requirement: Reduced-motion and mobile fallback stacks images
For `prefers-reduced-motion: reduce` OR viewports below 1024px, the viewer SHALL render all images stacked vertically (no pin, no scrub). Stacked images SHALL display at a `4/5` aspect ratio. This behavior is preserved from the current implementation, with the mobile threshold aligned to the immersive desktop breakpoint.

#### Scenario: Reduced-motion user sees stacked images
- **WHEN** a user with `prefers-reduced-motion: reduce` (desktop or mobile) views a multi-image artwork
- **THEN** all images are displayed stacked and the `1 / N` counter reads the total count, with no scroll animation

#### Scenario: Tablet and mobile see stacked images
- **WHEN** a multi-image artwork is viewed below 1024px (mobile or tablet)
- **THEN** images are displayed stacked in full-width rows at a `4/5` aspect ratio with no pin-and-scrub

### Requirement: Verification via automated browser check
The change SHALL be verified with the `playwright-cli` skill: load a multi-image artwork on desktop (motion allowed), scroll through the pinned range, and assert that the visible image and the `1 / N` counter change, that the scrub engages immediately (no dead-zone below the header), and that the primary image is preloaded (no late pop-in).

#### Scenario: Playwright confirms scrub and preload
- **WHEN** the Playwright check runs against a multi-image artwork page
- **THEN** scrolling changes the displayed image and counter, the scrub begins below the sticky header, and the network/preload confirms the primary image was preloaded

## ADDED Requirements

### Requirement: Viewer first image is LCP with responsive sizes
The viewer SHALL render `images[0]` with `loading="eager" fetchpriority="high"` and `sizes="(max-width:1024px) 100vw, calc(100vw - 380px)"` (`widths [960,1600,2400]`), and remaining slides with `loading="lazy"` and identical `sizes`, preserving scrub, counter, and stacked fallback.

#### Scenario: First paint fetches right-sized LCP
- **WHEN** an artwork page loads on desktop
- **THEN** only the first-image variant matching `calc(100vw-380px)` is high-priority; hidden slides defer
