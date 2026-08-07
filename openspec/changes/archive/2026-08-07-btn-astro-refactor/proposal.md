## Why

The application currently has hardcoded vanilla HTML `<button>` elements in `Hero.astro` and relies on a dummy React component `Btn.tsx`. We need a unified, polymorphic Astro atom component `Btn.astro` that standardizes button variants across `Hero.astro`, `Header.astro`, and `design-system.astro`, while refactoring `LangBtns.astro` to use lightweight native `<a>` tags in a loop.

## What Changes

- Create a new Astro atom component `src/components/atoms/Btn.astro` supporting polymorphic rendering (`<a>` or `<button>`), variants (`primary`, `ghost`, `outline`), and sizes.
- Delete dummy React component `src/components/atoms/Btn.tsx`.
- Refactor `Hero.astro` to replace vanilla `<button>` tags with `Btn.astro`.
- Refactor `Header.astro` to import and use `Btn.astro`.
- Refactor `LangBtns.astro` to render semantic `<a>` links using a clean loop optimization.
- Update `design-system.astro` to import and showcase `Btn.astro`.

## Capabilities

### New Capabilities
- `btn-astro-atom`: A polymorphic Astro atom component (`Btn.astro`) for rendering action buttons and button-like links with design system variants.

### Modified Capabilities

## Impact

- `src/components/atoms/Btn.astro` created.
- `src/components/atoms/Btn.tsx` deleted.
- `src/components/organisms/Hero.astro` updated.
- `src/components/organisms/Header.astro` updated.
- `src/components/molecules/LangBtns.astro` updated.
- `src/pages/design-system.astro` updated.
