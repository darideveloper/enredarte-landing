## Context

See proposal.md for motivation. We are building the `Filters` molecule component.

## Goals / Non-Goals

**Goals:**
- Implement `Filters.astro` accepting `items: { text: string, value: string }[]` and optional `activeValue: string`.
- Layout as `flex flex-wrap gap-2 mb-9`.
- Map over `items` rendering `<FilterBtn />`.

**Non-Goals:**
- React state / Zustand bindings. This remains an Astro visual component for now.

## Decisions

**1. Default Active Fallback**
- If `activeValue` is not provided, `items[0].value` is used as the active value so the first button ("TODAS LAS OBRAS") is highlighted by default.

## Risks / Trade-offs

None. Standard molecule composition.
