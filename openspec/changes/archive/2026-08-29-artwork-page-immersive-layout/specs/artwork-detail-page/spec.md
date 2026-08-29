## ADDED Requirements

### Requirement: Inquiry CTA follows the spec data
The inquiry CTA SHALL render in normal document flow directly after the artwork's spec list, spaced by the info panel's standard `gap-8` rhythm, and SHALL NOT be anchored to the bottom of the panel container.

#### Scenario: CTA renders after the spec data
- **GIVEN** an artwork detail page with spec rows in the info panel
- **WHEN** the page renders
- **THEN** the inquiry CTA appears directly after the spec list in normal document flow, spaced by the panel's standard vertical gap

#### Scenario: CTA does not overflow short viewports
- **GIVEN** a desktop viewport whose height is short enough that the sticky info panel's content exceeds the viewport
- **WHEN** the page renders
- **THEN** the inquiry CTA remains inside the scrollable panel and does not overflow the panel or the viewport

## MODIFIED Requirements

### Requirement: Render the artwork detail layout
The artwork page SHALL render an immersive two-part layout: the artwork images on the **left** spanning the full remaining viewport width (no `max-w-6xl` container and no horizontal padding), and a fixed-width editorial info panel on the **right** (`lg:grid-cols-[1fr_380px]`, `xl:grid-cols-[1fr_420px]`), reusing existing atoms (`Image`, `Headline`, `Btn`) and the established paper/ink/crimson visual language.

#### Scenario: Layout shows full-bleed images left, info right
- **GIVEN** an artwork with images and metadata
- **WHEN** the artwork detail page renders at `lg` viewport or wider
- **THEN** the image viewer occupies the full-bleed left column and the info panel occupies a fixed-width right column with no horizontal container padding

#### Scenario: Info panel is sticky on desktop
- **GIVEN** an artwork detail page at `lg` viewport or wider
- **WHEN** the user scrolls through the pinned image viewer
- **THEN** the info panel stays fixed in the viewport (`sticky top-0`, height `calc(100vh - 80px)`, `overflow-y-auto`) with a left border separator, and its bottom aligns with the viewport bottom

#### Scenario: Mobile stacks image above info
- **GIVEN** an artwork detail page below `lg` viewport
- **WHEN** the page renders
- **THEN** the image stacks full-width above the info panel, and the info panel uses a top border separator instead of the left border

#### Scenario: Localized content renders
- **GIVEN** an artwork opened in Spanish
- **THEN** the title and description render in Spanish (from the artwork's translation dictionary)

### Requirement: Scroll-driven multi-image viewer
For an artwork with more than one image, the image viewer SHALL be pinned via the installed GSAP `ScrollTrigger` while a scrubbed timeline cycles through the artwork's images (crossfading and/or translating) as the user scrolls, with the right info panel remaining fixed for the duration of the pin. The pin SHALL engage once the pinned section's top reaches the bottom of the sticky header (`start: "top 80px"`) so the scrub begins immediately with no scroll dead-zone. The pin SHALL end once the last image has been reached. The scrubbed timeline SHALL use `ease: "none"` and SHALL animate the image children, never the pinned element itself.

#### Scenario: Multiple images scrub on scroll
- **GIVEN** an artwork with three images
- **WHEN** the user scrolls through the pinned section on desktop
- **THEN** the viewer transitions through the three images in order, and the info panel stays fixed
- **AND** once the third image is reached, the pin releases and normal page scroll resumes

#### Scenario: Scrub begins below the sticky header
- **GIVEN** a multi-image artwork and the sticky header at the top of the viewport
- **WHEN** the user starts scrolling
- **THEN** the pinned scrub engages immediately when the section top reaches the header's bottom edge (`top 80px`), with no initial scroll distance without animation

#### Scenario: Reduced-motion preference disables pinning
- **GIVEN** the user has `prefers-reduced-motion: reduce` active
- **WHEN** the artwork detail page renders
- **THEN** the images display without the pin-and-scrub effect (e.g. stacked or shown statically), via `gsap.matchMedia()`

### Requirement: Viewer lifecycle follows the shared GSAP pattern
The scrubbed timeline SHALL be reverted on `astro:after-swap` and re-initialized on `astro:page-load`, following the existing `src/lib/gsap.ts` lifecycle.

#### Scenario: Lifecycle hooks revert and re-initialize
- **WHEN** `astro:after-swap` fires during a client-side navigation
- **THEN** the previous `gsap.matchMedia()` context is reverted
- **AND** when `astro:page-load` fires, the scrubbed timeline is re-initialized for the new page