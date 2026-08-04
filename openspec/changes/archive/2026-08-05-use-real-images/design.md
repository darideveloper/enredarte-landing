## Context

See proposal.md for motivation. We are swapping placeholder links for actual image assets inside `src/components/pages/landing/Home.astro`.

## Goals / Non-Goals

**Goals:**
- Replace 5 broken image paths with 5 selected real images from `public/images/`.

**Non-Goals:**
- No structural or CSS layout changes to the Gallery itself.

## Decisions

- I have selected a varied set of images to represent the exhibition:
  1. `/images/abstract-landscape-oil.jpg`
  2. `/images/painting-abstract-details.jpg`
  3. `/images/cityscape-madrid-gran-via.jpg`
  4. `/images/artist-street-exhibition.jpg`
  5. `/images/abstract-mosaic-woman.jpg`
- Since these images are locally hosted in `public/images/`, referencing them as root paths (e.g., `/images/filename.jpg`) will correctly resolve via Astro.

## Risks / Trade-offs
- None.
