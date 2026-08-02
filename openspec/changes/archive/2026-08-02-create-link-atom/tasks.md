## 1. Create Link Atom

- [x] 1.1 Create `src/components/atoms/Link.astro`.
- [x] 1.2 Define the interface to accept standard HTML anchor attributes (`href`, `target`, `rel`, `class`, etc.).
- [x] 1.3 Apply a default set of styles for the text link (e.g., `text-ink hover:text-crimson transition-colors underline-offset-4 hover:underline cursor-pointer`) merged with any custom `class` passed in via `cn()`.
- [x] 1.4 Render an `<a>` tag with the spread props and an `<slot />` for the children.

## 2. Update Design System

- [x] 2.1 Update `src/pages/design-system.astro` to add a new section for the `Link` atom.
- [x] 2.2 Showcase a few variations (e.g., standard internal link, external link with `target="_blank"`) to verify the hover effects and property passthrough work correctly.
