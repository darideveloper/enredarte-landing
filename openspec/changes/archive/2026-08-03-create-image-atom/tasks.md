## 1. Create Atom Component

- [x] 1.1 Create `src/components/atoms/Image.astro`.
- [x] 1.2 Define the component props (`src: string`, `alt: string`, `aspectRatio?: 'video' | 'square' | '4/5' | 'auto'`, and `class?: string`).

## 2. Implement Rendering Logic

- [x] 2.1 Calculate aspect ratio class based on `aspectRatio` prop (`aspect-video`, `aspect-square`, `aspect-[4/5]`).
- [x] 2.2 Render the `<img>` tag applying the `object-cover`, `w-full`, and `h-full` classes, plus the calculated aspect ratio class and any custom classes.
- [x] 2.3 Pass `src` and `alt` properties to the `<img>` tag.

## 3. Design System Integration

- [x] 3.1 Update `src/pages/design-system.astro` to import the new `Image` atom.
- [x] 3.2 Add a showcase block in the "Atoms" section demonstrating the `Image` atom with different aspect ratios (e.g. default/auto and video).
