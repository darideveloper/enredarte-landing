## Context

See proposal.md for motivation. The `Gallery` organism depends on `Title` and `ImageCard` components. It maps to the `.pabellon` section from the provided HTML design.

## Goals / Non-Goals

**Goals:**
- Provide a clean API for rendering a gallery of exhibition cards (e.g. taking an array of card data).
- Implement the specific asymmetric CSS grid layout from the design mockup.
- Render the correct section wrapper (`<section class="pabellon ...">`).

**Non-Goals:**
- Data fetching is outside the scope of this component. The organism receives data as a prop and only cares about presentation.

## Decisions

**1. Data Interface**
- Rationale: The organism will accept a `salas` array prop. Each element will contain the properties needed for `ImageCard` (e.g., `src`, `title`, `meta`, `curator`, `href`, `isLarge`).
- Alternatives: Hardcoding the content (rejected because organisms should ideally be reusable and data-driven). 

**2. Grid Layout Implementation**
- Rationale: The grid uses `display: grid`, `grid-template-columns: 1.4fr 1fr 1fr`, `grid-template-rows: 340px 340px`, and `gap: 4px`. We will use Tailwind arbitrary values: `grid grid-cols-[1.4fr_1fr_1fr] grid-rows-[340px_340px] gap-1`. The `isLarge` logic for `col-span-1 row-span-2` is already handled internally by the `ImageCard` molecule.
- Alternatives: Using standard Tailwind grid columns (e.g., `grid-cols-3` with `col-span-2`). Rejected because the design uses a specific fractional split `1.4fr 1fr 1fr` which doesn't perfectly align with a standard 12-column or equal-3-column grid.

## Risks / Trade-offs

- [Risk] Arbitrary Tailwind fractional grid columns `[1.4fr_1fr_1fr]` may not scale beautifully down to mobile without media queries. → Mitigation: We will assume desktop-first for now matching the provided `.salas-grid` styling, and could easily append `md:grid-cols-[1.4fr_1fr_1fr]` and default to `grid-cols-1` for mobile if needed.
