## Purpose
Build-time responsive image variants for every image slot, so the browser downloads the smallest adequate file for the device viewport and DPR while keeping full quality at the rendered size.

## Requirements

### Requirement: Build-time responsive variants per visible slot
The system SHALL emit responsive image variants at build time via `astro:assets` + `sharp` for every artwork/blog/curator/artist image slot, with `widths` and `sizes` matched to the rendered CSS slot so the browser downloads the smallest adequate file for the device viewport and DPR.

#### Scenario: Phone downloads small variant
- **WHEN** a 390px phone (DPR 2) renders a 25vw grid card
- **THEN** the browser selects a ~400w AVIF/WebP variant (~30KB) instead of the full original (>1MB)

#### Scenario: Desktop hero downloads large variant
- **WHEN** a 1440px desktop renders a 51vw hero
- **THEN** the browser selects a ~1600w variant preserving full quality at the rendered size

#### Scenario: Transform failure falls back safely
- **WHEN** a remote image cannot be downloaded or transformed during build
- **THEN** the build emits the original absolute URL verbatim with existing lazy/async behavior and logs a warning, and `astro build` does not fail on that image alone

### Requirement: Remote allowlist and local optimization
The system SHALL configure `image.domains/remotePatterns` for the dashboard/CDN media host and SHALL move optimizable locals from `public/` to `src/assets/` so both remote and local images flow through the sharp pipeline.

#### Scenario: Remote artwork optimized
- **WHEN** `astro build` processes an `ArtworkImage.image` absolute URL whose host matches the allowlist
- **THEN** variants are emitted under `/_astro/` with `1y immutable` cache

#### Scenario: Local logo optimized
- **WHEN** the build processes `logo.png` / hero fallback from `src/assets/`
- **THEN** WebP/AVIF variants with intrinsic dimensions are emitted; favicons and `og-image.jpg` stay in `public/` verbatim

### Requirement: Named hero slots per page template
The system SHALL apply explicit responsive slots for Gallery hero (`sizes="100vw"`, `widths [960,1600,2400]`, eager/high), Artist portrait (`sizes="(max-width:1024px) 100vw, 360px"`, `widths [360,720]`, eager/high), and Curator hero/photo (`sizes="(max-width:768px) 100vw, 360px"`, `widths [360,720,1080]`, eager on hero / lazy on card block), preserving existing crop and layout.

#### Scenario: Gallery hero picks full-bleed variant
- **WHEN** a gallery page loads on desktop
- **THEN** the hero variant matching `100vw` is high-priority with responsive preload

#### Scenario: Artist portrait reserves box
- **WHEN** an artist page loads
- **THEN** the 360px portrait variant is eager/high with intrinsic dimensions and no layout shift

#### Scenario: Curator block defers correctly
- **WHEN** a gallery page renders the below-fold curator block
- **THEN** its photo stays lazy with curator sizes while the curator detail hero is eager
