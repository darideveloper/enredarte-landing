## Context

`ImageRowCard` renders each gallery artwork row and delegates its text content to the shared `CardSummary` atom. Unlike `ImageBanner` (which already passes `price`), `ImageRowCard` did not pass the price, leaving row cards without a price line while the featured banner shows one. `ArtworkView` already carries `price` (`toArtworkView` derives it from `artwork.price_usd > 0`), and `CardSummary` already accepts and conditionally renders a `price` prop.

## Goals / Non-Goals

**Goals:**
- Surface the artwork price on gallery row cards by wiring `artwork.price` into `CardSummary`.
- Keep the existing `CardSummary` price presentation unchanged (minimal wiring).

**Non-Goals:**
- No visual redesign of `CardSummary` or its price style.
- No changes to `ImageBanner`, `ImageCard`, `CardInfo`, the data layer, or the price-format logic in `toArtworkView`.

## Decisions

**1. Wire through the shared atom instead of rendering a price element locally**
- **Decision:** Add `price={artwork.price}` to the existing `CardSummary` props in `ImageRowCard.astro` (line 42).
- **Rationale:** `CardSummary` already owns the price rendering and its conditional omission when `price` is absent (no leftover empty space). This reuses the exact presentation used by `ImageBanner`, keeping row cards and the banner consistent with zero new markup.

## Risks / Trade-offs

- [Row cards that previously showed no price now display one] → Intended behavior; only renders when `artwork.price` is defined (zero/undefined prices are omitted by `toArtworkView` and `CardSummary`).
