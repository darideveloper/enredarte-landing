## Why

The blog mosaic (`BlogIndex` `lg:grid-cols-3 auto-rows-fr`) has two visual regressions on `PostCard` `featured` (`lg:col-span-2`): (1) the image covers only its `aspect-[16/10]` wrapper, not the full grid cell — when the row is taller (neighbor regular cards stretch via `flex-1` paper info) a `bg-card-dark` gap shows; (2) on mobile the featured overlay (`absolute inset-0 justify-end`) and the date badge (`absolute top-3 left-3`) are independent absolutes, so long titles/descriptions on 320-375px grow upward and collide with the badge. Both degrade the Salon editorial language.

## What Changes

- **Featured cover fills cell (Option A / 1a):** make the featured image wrapper `flex-1 min-h-0 w-full` (keep `aspect-[16/10]` as intrinsic min) inside the outer `flex flex-col h-full` card, so `img absolute inset-0 w-full h-full object-cover` actually covers the whole cell when `auto-rows-fr` stretches the row. Regular cards keep `shrink-0 aspect-[4/3] + flex-1` info — no layout change.
- **Mobile overlap reserved (Option A / 2a):** change featured overlay from `absolute inset-0` to `absolute inset-x-0 bottom-0` with `pt-12` reservation (top buffer) so the bottom-anchored `author/title/desc/cta` block never reaches the date badge. Date stays `absolute top-3 left-3`. Gradient stays `absolute inset-0`.
- No new routes, no API change, no `page_size` change, no i18n key change, no new component.

## Capabilities

### New Capabilities

- _none_

### Modified Capabilities

- `post-card`: cover and overlay behavior for `featured` variant — wrapper stretch + overlay inset reservation.
- `blog`: grid still `auto-rows-fr` but featured cell now reliably fills row; visual QA expectation updated.

## Impact

- **Code:** `src/components/pages/blog/PostCard.astro` (2 class-list edits). `src/components/pages/blog/BlogIndex.astro` unchanged (grid stays `auto-rows-fr`).
- **Design tokens:** none new (`bg-card-dark`, `object-cover`, `from-black/75` preserved).
- **Risks:** low — CSS-only, scoped to `featured` branch; regular cards untouched except shared `object-cover` contract. Needs visual QA at `lg` (3-col, featured 2-col + 1 regular per row) and `<md` narrow.
