## 1. Create Molecule Component

- [x] 1.1 Create `src/components/molecules/H1.astro`.
- [x] 1.2 Define the component props (`eyebrow?: string`) and `class` prop for extending styles.
- [x] 1.3 Import the `Headline` atom (`import Headline from '../atoms/Headline.astro'`).

## 2. Implement Rendering Logic

- [x] 2.1 Render the outer container `<div>` with the base classes: `flex flex-col gap-4`.
- [x] 2.2 If the `eyebrow` prop is provided, render it inside the `<Headline color="muted">` atom.
- [x] 2.3 Render the main `<h1>` tag with classes: `font-serif text-5xl md:text-7xl font-normal text-ink`.
- [x] 2.4 Include `<slot />` inside the `<h1>` to render the main title text.

## 3. Design System Integration

- [x] 3.1 Update `src/pages/design-system.astro` to import the new `H1` molecule.
- [x] 3.2 Add a showcase block in the "Molecules" section demonstrating the `H1` molecule with and without the eyebrow text.
