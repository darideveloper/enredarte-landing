## MODIFIED Requirements

### Requirement: Render the artwork detail layout
The artwork page SHALL render an immersive two-part layout: the artwork images on the **left** spanning the full remaining viewport width (no `max-w-6xl` container and no horizontal padding), and a fixed-width editorial info panel on the **right** (`lg:grid-cols-[1fr_380px]`, `xl:grid-cols-[1fr_420px]`), reusing existing atoms (`Image`, `Headline`, `Btn`) and the established paper/ink/crimson visual language. Clipping for the absolute-positioned image layers SHALL be scoped to the image zone so no `overflow` ancestor of the info panel vetoes its `position: sticky`.

#### Scenario: Layout shows full-bleed images left, info right
- **GIVEN** an artwork with images and metadata
- **WHEN** the artwork detail page renders at `lg` viewport or wider
- **THEN** the image viewer occupies the full-bleed left column and the info panel occupies a fixed-width right column with no horizontal container padding

#### Scenario: Info panel is sticky on desktop
- **GIVEN** an artwork detail page at `lg` viewport or wider
- **WHEN** the user scrolls through the pinned image viewer
- **THEN** the info panel stays fixed in the viewport (`sticky`, `top: 93px`, height `calc(100svh - 93px)`, `overflow-y-auto`) with a left border separator, and its bottom aligns with the viewport bottom

#### Scenario: Mobile stacks image above info
- **GIVEN** an artwork detail page below `lg` viewport
- **WHEN** the page renders
- **THEN** the image stacks full-width above the info panel, and the info panel uses a top border separator instead of the left border

#### Scenario: Localized content renders
- **GIVEN** an artwork opened in Spanish
- **THEN** the title and description render in Spanish (from the artwork's translation dictionary)

### Requirement: Scroll-driven multi-image viewer
For an artwork with more than one image, the image viewer SHALL be pinned via the installed GSAP `ScrollTrigger` while a scrubbed timeline cycles through the artwork's images (crossfading and/or translating) as the user scrolls, with the right info panel remaining fixed for the duration of the pin. The pin SHALL engage once the pinned section's top reaches the bottom of the sticky header (`start: "top 93px"`) so the scrub begins immediately with no scroll dead-zone. The pin SHALL end once the last image has been reached. The scrubbed timeline SHALL use `ease: "none"` and SHALL animate the image children, never the pinned element itself.

#### Scenario: Multiple images scrub on scroll
- **GIVEN** an artwork with three images
- **WHEN** the user scrolls through the pinned section on desktop
- **THEN** the viewer transitions through the three images in order, and the info panel stays fixed
- **AND** once the third image is reached, the pin releases and normal page scroll resumes

#### Scenario: Scrub begins below the sticky header
- **GIVEN** a multi-image artwork and the sticky header at the top of the viewport
- **WHEN** the user starts scrolling
- **THEN** the pinned scrub engages immediately when the section top reaches the header's bottom edge (`top 93px`), with no initial scroll distance without animation

#### Scenario: Reduced-motion preference disables pinning
- **GIVEN** the user has `prefers-reduced-motion: reduce` active
- **WHEN** the artwork detail page renders
- **THEN** the images display without the pin-and-scrub effect (e.g. stacked or shown statically), via `gsap.matchMedia()`
