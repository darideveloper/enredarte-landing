## Context

See `proposal.md` for motivation and background.

Currently `CardSummary.astro` defines `class` as:
`block bg-black/88 backdrop-blur-sm p-4 md:p-5 max-w-[260px] group transition-all hover:bg-black/95`

While background opacity changes on hover, there is no spatial or transform feedback (scale, elevation translate, depth shadow) to indicate interactive focus.

## Goals / Non-Goals

**Goals:**
- Update `CardSummary.astro` hover styling to include `hover:scale-[1.03]`, `hover:-translate-y-1`, `hover:shadow-2xl`, and smooth transition timing `duration-300 ease-out`.

**Non-Goals:**
- Modifying text layout or structural markup within `CardSummary.astro`.

## Decisions

### Decision 1: Combined scale, vertical translate, and shadow elevation
- **Approach**: Combine `hover:scale-[1.03]`, `hover:-translate-y-1`, `hover:shadow-2xl`, and `duration-300 ease-out` on the outer `<a>` wrapper in `CardSummary.astro`.
- **Rationale**: Combining a subtle 3% scale with a 4px upward translation (`-translate-y-1`) and shadow depth provides distinct visual feedback that feels responsive without disrupting layout flow.
- **Alternatives Considered**: Modifying text color alone on hover. Rejected because text color change alone does not provide sufficient tactile depth on overlaid dark badges.

## Risks / Trade-offs

- **[Risk]**: Overlapping adjacent container bounds if container overflow is clipped tightly.
- **[Mitigation]**: Ensure `ImageBanner` container handles z-index/overflow appropriately so transform scale is visible.
