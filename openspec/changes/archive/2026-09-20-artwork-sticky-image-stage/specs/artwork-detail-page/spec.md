## MODIFIED Requirements

### Requirement: Inquiry CTA follows the spec data
The conversion slot of the info panel SHALL render in normal document flow directly after the artwork's spec list, spaced by the info panel's standard `gap-8` rhythm, and SHALL NOT be anchored to the bottom of the panel container. For artworks with catalog `status == "available"` the slot SHALL host the buy widget (currency + email + submit) instead of the mailto inquiry CTA; for any other status it SHALL host the corresponding status badge. The full buy-widget behavior (request, redirect, error states, badges) is specified in `artwork-purchase`.

#### Scenario: CTA renders after the spec data
- **GIVEN** an artwork detail page with spec rows in the info panel
- **WHEN** the page renders
- **THEN** the conversion slot appears directly after the spec list in normal document flow, spaced by the panel's standard vertical gap

#### Scenario: CTA does not overflow short viewports
- **GIVEN** a desktop viewport whose height is short enough that the info panel's content exceeds the viewport
- **WHEN** the page renders
- **THEN** the page keeps a single scrollbar and the conversion slot is reached via normal page scroll — it never hides inside a nested scrollable panel

#### Scenario: Available artwork hosts the buy widget
- **GIVEN** an artwork with `status == "available"`
- **WHEN** the page renders
- **THEN** the conversion slot contains the buy widget and no mailto inquiry CTA

### Requirement: Render the artwork detail layout
The artwork page SHALL render an immersive two-part layout: the artwork images on the **left** spanning the full remaining viewport width (no `max-w-6xl` container and no horizontal padding), and a fixed-width editorial info panel on the **right** (`lg:grid-cols-[1fr_380px]`, `xl:grid-cols-[1fr_420px]`), reusing existing atoms (`Image`, `Headline`, `Btn`) and the established paper/ink/crimson visual language. Clipping for the absolute-positioned image layers SHALL be scoped to the image zone so no `overflow` ancestor of the info panel vetoes its `position: sticky`.

#### Scenario: Layout shows full-bleed images left, info right
- **GIVEN** an artwork with images and metadata
- **WHEN** the artwork detail page renders at `lg` viewport or wider
- **THEN** the image viewer occupies the full-bleed left column and the info panel occupies a fixed-width right column with no horizontal container padding

#### Scenario: Image stage is sticky on desktop
- **GIVEN** an artwork detail page at `lg` viewport or wider
- **WHEN** the user scrolls through the info panel
- **THEN** the image zone stays fixed in the viewport (`sticky`, `top: 93px`, height `calc(100svh - 93px)`) with a left border separator on the flowing info column, and the page keeps a single scrollbar so the footer is only reachable past the conversion slot

#### Scenario: Mobile stacks image above info
- **GIVEN** an artwork detail page below `lg` viewport
- **WHEN** the page renders
- **THEN** the image stacks full-width above the info panel, and the info panel uses a top border separator instead of the left border

#### Scenario: Localized content renders
- **GIVEN** an artwork opened in Spanish
- **THEN** the title and description render in Spanish (from the artwork's translation dictionary)

### Requirement: Scroll-driven multi-image viewer
For an artwork with more than one image, a scrubbed GSAP `ScrollTrigger` timeline SHALL cycle through the artwork's images (crossfading and/or translating) as the user scrolls the section, while the sticky image stage holds the viewport and the info panel flows past it in normal page scroll. The timeline SHALL use the section as trigger (`start: "top 93px"`, `end: "bottom bottom"`, no `pin`) so the scrub begins once the section's top reaches the bottom of the sticky header (`start: "top 93px"`) with no scroll dead-zone and completes when the section's bottom reaches the viewport bottom. The scrubbed timeline SHALL use `ease: "none"` and SHALL animate the image children, never the stage element itself.

#### Scenario: Multiple images scrub on scroll
- **GIVEN** an artwork with three images
- **WHEN** the user scrolls through the section on desktop
- **THEN** the viewer transitions through the three images in order while the image stage stays sticky and the info panel scrolls past it
- **AND** once the third image is reached and the section ends, normal page scroll continues to the footer

#### Scenario: Scrub begins below the sticky header
- **GIVEN** a multi-image artwork and the sticky header at the top of the viewport
- **WHEN** the user starts scrolling
- **THEN** the scrub engages immediately when the section top reaches the header's bottom edge (`top 93px`), with no initial scroll distance without animation

#### Scenario: Reduced-motion preference disables scrub
- **GIVEN** the user has `prefers-reduced-motion: reduce` active
- **WHEN** the artwork detail page renders
- **THEN** the images display without the scrub effect (e.g. stacked or shown statically), via `gsap.matchMedia()`
