## Purpose

Defines the required behavior of the artwork image viewer (`src/components/molecules/ArtworkImageViewer.astro`), rendered by the artwork detail page (`src/components/pages/obra/ArtworkPage.astro`) inside `src/layouts/Layout.astro`. It covers deterministic single initialization of the GSAP ScrollTrigger scrub gallery, correct pin measurement, primary-image preload, and no load-time blink, across desktop (motion allowed), reduced-motion, and mobile. The reduced-motion / mobile stacked-image fallback is preserved from the prior implementation.

## Requirements

### Requirement: Single deterministic scrub initialization
The artwork image viewer SHALL initialize its GSAP ScrollTrigger scrub gallery exactly once per page view. A new initialization MUST first revert any previously created `gsap.matchMedia()` instance before creating a new one, and the viewer MUST NOT initialize both at module-evaluation time and again on `astro:page-load`.

#### Scenario: Initial page load initializes once
- **WHEN** the artwork page loads
- **THEN** exactly one ScrollTrigger timeline is created for the viewer, and no stale/duplicate pin-spacer remains in the DOM

#### Scenario: Client-side navigation re-initializes cleanly
- **WHEN** the user navigates to an artwork page via an Astro View Transition
- **THEN** `astro:after-swap` reverts the prior `matchMedia` instance and `astro:page-load` creates a single fresh timeline

### Requirement: Scroll-scrub reveals sequential images on desktop
For viewports at or above 768px with `prefers-reduced-motion: no-preference`, the viewer SHALL pin the artwork section and progressively reveal each additional image as the user scrolls, updating the `1 / N` counter in sync with scroll progress.

#### Scenario: Scrolling advances the gallery
- **WHEN** a multi-image artwork (2+ images) is viewed on desktop with motion allowed and the user scrolls through the pinned range
- **THEN** each subsequent image becomes visible in sequence and the counter reflects the active image index

#### Scenario: Single-image artwork shows a static image
- **WHEN** an artwork has exactly one image
- **THEN** the viewer renders a single static image with no ScrollTrigger and no counter

### Requirement: Pin is measured against final layout
After the scrub timeline is (re)created, the viewer MUST call `ScrollTrigger.refresh()` so the pinned trigger is measured after images and fonts have settled. The measured pin range SHALL NOT be zero/collapsed.

#### Scenario: Pin range is valid after load
- **WHEN** the viewer initializes on a multi-image artwork
- **THEN** the ScrollTrigger end is computed from the final layout (non-zero scroll distance) so the scrub actually progresses

### Requirement: Primary image is preloaded
The artwork page MUST pass the primary artwork image to `<Layout>` as `preloadImage` so the browser fetches it via `<link rel="preload" fetchpriority="high">` before render.

#### Scenario: No hero pop-in on load
- **WHEN** the artwork page loads
- **THEN** the primary image is preloaded and rendered without a deferred pop-in flash

### Requirement: No load-time layout shift or blink
The viewer `<img>` elements SHALL reserve their display box (explicit aspect-ratio / dimensions) so decoding images does not cause a layout shift or blink on load.

#### Scenario: Images reserve space before decode
- **WHEN** the artwork page loads and images decode
- **THEN** no visible reflow/blink occurs because the image container's box is reserved

### Requirement: Reduced-motion and mobile fallback stacks images
For `prefers-reduced-motion: reduce` OR viewports below 768px, the viewer SHALL render all images stacked vertically (no pin, no scrub). This behavior is preserved from the current implementation.

#### Scenario: Reduced-motion user sees stacked images
- **WHEN** a user with `prefers-reduced-motion: reduce` (desktop or mobile) views a multi-image artwork
- **THEN** all images are displayed stacked and the `1 / N` counter reads the total count, with no scroll animation

### Requirement: Verification via automated browser check
The change SHALL be verified with the `playwright-cli` skill: load a multi-image artwork on desktop (motion allowed), scroll through the pinned range, and assert that the visible image and the `1 / N` counter change, and that the primary image is preloaded (no late pop-in).

#### Scenario: Playwright confirms scrub and preload
- **WHEN** the Playwright check runs against a multi-image artwork page
- **THEN** scrolling changes the displayed image and counter, and the network/preload confirms the primary image was preloaded
