## Context

The landing page mockup specifies two primary button styles: a solid red CTA used in hero sections, and an outlined dark button used in navigation headers. 

## Goals / Non-Goals

**Goals:**
- Provide a single, clean `Btn` React atom component using an `<a>` element wrapper.
- Use a variant style dictionary mapping (`variantStyles`) to make adding future variants easy without conditional branching.

**Non-Goals:**
- Supporting `<button type="submit">` functionality in this atom (this atom is specifically an anchor wrapper for link actions).

## Decisions

**1. Style Mapping Dictionary**
- **Decision:** Store variant classes in a `const variantStyles = { ... }` object.
- **Rationale:** Prevents inline ternary/if clutter and enforces clean maintainable extensions.

**2. Default Sizing Association**
- **Decision:** Associate default size padding (`sm` vs `lg`) based on variant when `size` is not explicitly passed (`ghost` defaults to `sm`, `regular` defaults to `lg`).
- **Rationale:** Matches the mockup defaults out of the box while allowing explicit `size` overrides.
