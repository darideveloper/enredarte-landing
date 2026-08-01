## Why

Currently, UI components and pages use hardcoded hex values (e.g. `#C41E3A`, `#F2EDE4`, `#1A1A1A`), which creates duplication, makes theming difficult, and violates design system practices. Defining global color tokens in Tailwind CSS ensures consistent visual branding, easy maintenance, and clean utility classes.

## What Changes

- Add semantic theme color tokens (`paper`, `ink`, `crimson`, `muted`, `border`) to `src/styles/global.css` using Tailwind v4's `@theme inline` block.
- Refactor the `Btn` atom component to use semantic Tailwind classes (`bg-crimson`, `text-paper`, `border-ink`, etc.) instead of hardcoded hex values.
- Refactor `src/pages/design-system.astro` to consume global theme colors instead of hardcoded hex classes.

## Capabilities

### New Capabilities
- `global-colors`: Centralized design system color palette configuration and semantic utility bindings.

### Modified Capabilities
- (None)

## Impact

- **`src/styles/global.css`**: Configures global color tokens.
- **`src/components/atoms/Btn.tsx`**: Updates utility classes to use new color tokens.
- **`src/pages/design-system.astro`**: Updates inline classes to use new color tokens.
