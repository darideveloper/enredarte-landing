## Context
We need to create the `Image` atom for use in building complex visual elements on the right side of the Hero section, such as `ImageBanner`. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Create a standard, reusable `Image.astro` component wrapper for the `<img>` tag.
- Implement object-fit sizing to prevent distortion (`object-cover`).
- Support predefined aspect ratios using Tailwind utility classes (`aspect-video`, `aspect-square`, `aspect-[4/5]`, etc.).

**Non-Goals:**
- Advanced image optimization (like Astro's `<Image />` component) is not strictly required at this stage. We will use a standard `<img>` tag with standard CSS for simplicity, though we could leverage Astro's `Image` later if optimization becomes a priority. For now, layout and styling control is the focus.

## Decisions

- **HTML Element**: We will use a standard `<img>` tag, but conditionally wrapped in a `<div>` if an aspect ratio is provided. Actually, since aspect-ratio utilities in Tailwind can be applied directly to the `<img>` tag, we don't necessarily need a wrapper. However, to guarantee layout stability, standard practice often involves `w-full h-full object-cover` on the image itself, with `aspect-*` optionally applied. We will apply `aspect-*` directly to the `<img>` combined with `object-cover w-full h-full` to achieve a perfectly sized and cropped image without needing extra DOM elements.
- **Aspect Ratio Prop**: We will accept a string prop `aspectRatio` (e.g., `'video' | 'square' | '4/5' | 'auto'`) that maps to Tailwind classes.

## Risks / Trade-offs
- Applying `w-full` forces the image to expand to its container's width. This relies on the parent element to constrain the size correctly, which is a standard pattern in Tailwind development but requires careful integration in molecules.
