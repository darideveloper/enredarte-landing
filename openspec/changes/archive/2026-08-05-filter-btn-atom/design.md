## Context

See proposal.md for motivation. We are building the `FilterBtn` atom component.

## Goals / Non-Goals

**Goals:**
- Implement `FilterBtn.astro` supporting `text`, `value`, and `active` props.
- Use Tailwind classes to match the design mockup chip styling.

**Non-Goals:**
- Client-side state management (Zustand) or React interactivity is deferred to later tasks. This phase focuses on the static Astro UI component.

## Decisions

**1. Styling Approach**
- Default classes: `text-[10px] tracking-[0.06em] uppercase text-muted border border-border-theme px-[18px] py-[9px] cursor-pointer transition-all duration-200 hover:border-crimson hover:text-ink hover:bg-white`
- Active modifier: `active ? "border-crimson text-ink bg-white" : ""`

## Risks / Trade-offs

None. Standard atomic component creation.
