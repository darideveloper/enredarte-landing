## Context

See proposal.md for motivation. We need a molecule for card information overlays (`CardInfo`) that can act as a clickable wrapper and conditionally display various metadata elements based on the card variant.

## Goals / Non-Goals

**Goals:**
- Provide a consistent wrapper for card titles and metadata.
- Make the entire card info block a clickable anchor tag.
- Support optional properties to render a rich overlay (used in the "Big" gallery card) or a compact overlay (used in standard grid cards).

**Non-Goals:**
- Handling the card's background image or container hover effects. That belongs in the parent `ImageCard` molecule.

## Decisions

**1. Root Element as Anchor (`<a>`)**
- Rationale: The `CardInfo` molecule will wrap its contents in an `<a>` tag utilizing the required `href` prop. This ensures the text overlay acts as the clickable surface for the card, matching standard accessibility patterns for interactive cards.
- Alternatives: Using a `div` and requiring the parent `ImageCard` to provide the link. Rejected because grouping the link with the textual description keeps the semantic grouping cleaner.

**2. Optional Metadata Props**
- Rationale: Accepting `subtitle`, `meta`, and `curator` as optional strings allows conditional rendering of these paragraphs. When not provided, they simply don't render, enabling the molecule to flex from minimal to detailed states.
- Alternatives: Creating separate components for "DetailedCardInfo" and "CompactCardInfo". Rejected to reduce duplication and keep the API surface unified.

## Risks / Trade-offs

- [Risk] If `CardInfo` is placed in a non-relative container, absolute positioning might break. → Mitigation: It is expected to be placed within a `relative` wrapper (like `ImageCard`). This constraint will be documented in tasks.
