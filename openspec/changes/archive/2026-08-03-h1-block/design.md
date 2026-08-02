## Context
We are creating the H1 molecule for the Hero section. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Combine the `Headline` atom and standard HTML tags into a cohesive, reusable molecule.
- Accept an `eyebrow` string prop (or slot) and the main heading text as the default slot.
- Implement responsive spacing (`gap-4`) and typography (`font-serif text-5xl md:text-7xl`).

**Non-Goals:**
- Paragraph text or call-to-actions are not part of the `H1` molecule itself; they will be handled at the Organism level to keep this molecule focused purely on the heading text structure.

## Decisions

- **Props vs Slots**: We will use an `eyebrow` prop (string) for the top small text since it's simple text. The main title will be passed via the default `<slot />` allowing for potential nested span highlights or italics if needed in the future.
- **HTML Element**: The molecule container will be a `<div>` or `<header>` enclosing a `<Headline>` and an `<h1>`. Actually, a simple `<div>` wrapper with `flex flex-col gap-4` works best.
- **Tailwind Classes**:
  - Container: `flex flex-col gap-4`
  - Main Heading: `font-serif text-5xl md:text-7xl font-normal text-ink`

## Risks / Trade-offs
- Hardcoding the `<h1>` tag inside this molecule means we cannot reuse it for a `<section>` that requires an `<h2>`. However, since this is explicitly named `H1`, it implies semantic usage at the top level of the page, so this is acceptable.
