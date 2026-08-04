## Context

See proposal.md for motivation. The codebase already implements the `Headline` atom, which dictates uppercase red text styling for eyebrows. We need a `Title` molecule to standardise section headers while keeping flexibility for links.

## Goals / Non-Goals

**Goals:**
- Provide a consistent wrapper for section titles.
- Use slotting to allow composition with the `Headline` atom without coupling them tightly.

**Non-Goals:**
- Do not implement responsive breakpoints within the title font itself; that should be inherited or managed via utility classes if needed.

## Decisions

**1. Structure and HTML Semantics**
- Rationale: The `<Title>` component will wrap an `<slot/>` within an `<h2>` element (similar to `H1.astro`). A flexbox container will hold the title and the optional link.
- Alternatives: Hardcoding the `Headline` component inside the `Title` instead of a slot. Rejected because slotting provides better flexibility for consumers to inject `Headline` with custom colors or any other element.

**2. Handling Optional Links**
- Rationale: The `Title` component will accept `linkText` and `linkHref` as props. If both are passed, a right-aligned link (`<a>`) will render via `flex justify-between items-baseline`.

## Risks / Trade-offs

- [Risk] Flex layout `align-items: baseline` behaves unpredictably if the slotted content involves complex block-level elements. → Mitigation: Document that slotted content should primarily be text and atoms like `Headline`.
