## Why

We need a reusable UI building block (molecule) for section headers that wraps an `<h2>` element and allows for flexible content like an eyebrow (the `<Headline>` atom) and an optional "view all" link. This ensures visual consistency across major sections like "Pabellón de Salas".

## What Changes

- Create a new `Title.astro` molecule component.
- The component will render an `<h2>` wrapper for slotted content.
- It will accept optional `linkText` and `linkHref` props to render an action link alongside the title.
- It will utilize existing flex utility classes for layout.

## Capabilities

### New Capabilities
- `title-molecule`: Reusable section header component supporting slotted headlines and optional right-aligned action links.

### Modified Capabilities

## Impact

- `src/components/molecules/Title.astro` (New file)
- Can be utilized in the `Gallery` organism and any other major page sections requiring this header style.
