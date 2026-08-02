## Why

The current navigation links inside `Header.astro` are hardcoded directly into the component. To support reusing the navigation logic across different areas of the application (like a footer or a mobile drawer menu) and to centralize the special animated underline styling, we need to extract this into a dynamic, reusable `Menu` molecule. Additionally, extending the `Link` atom with a new `nav` variant allows us to cleanly reuse the specific typography and interactive hover effects across the app.

## What Changes

- Extend the existing `Link` atom to support a `variant` prop (`default`, `nav`).
- Extract the specialized uppercase, tracking, and animated bottom-border styles from `Header.astro` into the new `nav` variant of `Link`.
- Create a new `Menu.astro` molecule that accepts an array of links as a prop and renders a list of `<Link variant="nav">` components.
- Refactor `Header.astro` to use the new `Menu` molecule, removing the hardcoded link mapping logic from the header itself.

## Capabilities

### New Capabilities
- `menu-molecule`: A dynamic component that receives a list of links and renders them consistently using the `nav` variant of the `Link` atom.

### Modified Capabilities
- `link-atom`: Now supports a `nav` variant for specialized navigation styling.
- `header-organism`: Refactored to delegate navigation link rendering to the `Menu` molecule.

## Impact

- `src/components/atoms/Link.astro` (Modified)
- `src/components/molecules/Menu.astro` (New)
- `src/components/organisms/Header.astro` (Modified)
- `src/pages/design-system.astro` (Modified to showcase the Menu molecule and new Link variant)
