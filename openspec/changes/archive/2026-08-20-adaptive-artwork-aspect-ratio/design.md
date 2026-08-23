## Context

The gallery (`GalleryPage`) renders remaining artworks as alternating `ImageRowCard` rows. Today every row forces the image into a fixed-height container (`min-h-[320px] md:min-h-[440px]`) with `object-cover w-full h-full`, which crops artworks that don't match the container's ratio. Artworks vary between landscape, portrait, and square, so relevant parts get cut off.

The images carry no `width`/`height` metadata in the API (`ArtworkImage`), and the `format` taxonomy is artwork *type*, not aspect ratio. The browser, however, knows each image's intrinsic ratio natively.

Separately, the shared `cn` utility (`src/lib/utils.ts`) is a bare `join(" ")` with no conflict resolution, so class overrides across the design system are unreliable.

## Goals / Non-Goals

**Goals:**
- Render every artwork fully, uncropped, at its natural aspect ratio in `ImageRowCard`.
- Keep the default crop behavior for existing `Image` consumers (`ImageCard`, `ImageBanner`, `Hero`) unchanged.
- Make `cn` de-duplicate conflicting Tailwind utilities so overrides work reliably.
- Zero client JS, zero API/backend changes, no layout shift.

**Non-Goals:**
- No backend/dashboard changes to add image dimensions to the API.
- No client-side JS detection (no `onload` probing).
- No uniform-row grid layout (rows may vary in height by design).

## Decisions

### D1: Let the browser's natural ratio drive the height (Option A)
Instead of a fixed-height crop box, render `<img class="w-full h-auto">` and drop the `min-h`/`absolute`/`object-cover` from the `ImageRowCard` image container. The browser computes the height from the image's intrinsic ratio — no JS, no layout shift, full artwork visible.

- **Why:** Simplest correct solution. Each `ImageRowCard` is an independent 2-column row, so variable row heights are acceptable (magazine/editorial layout) and the info card already centers vertically.
- **Alternatives considered:** client `onload` probing (JS + layout shift), server-side probing at build (needs fetching remote `*.localhost` images + a new dep; fragile), API dimension fields (backend work out of scope), `object-contain` (letterboxing), aspect buckets (still crops). Rejected for this change.

### D2: Add a `height` prop to the `Image` atom instead of relying on class overrides
`Image.astro` currently hardcodes `object-cover w-full h-full`. Rather than pass a conflicting `class` from each call site (fragile), expose an explicit `height?: "full" | "auto"` prop defaulting to `full`. `ImageRowCard` passes `height="auto"`. This keeps the atom's contract explicit and preserves default behavior for all other consumers.

- **Why:** The atom is used by multiple components expecting crop behavior; an explicit prop is clearer than a class override and doesn't depend on merge semantics at every call site.
- **Note:** D4 (tailwind-merge) makes the override approach viable too, but the explicit prop is the primary mechanism; merge is defense-in-depth.

### D3: Keep natural-ratio rows uncapped (A1, with optional guard)
Primary behavior: pure `w-full h-auto` with no `min-h`. To avoid extreme overflow for very tall/wide artworks, apply a safety `max-h` (e.g. `max-h-[70vh]`) with `object-contain` fallback only as a guard. If the guard complicates the simple case, ship pure A1 first and add the guard only if real assets require it.

### D4: Add `clsx` + `tailwind-merge` to `cn`
Replace `src/lib/utils.ts` `cn` with `clsx` composition piped through `tailwind-merge`, so `h-full` vs `h-auto`, `object-cover` vs `object-contain`, `aspect-*` conflicts resolve last-wins. `clsx` preserves the existing string/boolean-conditional signature.

- **Why:** Standard, tiny, well-maintained deps (shadcn convention). Fixes a general class-composition weakness across the whole app, not just this bug.
- **Alternatives considered:** leave `cn` as-is (then D2 is the only override mechanism — sufficient but leaves the general weakness); write a custom merger (reinventing a solved problem).

## Risks / Trade-offs

- [Variable row heights feel less "grid-like"] → Accepted: rows are independent; vertical centering keeps it composed. Optional aspect-bucket variant (F) is a future enhancement, not this change.
- [`tailwind-merge` could theoretically drop a class it misclassifies] → Only affects utility classes passed through `cn`; standard utilities are well-covered. Verify the affected `ImageRowCard` output in dev after implementing.
- [Extreme aspect ratios overflow viewport] → Mitigated by the optional `max-h` guard (D3); revisit with real assets.
- [Changing `cn` is cross-cutting] → Low risk: `clsx` is a drop-in for the current string/boolean inputs; behavior change is additive (conflict resolution).

## Migration Plan

- Add `clsx` and `tailwind-merge` to `package.json` dependencies.
- Update `cn` in `src/lib/utils.ts`; all existing callers remain valid (strings/booleans).
- Update `Image.astro` (add `height` prop) and `ImageRowCard.astro` (use `height="auto"`, remove fixed container).
- Manually verify gallery rows with landscape, portrait, and square artworks in dev; confirm no regression in `ImageCard`/`ImageBanner`/`Hero` (still default `full`).
- Rollback: revert the three file edits; `cn` change is backward-compatible so safe to ship independently.

## Open Questions

- Whether to ship the `max-h` guard (D3) now or wait for real artwork assets. Default: ship pure A1, add guard only if needed.
- Whether `tailwind-merge` should also be applied in the `Image` atom's internal `cn` usage or only at the shared utility level (default: shared utility only).
