## Why

We have completed all the foundational atoms and molecules (Image, Headline, H1, CardSummary, and ImageBanner). We now need to compose the final `Hero` organism. The hero section is the first visual element users see on the landing page, and it must be responsive, dynamic, and visually striking.

## What Changes

- Create a new `Hero` organism (`src/components/organisms/Hero.astro`).
- The left column will contain the `H1` molecule with a slotted `Headline` atom, along with body text and curator info.
- The right column will contain the `ImageBanner` molecule, using `public/images/hero.jpg` as the main featured artwork.
- The layout will be a responsive two-column grid (stacking on smaller screens).
- Update the index page to use the `Hero` organism.

## Capabilities

### New Capabilities
- `hero-section`: Defines the requirements for the layout, responsiveness, and composition of the Hero organism.

### Modified Capabilities
<!-- No existing capabilities are modified -->

## Impact

- Adds the main visual focal point of the landing page.
- Utilizes the `image-banner`, `h1-block`, and other previously built atomic design components.
