## Why

The artists index (`/artistas`, `/en/artistas`) currently shares a 3-column grid with salas and curadores. With a growing roster, 3 columns wastes vertical space and pushes artists below the fold — 4 columns on desktop presents the roster more compactly without changing card design.

## What Changes

- Artists index grid goes from `grid-cols-1 / sm:2 / lg:3` to `grid-cols-1 / sm:2 / md:3 / lg:4` (desktop shows 4 cards per row).
- Salas (`/salas`) and curadores (`/curadores`) grids stay at `1 / sm:2 / lg:3` — no visual change.
- No change to card content, image source, aspect ratio (`aspect-[4/5]`), gap (`gap-1`), container (`max-w-6xl`), header copy, SEO, routing, or language-switch behavior.
- Obras (`/obras`) interactive catalog untouched.

## Capabilities

### New Capabilities

None — no new behavior is introduced.

### Modified Capabilities

- `collection-index-pages`: artists index grid density requirement changes (4 columns at `lg` + `md:3` intermediate step); salas/curadores grid requirement reaffirmed as unchanged.

## Impact

- Code: `src/components/pages/index/CollectionIndex.astro` (single conditional on the static grid class, line ~136).
- Docs: `docs/component-dependencies.md` CollectionIndex tree mentions the shared `lg:grid-cols-3` grid — needs a one-line sync for the artistas exception.
- No API, routing, i18n, or store changes. No new dependencies.
