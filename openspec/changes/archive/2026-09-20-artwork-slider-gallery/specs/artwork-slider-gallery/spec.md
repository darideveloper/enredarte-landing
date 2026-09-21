# artwork-slider-gallery Specification

## Purpose
Defines the gallery section rendered on the artwork detail page below the immersive hero: a dark, content-height `ArtistCard` on the left (sticky at the top on desktop) and a bounded Swiper React slider of all artwork images on the right, composed in a single `lg:grid-cols-[380px_1fr]` grid. The slider shows every image — including single-image artworks — at true ratio and without cropping, via a single `object-contain` framing class on a flex-centered slide (no per-orientation logic) on paper background with no self-advancing motion.

## ADDED Requirements

### Requirement: Gallery section renders below the hero when there is an artist or images
The artwork detail page SHALL render a gallery section below the immersive hero whenever an artist resolves or the artwork has at least one image. The section SHALL be `bg-paper container-site-canvas` and contain a `lg:grid-cols-[380px_1fr]` grid. When no artist resolves, the grid SHALL contain only the image slider; when there are no images, only the artist card; when neither exists the section SHALL NOT render.

#### Scenario: Artist and images present
- **GIVEN** an artwork with a resolvable artist and at least one image
- **WHEN** the artwork detail page renders
- **THEN** a gallery section renders with the artist card in the left column and the image slider in the right column

#### Scenario: Artist missing, images present
- **GIVEN** an artwork with images but no resolvable artist
- **WHEN** the detail page renders
- **THEN** the gallery section renders with only the image slider

#### Scenario: Images missing, artist present
- **GIVEN** an artwork with a resolvable artist but no images
- **WHEN** the detail page renders
- **THEN** the gallery section renders with only the artist card

#### Scenario: Neither present
- **GIVEN** an artwork with no images and no resolvable artist
- **WHEN** the detail page renders
- **THEN** no gallery section is rendered

### Requirement: Artist card shows the artist at content height and sticks on desktop
The left gallery card SHALL be the `ArtistCard` molecule: dark `bg-ink` with the artist name linked to the artist detail page, `global.artist.label` eyebrow, years · location metadata, localized bio, and email/website/social links. On desktop (≥1024px) it SHALL be top-aligned (`self-start`), sized to its own content (that does NOT stretch to column height), and `position: sticky` at `top: 93px` so it stays in view while the taller slider column scrolls past. The containing section SHALL NOT set `overflow: hidden` in a way that disables the sticky positioning.

#### Scenario: Sticky artist card on desktop
- **GIVEN** a desktop viewport with a slider taller than the artist card
- **WHEN** the user scrolls the gallery section
- **THEN** the artist card sticks to `top: 93px` and the slider scrolls past it

#### Scenario: Artist card does not stretch to column height
- **GIVEN** a desktop gallery with a slider column taller than the artist card content
- **WHEN** the gallery renders
- **THEN** the artist card occupies only its content height rather than the full grid row height

#### Scenario: Card stacks on mobile
- **GIVEN** a viewport below 1024px
- **WHEN** the gallery renders
- **THEN** the artist card stacks above the slider (single column) without sticky behavior

### Requirement: Slider renders all artwork images uncropped and centered
The slider SHALL present every artwork image as a slide. Each slide SHALL frame its image with `object-contain` within a flex-centered slide so the full image is visible with no cropping. On desktop a single `object-contain` framing class SHALL auto-fit each image within the slide: a portrait image fills the slider height (horizontally centered), a landscape or square image fills the slider width (vertically centered); no per-orientation logic SHALL select different classes. The slider canvas SHALL be `bg-paper` so any letterbox reserves blend with the page. The slider SHALL NOT advance automatically (no autoplay) and SHALL NOT animate the slider container height (no `autoHeight`), so no layout motion occurs on its own.

#### Scenario: Portrait image fits slider height
- **GIVEN** a portrait artwork image in the slider on a desktop viewport
- **WHEN** the slide renders
- **THEN** the image is scaled to fill the slider height and horizontally centered, fully visible with no cropping

#### Scenario: Landscape image fits slider width
- **GIVEN** a landscape artwork image in the slider on a desktop viewport
- **WHEN** the slide renders
- **THEN** the image is scaled to fill the slider width and vertically centered, fully visible with no cropping

#### Scenario: No self-advance or height animation
- **WHEN** the slider renders and the image loads
- **THEN** the slide does not advance on its own and the slider container height does not animate (no autoplay module, no `autoHeight`)

#### Scenario: Paper background blends letterbox
- **GIVEN** an image whose aspect ratio does not fill the slide box
- **WHEN** the slide renders
- **THEN** the surrounding letterbox area is page background (`bg-paper`) rather than a contrasting frame

### Requirement: Single-image artworks still show the full image
An artwork with exactly one image SHALL still render the slider with that image so the user can see it at full size and true aspect ratio. For a single image the slider SHALL render the static slide with the slider controls suppressed (no navigation arrows, no pagination bullets); the slide counter SHALL be omitted.

#### Scenario: Single-image artwork shows full image
- **GIVEN** an artwork with exactly one image
- **WHEN** the gallery renders
- **THEN** the slider displays the single image at full size and true aspect ratio with no navigation or pagination controls and no counter

### Requirement: Slider controls and geometry are grid-safe and styled to the theme
The slider root SHALL be `min-w-0` and the grid SHALL use `items-stretch`, so the slider does not blow out its `1fr` column (Swiper's flex track defaults to `min-width: auto`) and the slider fills the column height on desktop to match the artist card's row. Swiper's navigation and pagination controls SHALL be branded to the site palette via `--swiper-*` CSS variables (ink arrows, crimson active bullet) rather than Swiper defaults. A counter overlay SHALL render `n / N` when more than one image is present and track the active slide.

#### Scenario: Slider stays inside its column
- **GIVEN** a desktop gallery with a slider in a `1fr` column
- **WHEN** the gallery renders
- **THEN** the slider does not widen the column past its grid track (`min-w-0`), so no horizontal scroll or clipping occurs

#### Scenario: Slider fills column height to match the card
- **GIVEN** a desktop gallery with stretched columns
- **WHEN** the gallery renders
- **THEN** the slider and the artist card occupy the same row height

#### Scenario: Counter reflects active slide
- **GIVEN** an artwork with multiple images
- **WHEN** the user advances the slider
- **THEN** the counter updates to reflect the active slide index