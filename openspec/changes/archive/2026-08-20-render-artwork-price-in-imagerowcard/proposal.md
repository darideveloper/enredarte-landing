## Why

`ImageRowCard` is the only artwork card that does not render the price, even though `ArtworkView` carries it (`artwork.price`) and the shared `CardSummary` atom already accepts and displays a `price` prop. This leaves the gallery row cards inconsistent with the featured banner, which shows the price via `CardSummary`.

## What Changes

- Pass `artwork.price` into `CardSummary` from `ImageRowCard`, so the price is rendered on the row cards.
- No visual redesign: the existing `CardSummary` price presentation is kept as-is, minimal wiring. The price renders only when present.
- When a row card artwork has no price (`price_usd === 0`), the price line is omitted, matching existing behavior.

## Capabilities

### New Capabilities
- `image-row-card`: defines that `ImageRowCard` renders the artwork's title, artist, and price via the shared `CardSummary` atom.

### Modified Capabilities
<!-- None. The `card-summary` atom already supports a price prop; its behavior is unchanged. -->

## Impact

- `src/components/molecules/ImageRowCard.astro`: add `price={artwork.price}` to the `CardSummary` props (line 42).
- No changes to `CardSummary`, `ImageBanner`, `ImageCard`, data layer, or specs.
- Visual output: row cards now show the price line using the existing `CardSummary` price style, matching the featured banner.
