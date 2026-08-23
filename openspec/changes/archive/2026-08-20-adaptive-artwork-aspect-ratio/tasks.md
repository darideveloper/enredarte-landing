## 1. Class composition (`cn` + tailwind-merge)

- [x] 1.1 Add `clsx` and `tailwind-merge` to `package.json` dependencies and install them.
- [x] 1.2 Update `cn` in `src/lib/utils.ts` to compose via `clsx` and dedupe with `tailwind-merge`, preserving the existing string/boolean-conditional signature.

## 2. Image atom height mode

- [x] 2.1 Add a `height` prop (`"full"` default | `"auto"`) to `src/components/atoms/Image.astro`.
- [x] 2.2 Apply `h-full` when `height="full"` (default) and `h-auto` when `height="auto"` in the atom's class composition.
- [x] 2.3 Confirm existing consumers (`ImageCard`, `ImageBanner`, `Hero`) still render with default `full` behavior.

## 3. ImageRowCard natural aspect ratio

- [x] 3.1 In `src/components/molecules/ImageRowCard.astro`, remove the fixed-height container (`min-h-[320px] md:min-h-[440px]`), the `absolute inset-0` positioning, and the `object-cover` crop.
- [x] 3.2 Render the `Image` atom with `height="auto"` (and `w-full h-auto`) so the image fills the row width and keeps its natural aspect ratio.
- [x] 3.3 Preserve `reverse` (image-side) ordering, mobile stacking, and the `CardSummary` call unchanged.
- [ ] 3.4 (Optional guard) If real assets require it, add a `max-h` safety cap with `object-contain` for extreme aspect ratios.

## 4. Verification & docs

- [x] 4.1 Verify in dev that landscape, portrait, and square artworks render uncropped in gallery rows, and that `ImageCard`/`ImageBanner`/`Hero` are unchanged.
- [x] 4.2 Run `pnpm build` to confirm the build (validate-i18n + validate-imports + astro build) passes.
- [x] 4.3 Refresh the Notes section of `docs/component-dependencies.md` if dependency relationships changed.
