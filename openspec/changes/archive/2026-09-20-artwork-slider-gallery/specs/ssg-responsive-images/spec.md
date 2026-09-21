# ssg-responsive-images Specification (delta)

## ADDED Requirements

### Requirement: Slider slot sizes match the rendered gallery column
The system SHALL expose an `IMAGE_SLOTS.slider` slot for artwork gallery slides with `sizes` matching the slider's rendered width in each breakpoint and `widths` capped at 1600, so the browser never downloads candidate variants larger than the column actually renders. The slider column is `100vw - 48px` on mobile (`≤768px`, `px-6`), `100vw - 112px` at `md` (`px-14`), and `100vw - 556px` at `lg` and wider (`- 380px` artist column and `- 64px` `gap-16`). Cap widths at 1600: at a 1920px viewport the column renders at most ~1364 CSS px, so a 2400w candidate is dead weight (1600w covers DPR 2).

#### Scenario: Desktop slider selects an in-range variant
- **WHEN** a 1440px desktop renders an `lg` gallery slider column
- **THEN** the largest `slider` candidate is 1600w, matching the `calc(100vw - 556px)` sizes (no 2400w variant is emitted for the slides)

#### Scenario: Mobile slider selects a phone variant
- **WHEN** a 390px phone DPR 2 renders the slider
- **THEN** the browser selects the smallest candidate matching `calc(100vw - 48px)`

### Requirement: slideSet keeps React island images on the image pipeline
The system SHALL provide a `slideSet(src, slot)` helper in `src/lib/images.ts` that builds the same AVIF+WebP transform pair (with retry and verbatim-URL fallback) that the `Image` atom applies, returning a `SlideSet { avifSrcSet, webpSrcSet, fallbackSrc, width, height, sizes }`. React islands cannot render the `.astro` `Image` atom, so this helper SHALL let gallery slides keep byte parity with atom-rendered images. When the remote cannot be transformed it SHALL return `null` so the caller falls back to the verbatim URL, and the resolved `sizes` SHALL come from the passed slot (the `slider` slot on the artwork gallery).

#### Scenario: Slider slide is optimized
- **WHEN** the artwork gallery precomputes a slide for an optimizable remote artwork image
- **THEN** the slide receives AVIF+WebP srcsets with the `slider` slot's `sizes`, and intrinsic `width`/`height` are emitted

#### Scenario: Unoptimizable slide falls back verbatim
- **WHEN** `slideSet` cannot transform a remote artwork image
- **THEN** the slide falls back to the verbatim URL with `object-contain` framing intact and the build does not fail on that image alone