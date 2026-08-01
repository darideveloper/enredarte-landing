## Context

The landing page and atomic components previously used inline hex codes like `#C41E3A` and `#F2EDE4`. Tailwind CSS v4 supports declaring custom theme variables inside `@theme inline` in `src/styles/global.css`.

## Goals / Non-Goals

**Goals:**
- Centralize all Enredarte brand colors in `src/styles/global.css`.
- Update `Btn.tsx` and `design-system.astro` to use semantic token names.

**Non-Goals:**
- Creating a full dark mode toggle system at this time (though defining tokens makes future dark mode straightforward).

## Decisions

**1. Color Token Naming Strategy**
- **Decision:** Use evocative brand names (`paper`, `ink`, `crimson`, `muted`, `border-theme`) matching the design identity.
  - `paper`: `#F2EDE4` (Warm background)
  - `ink`: `#1A1A1A` (Dark typography & primary borders)
  - `crimson`: `#C41E3A` (Primary brand accent)
  - `muted`: `#8A8478` (Secondary text)
  - `border-theme`: `#E0DDD8` (Subtle dividers & borders)
- **Rationale:** Names like `paper` and `ink` directly reflect the editorial art direction of the site.

## Risks / Trade-offs

- **Risk:** Existing components using arbitrary hex classes might not immediately inherit the new tokens until updated.
  - **Mitigation:** Refactor existing atoms and pages in this change.
