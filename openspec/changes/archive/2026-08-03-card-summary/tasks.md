## 1. Create Molecule Component

- [x] 1.1 Create `src/components/molecules/CardSummary.astro`.
- [x] 1.2 Define the component props (`title: string`, `artist?: string`, `price?: string`).

## 2. Implement Rendering Logic

- [x] 2.1 Set up the main container with the dark background overlay (`bg-black/88`), backdrop blur (`backdrop-blur-sm`), padding (`p-4 md:p-5`), and max width (`max-w-[260px]`).
- [x] 2.2 Render the title using the exact serif font and styling from the mockup (`font-serif text-base text-paper mb-1`).
- [x] 2.3 Conditionally render the artist name (if provided) using uppercase styling (`text-[10px] text-muted tracking-wider uppercase mb-2.5`).
- [x] 2.4 Conditionally render the price (if provided) using crimson text (`text-sm text-crimson`).

## 3. Design System Integration

- [x] 3.1 Update `src/pages/design-system.astro` to import the new `CardSummary` molecule.
- [x] 3.2 Add a showcase block in the "Molecules" section demonstrating the `CardSummary` molecule with all props provided.
- [x] 3.3 Add a secondary showcase block demonstrating the `CardSummary` molecule with only the title provided.
