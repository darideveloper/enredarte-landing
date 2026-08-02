## Context

See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Provide a reusable overlay component (`CardSummary.astro`) for displaying metadata on images.
- Exactly match the visual styling defined in `.hero-badge` from the provided mockups.
- Be flexible enough to handle cases with or without artist and price data.

**Non-Goals:**
- This component does NOT manage the underlying image; it only renders the overlay box. It will be combined with the `Image` atom later in an `ImageBanner` component.

## Decisions

- **Framework**: Astro component (`.astro`) for static rendering with no client-side JavaScript needed.
- **Styling**: Tailwind CSS utility classes.
  - `bg-black/88` or equivalent transparent color for the background overlay.
  - `backdrop-blur-sm` for the blur effect behind the box.
  - `p-4 md:p-5 max-w-[260px]` for sizing.
- **Props**: `title` (string, required), `artist` (string, optional), `price` (string, optional).

## Risks / Trade-offs

- **Risk**: Contrast issues if the text color (light) blends with a light background.
- **Mitigation**: The background is a dark overlay (`bg-black/88`), guaranteeing that the white text always has high contrast regardless of the image underneath.
