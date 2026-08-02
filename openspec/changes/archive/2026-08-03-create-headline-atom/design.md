## Context
We are creating a simple Atom component (`Headline.astro`) to display stylized, uppercase labels. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Provide a consistent, reusable primitive for category labels and colored text segments.
- Support standard color variants using Tailwind classes based on our defined theme (`--color-crimson`, `--color-ink`, `--color-muted`).

**Non-Goals:**
- Complex layout logic. The Headline atom should only style text and remain inline.

## Decisions

- **HTML Element**: Use an inline `<span>` element by default so it can be nested inside paragraphs or headings without breaking flow.
- **Props**: Use a simple `color` prop (`"red" | "default" | "muted"`) mapping directly to Tailwind text colors (`text-crimson`, `text-ink`, `text-muted`).
- **Styling constraints**: Base classes will include `uppercase tracking-[0.22em] text-[10px]` by default (matching the `.hero-eyebrow` class from `enredarte_mockup_A_salas_DESCARGAR.html`, though we might use a slightly smaller tracking for inline text - we'll stick to a generic utility class structure and allow overrides).

## Risks / Trade-offs

- Over-engineering: An atom for a `span` might seem trivial, but it guarantees consistency in tracking, capitalization, and semantic colors across the UI.
