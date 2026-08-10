## Context

See `proposal.md` for motivation and background.

Currently `Btn.astro` defines button variants using a Tailwind utility class lookup object (`variantStyles`). The `primary` variant uses `bg-crimson text-paper border-transparent hover:opacity-90`. The transition utility in `baseStyles` specifies `transition-all duration-300` without an explicit easing function. `FilterBtn.astro` uses `transition-all duration-200`.

## Goals / Non-Goals

**Goals:**
- Update `variantStyles.primary` in `Btn.astro` so the idle state sets `border-crimson` and the hover state converts to a red ghost button (`hover:bg-transparent hover:text-crimson hover:border-crimson`).
- Update `baseStyles` in `Btn.astro` and button styles in `FilterBtn.astro` to include `ease-in-out` easing timing across smooth transitions (`transition-all duration-300 ease-in-out`).

**Non-Goals:**
- Modifying the visual appearance of other components or introducing new button variants beyond updating `primary` and transition timings.

## Decisions

### Decision 1: Pre-set border on primary button in idle state
- **Approach**: Set `border-crimson` on `primary` in idle state rather than `border-transparent`.
- **Rationale**: Setting `border-crimson` before hover prevents layout width recalculation or box-sizing flicker during the 300ms hover transition.
- **Alternatives Considered**: Using `border-transparent` with `hover:border-crimson`. Rejected because transition from transparent border to colored border can cause visual color steps or subpixel shift depending on rendering engine.

### Decision 2: Standardizing `transition-all duration-300 ease-in-out`
- **Approach**: Add `ease-in-out` to `baseStyles` in `Btn.astro` and update `FilterBtn.astro` transition classes to `transition-all duration-300 ease-in-out`.
- **Rationale**: Provides consistent, smooth state transitions for background color, border color, and text color across all interactive button elements.

## Risks / Trade-offs

- **[Risk]**: Overriding hover opacity or background colors in page-specific custom classes passed via `class`.
- **[Mitigation]**: Ensure `cn()` helper correctly merges `baseStyles` and `variantStyles` without conflicts.
