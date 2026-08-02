## Why

We are building a responsive Hero section based on the design mockups (`.designs/enredarte_mockup_A_salas_DESCARGAR.html`). Following Atomic Design principles, we need to create the smallest building block first: the `Headline` atom, which is responsible for rendering category tags and highlighted text blocks with specific typography and color styles (e.g. `red` or `default`).

## What Changes

- Create a new `<Headline />` atom component using Astro.
- It will accept children text through a slot.
- It will support color variations (e.g. `red`, `default`, `muted`) utilizing our Tailwind configuration.

## Capabilities

### New Capabilities
- `headline-atom`: Defines the behavior contract, props, and styling for the Headline atom text component.

### Modified Capabilities

## Impact

- Creates a new component file at `src/components/atoms/Headline.astro`.
- This component will be used later in higher-level components like `<H1 />` and `<Hero />`.
