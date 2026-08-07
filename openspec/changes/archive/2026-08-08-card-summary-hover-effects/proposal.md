## Why

The `CardSummary` component (`src/components/molecules/CardSummary.astro`) currently lacks dynamic hover feedback for users when interacting with it on hero and artwork banner section overlays. Adding scaling, subtle vertical translation elevation, shadow depth, and backdrop opacity transitions will provide clear, responsive visual feedback to the user on hover.

## What Changes

- Enhance `CardSummary.astro` hover styling to scale slightly (`hover:scale-[1.03]`), translate vertically (`hover:-translate-y-1`), increase backdrop darkness/opacity (`hover:bg-black/95`), and add a smooth shadow depth (`hover:shadow-2xl`).
- Ensure smooth transform and transition timing (`transition-all duration-300 ease-out`).

## Capabilities

### Modified Capabilities
- `card-summary`: Add requirement for interactive hover feedback (scaling, vertical elevation transform, opacity shift, and shadow effects) on `CardSummary`.

## Impact

- **UI Components**: `CardSummary.astro`, `ImageBanner.astro`, and pages using `CardSummary`.
- **Dependencies**: No external dependency changes.
