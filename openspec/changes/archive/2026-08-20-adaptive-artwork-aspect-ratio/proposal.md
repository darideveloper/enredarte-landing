## Why

Artworks in the gallery have different aspect ratios (landscape, portrait, square), but `ImageRowCard` forces every image into a fixed-height container with `object-cover`, cropping relevant parts of many artworks. Additionally, the shared `cn` utility is a bare `join(" ")`, so conflicting Tailwind classes can't override each other reliably across the design system.

## What Changes

- `ImageRowCard` renders each artwork at its **natural aspect ratio** instead of cropping it into a fixed-height box (no `min-h`, no `absolute inset-0` + `object-cover`).
- The `Image` atom exposes a **configurable height mode** (`full` default, `auto`) so callers can opt into natural-aspect rendering without changing the default crop behavior for other consumers (`ImageCard`, `ImageBanner`, `Hero`).
- Add **tailwind-merge** to the `cn` utility so conflicting Tailwind utilities are deduplicated (last-wins), enabling reliable class overrides across components.
- **BREAKING** (internal only): `cn` in `src/lib/utils.ts` switches from a plain join to `clsx` + `tailwind-merge`. Existing callers pass strings/booleans only, so this is backward-compatible; the change in behavior is that conflicting utilities now merge instead of stacking.

## Capabilities

### New Capabilities
- `class-composition`: The `cn` utility composes and de-duplicates Tailwind utility classes using `clsx` + `tailwind-merge`, so later classes reliably override earlier conflicting ones.

### Modified Capabilities
- `image-atom`: The `Image` atom's height mode becomes configurable (`full` default / `auto`), so callers can render at natural aspect ratio while preserving the default crop behavior for existing consumers.
- `image-row-card`: `ImageRowCard` renders artworks at their natural aspect ratio without cropping, instead of forcing all into a fixed-height, `object-cover` container.

## Impact

- **Components**: `src/components/atoms/Image.astro`, `src/components/molecules/ImageRowCard.astro`.
- **Utility**: `src/lib/utils.ts` (`cn`), `package.json` (add `clsx` + `tailwind-merge` deps).
- **Docs**: `docs/component-dependencies.md` may need a Notes refresh if dependency relationships change.
- **Specs**: delta updates to `image-atom` and `image-row-card`; new `class-composition` spec.
- **No API/backend changes** — aspect detection uses the browser's natural image ratio (zero JS, no layout shift).
