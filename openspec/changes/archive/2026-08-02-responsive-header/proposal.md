## Why

The current `Header.astro` component lacks a responsive mobile experience. The navigation links simply disappear or wrap poorly on small screens. To provide a modern, accessible mobile experience, we need to introduce a mobile drawer that contains the navigation links, while keeping the desktop experience intact. To avoid duplicating DOM nodes for SEO and accessibility reasons, we will implement this using a single CSS-driven `Menu` molecule that acts as a drawer on mobile and an inline row on desktop.

## What Changes

- Add a CSS-animated hamburger toggle button to the mobile header view.
- Update `Menu.astro` to apply mobile-first CSS (fixed drawer off-screen) alongside `md:` desktop overrides (static inline row).
- Update `Header.astro` to include the hamburger toggle and a small vanilla JS script to toggle the drawer's visibility.
- Move the "Solicitar Acceso" button to be visible inside the mobile drawer and hidden in the main header bar on mobile.

## Capabilities

### Modified Capabilities
- `header-organism`: Now fully responsive, displaying a hamburger menu toggle on mobile and managing the state of a unified CSS-driven navigation menu.
- `menu-molecule`: Refactored to act as a hidden overlay drawer on mobile, and a standard flex row on desktop via Tailwind responsive breakpoints.

## Impact

- `src/components/organisms/Header.astro` (Modified)
- `src/components/molecules/Menu.astro` (Modified)
