# Design — Gallery Immersive Walk

## Context

The gallery detail page (`GalleryPage.astro`) rendered its artworks with a featured `ImageBanner` followed by alternating `ImageRowCard`s, all constrained to the `max-w-6xl` content container. Portrait artworks created rows taller than the viewport, so the info card scrolled out of sight. This design converts the page into an immersive, full-bleed walk reusing the existing design system — the Paper/Ink/Crimson tokens, the `Image` and `CardSummary` atoms, and the `Filters`/`Artworks` React islands — and introduces no new dependencies, APIs, or data changes.

## Goals / Non-Goals

**Goals**
- Full-bleed hero image and artworks section (bleeding past the `max-w-6xl` container).
- Artwork images at their natural aspect ratio, never cropped and never placed in a fixed-size container.
- Info card vertically centered relative to its artwork and pinned near the middle of the viewport while a tall row scrolls.
- Mobile stacking (image above info card), filtering, i18n, and `ArtistPage` behavior unchanged.

**Non-Goals**
- No new dependencies; no GSAP/ScrollTrigger scroll choreography — CSS `position: sticky` covers the scroll behavior without JS or a reduced-motion branch.
- No featured `ImageBanner` position — every artwork renders through the same row.
- No changes to the homepage `Hero`, `ArtistPage`, or the `ImageBanner` molecule itself.

## Decisions

### 1. Natural aspect ratio, not a fixed-size panel
Each row's image column uses `height="auto"` (the existing `Image` atom behavior), so rows take the artwork's true height: square works render 1:1, portrait works stretch tall. Alternatives considered and rejected:
- **`object-contain` on a fixed `100svh` dark panel** — produced empty/black wall space and fixed-size rows (this was the first attempt and was rejected by the user).
- **`object-cover` filling the row height** — would crop portrait and square artworks, unacceptable for a gallery.

### 2. CSS sticky for the centered info card (not GSAP)
The info column is a grid item that stretches to the row height; it is a `flex flex-col justify-center` container, so the card is vertically centered in the row. The card itself gets `md:sticky md:top-[35svh]`.
- **Short rows**: the card is simply centered; the sticky offset has no effect.
- **Tall rows**: when the card would scroll above `35svh`, it pins near the middle of the viewport until the row's end, then releases and scrolls away with the row.

Why two layers instead of one:
- `align-self: center` directly on the sticky element **disables the sticky constraint** (verified in-browser) — the element keeps riding with the row. Centering must live on a wrapper while the sticky element stays a normal flow child.
- `transform: translateY(-50%)` for optical centering shifts the element's static position too, breaking the centered layout on short rows. `top: 35svh` is an approximation that reads as "middle" for the short card bodies without a transform.

GSAP pinning (pin + `pinSpacing: false`) was considered but introduces a visible "pop" at release when the fixed position diverges from the natural row position, plus a `prefers-reduced-motion` fallback. CSS sticky is jarring-free and native.

### 3. Remove `overflow-hidden` from the artworks section
An `overflow: hidden` ancestor becomes the sticky element's scroll container, so `position: sticky` pins against the section instead of the viewport and never engages. The artworks section therefore has no `overflow-hidden`; the full-bleed rows produce no horizontal overflow because every image is `w-full` inside its own column (verified `scrollWidth == innerWidth` on desktop and mobile).

### 4. Every artwork is an immersive `ImageRowCard`
The featured `ImageBanner` branch was removed; the `Artworks` grid receives every artwork as an `ImageRowCard` with `immersive` and the existing `data-*` facet attributes, so filtering still toggles `hidden` on the rows. The former featured work is simply the first row. The first-remaining split (`const [featured, ...rest]`) collapsed to `const [featured]` used only for the hero/SEO image.

### 5. Full-bleed hero
The hero image moved out of the container to a full-bleed `h-[55svh] md:h-[75svh]` layer using the existing `object-cover` treatment (consistent with `Hero.astro` and `ImageBanner`). Header text stays in the container.

### 6. `immersive` prop isolates the change
`ImageRowCard` gained an `immersive?: boolean` prop; the default branch is markup-identical to the previous layout (same classes, structure, and behavior, wrapped in the new ternary only), so `ArtistPage` and the design-system page are untouched.

## Risks / Trade-offs

- **[Card pinned at `35svh`, not exact optical center]** → Acceptable: card bodies are short and the offset reads as "middle". Adjustable in one class if a taller card ever needs it.
- **[Sticky requires no clipping ancestor]** → The section no longer clips. Guardrail: keep the artworks section free of `overflow-hidden`; verified no horizontal scroll exists.
- **[The `Artworks` grid `gap-[3px]` is inert between rows]** → Pre-existing: Astro wraps slot children in a single `<astro-slot>`, so row spacing comes from each row's `border-b`, not the grid gap. Accepted and unchanged.

## Migration Plan

The change is already implemented and shipped in the working codebase; this document records the design as-built. Rollback consists of reverting `GalleryPage.astro` and `ImageRowCard.astro` to their previous versions (both are git-tracked); `ArtistPage` needs no action because the default `ImageRowCard` branch is unchanged. No database, build, or environment steps apply.

## Open Questions

None.