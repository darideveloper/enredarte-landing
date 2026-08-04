## Context

See proposal.md for motivation. We need a unified card component for the "Pabellón de Salas" grid that integrates the `Image` atom and the `CardInfo` molecule, and handles complex hover interactions.

## Goals / Non-Goals

**Goals:**
- Provide a responsive, interactive container for cards.
- Encapsulate the hover animations (scale + filter changes) on the background image.
- Render the inner `CardInfo` overlay seamlessly.
- Support a large variant for grid spanning.

**Non-Goals:**
- Do not hardcode the grid layout structure inside the card itself. The parent Organism (Gallery) will handle grid placement.

## Decisions

**1. Hover Interaction Implementation**
- Rationale: The `ImageCard` container will apply the `group` class in Tailwind. This allows us to target the inner image for scaling and filter transitions (`group-hover:scale-105 group-hover:brightness-[0.42] group-hover:saturate-100`).
- Alternatives: Using custom CSS in `<style>`. Rejected because Tailwind's `group-hover` paradigm handles this elegantly and keeps the styles colocated.

**2. Component Composition**
- Rationale: `ImageCard.astro` will receive a single flat props interface that combines the props needed for the `Image` (like `src`, `alt`) and `CardInfo` (like `title`, `subtitle`, `href`). It will instantiate both components internally.
- Alternatives: Using slots so the consumer provides the `<Image>` and `<CardInfo>`. Rejected because `ImageCard`'s specific styling relies on tightly coupling the container to the image (using `absolute inset-0` or similar for the image to fill the card).

## Risks / Trade-offs

- [Risk] Passing all props down can result in a bloated interface if more variants are added. → Mitigation: We keep the interface strictly tied to the visual requirements of the Salas grid design.
