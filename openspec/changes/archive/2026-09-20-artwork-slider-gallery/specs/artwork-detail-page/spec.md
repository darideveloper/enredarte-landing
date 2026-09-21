# artwork-detail-page Specification (delta)

## MODIFIED Requirements

### Requirement: Render the artwork detail layout
The artwork page SHALL render an immersive hero: the artwork's **primary image** on the **left** spanning the full remaining viewport width (no `max-w-6xl` container and no horizontal padding) and a fixed-width editorial info panel on the **right** (`lg:grid-cols-[1fr_380px]`, `xl:grid-cols-[1fr_420px]`), reusing existing atoms (`Image`, `Headline`, `Btn`) and the established paper/ink/crimson visual language. Clipping for the absolute-positioned image layers SHALL be scoped to the image zone so no `overflow` ancestor of the info panel vetoes its `position: sticky`. Below the hero the page SHALL render the artist + gallery section (artist card and image slider) as specified in `artwork-slider-gallery`.

#### Scenario: Layout shows full-bleed primary image left, info right
- **GIVEN** an artwork with images and metadata
- **WHEN** the artwork detail page renders at `lg` viewport or wider
- **THEN** the primary image occupies the full-bleed left column and the info panel occupies a fixed-width right column with no horizontal container padding

#### Scenario: Image stage is sticky on desktop
- **GIVEN** an artwork detail page at `lg` viewport or wider
- **WHEN** the user scrolls through the info panel
- **THEN** the image zone stays fixed in the viewport (`sticky`, `top: 93px`, height `calc(100svh - 93px)`) with a left border separator on the flowing info column, and the page keeps a single scrollbar so the footer is only reachable past the conversion slot

#### Scenario: Mobile stacks image above info
- **GIVEN** an artwork detail page below `lg` viewport
- **WHEN** the page renders
- **THEN** the primary image stacks full-width above the info panel, and the info panel uses a top border separator instead of the left border

#### Scenario: Gallery section follows the hero
- **GIVEN** an artwork detail page with a resolvable artist or at least one image
- **WHEN** the page renders
- **THEN** the artist + gallery section renders below the hero per `artwork-slider-gallery`

## REMOVED Requirements

### Requirement: Scroll-driven multi-image viewer
**Reason**: The immersive hero now renders only the primary image; the remaining gallery images moved into the bounded Swiper slider described by `artwork-slider-gallery`. A scrubbed GSAP timeline over layered hero images no longer drives the hero on this page.
**Migration**: The full gallery is available in the artist + gallery section; the slider frames all images uncropped via `object-contain`.

### Requirement: Viewer lifecycle follows the shared GSAP pattern
**Reason**: Since the hero receives only the primary image, no scrubbed timeline is created on this page and no `astro:after-swap` / `astro:page-load` revert-reinitialize lifecycle is needed for the hero viewer.
**Migration**: Any multi-image reveal behavior is now owned by the slider in the gallery section; the `ArtworkImageViewer` static branch renders the single hero image.