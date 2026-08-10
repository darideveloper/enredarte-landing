## 1. Update ImageBanner Component

- [x] 1.1 Add `overlay?: 'hover' | 'darker' | 'always' | 'none'` and `darkenOnHover?: boolean` props to `ImageBanner.astro`.
- [x] 1.2 Implement gradient overlay div layer in `ImageBanner.astro` supporting static dark overlay and hover darkening.

## 2. Update ImageCard Component

- [x] 2.1 Add `overlay?: 'hover' | 'darker' | 'always' | 'none'` and `darkenOnHover?: boolean` props to `ImageCard.astro`.
- [x] 2.2 Update overlay rendering and transition timing (`duration-500`) in `ImageCard.astro`.

## 3. Update Hero and Page Components

- [x] 3.1 Update `Hero.astro` to pass `overlay="darker"` on `ImageBanner` for high-contrast hero readability.

## 4. Verification

- [x] 4.1 Verify build completes with `npx astro build` and verify text readability across showcases in `/design-system`.
