## Context

See proposal.md for motivation. We are building the `Artworks` organism component.

## Goals / Non-Goals

**Goals:**
- Implement `Artworks.astro` accepting `artworks: ArtworkData[]`.
- Layout as `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[3px]`.
- Render `ImageCard` for each artwork.

**Non-Goals:**
- Client-side filtering logic or API calls. (Deferred to later integration).

## Decisions

**1. Overlay Design & Link**
- Each artwork card maps to an `ImageCard` component. The entire card container acts as a clickable link.

## Risks / Trade-offs

None.
