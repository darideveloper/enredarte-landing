# design.md — artwork-slider-gallery

## Context

The artwork detail page (`/obras/<slug>`) initially laid out all gallery images in the sticky hero, layered and crossfaded by a GSAP scroll-scrub. Two problems drove this change: the hero's `object-cover` framing cropped tall (portrait) artworks, losing content, and many images made the page and scrub timeline grow unboundedly. The implemented solution splits the page into a single-image hero (primary image only) plus a bounded gallery section below — a dark `ArtistCard` left, a Swiper React slider of all images right — and serves slider images through the same responsive `astro:assets` pipeline the `Image` atom uses. This design documents the (already shipped and verified) implementation so it is reviewable and its rationale is explicit.

## Goals / Non-Goals

**Goals:**
- Show every artwork image at full size and true aspect ratio (no `object-cover` cropping) in a bounded, non-letteryboxed gallery.
- Keep the hero as a fast, preloaded LCP limited to the primary image.
- Match the site's existing visual language (dark card pattern from `CuratorCard`, paper/ink/crimson, containers) and Astro image best practices.
- Reuse existing components/helpers as much as possible; add no new i18n strings.

**Non-Goals:**
- Not changing routing, `getStaticPaths`, or LCP preload wiring in `[...path].astro`.
- Not a lightbox/zoom feature.
- Not internationalizing Swiper's built-in screen-reader announcements.
- Not removing the `ArtworkImageViewer` scrub code (left defensive; the page feeds it one image).

## Decisions

### D1: Single-image hero + dedicated gallery section
The hero receives `{ ...detail, images: [is_primary ?? first] }`, so `ArtworkImageViewer` takes its existing static branch (no scrub, no counter). All images, including the primary, are offered again in the gallery slider. Rationale: keeps the hero fast and uncropped-context-free while guaranteeing the full artwork is always visible below.
*Alternatives:* letterboxing the hero (`object-contain`) — rejected (hero loses immersion); a click-to-zoom overlay — rejected (hides the full image).

### D2: Swiper React for the gallery
Added `swiper` (v14). The `ArtworkSlider` island (`client:visible`, so JS and Swiper CSS only load when scrolled into view) uses `swiper/react` with `Navigation`, `Pagination`, `A11y` modules, `slidesPerView={1}`, no autoplay, and no `autoHeight`.
*Alternatives:* Swiper Element (web component, no React runtime) — rejected, the user required the React version; hand-rolled `ImageRowCard` rows — rejected, would repeat the title/price card per image and double the info already shown in `ArtworkInfoPanel`; raw `<img>` with no optimization — rejected (loses the sharp pipeline).

### D3: Orientation-aware, centered `object-contain` framing
Each slide is a flex-centered box (`.artwork-slide { display:flex; align-items:center; justify-content:center }`). At `lg` the image fills the column box (`lg:h-full lg:w-full object-contain`); `object-contain` then centers and auto-fits — portrait fills height, landscape fills width — so a single class handles both orientations and always centers. The slider canvas is `bg-paper`, so letterbox reserves blend with the page.
*Rationale:* the earlier `w-auto` portrait approach failed to center (an inline image in a block slide sits left; `object-contain` only centers an overflowing box). Flex-centering + a full box resolves centering for every orientation and N.

### D4: Image optimization via a `slider` slot + `slideSet` helper
Added `IMAGE_SLOTS.slider`: `widths [640,1080,1600]`, `sizes "(max-width:768px) calc(100vw - 48px), (max-width:1024px) calc(100vw - 112px), calc(100vw - 556px)"` — matching the rendered column exactly so the browser never downloads oversized candidates (a 2400w candidate would otherwise be dead weight). Added `slideSet(src, slot)` to `src/lib/images.ts`: the same AVIF+WebP `getImage` pair with retry and verbatim-URL fallback the `Image` atom uses, returning a `SlideSet` so the React island keeps byte parity with atom output. Slides are precomputed in the `ArtworkPage` frontmatter.
*Alternatives:* reusing the `viewer` slot — rejected, its `sizes` describe the old hero geometry and overstated sizes waste bytes.

### D5: `ArtistCard` molecule + sticky/equal-height composition
New `src/components/molecules/ArtistCard.astro` is modeled on `CuratorCard` and adapted for `Artist` (`global.artist.label` eyebrow, linked name, years · location metadata, social links, on-dark bio, portrait). The gallery grid is `lg:grid-cols-[380px_1fr] items-stretch`; the card adds `lg:self-start lg:sticky lg:top-[93px]` (content-height and pinned below the header), and the section must not set `overflow:hidden` (it disables sticky). Desktop slider fills the column via a `lg` media block forcing `height:100%; min-width:0` on slider/swiper/wrapper.
*Rationale:* reuses a proven molecule; `items-start` can never give equal heights, so `items-stretch` + sticky card gives "card at own height + equal row."

### D6: Controls branding
Swiper's default blue navigation/bullets are rebranded in `src/styles/global.css` on `.artwork-slider` via `--swiper-navigation-color`, `--swiper-pagination-color`, `--swiper-pagination-bullet-inactive-color`, `--swiper-pagination-bullet-inactive-opacity` (ink arrows, crimson active bullet, translucent ink inactive). A counter overlay (`n / N`) tracks the active slide when N > 1.

## Risks / Trade-offs

- **Swiper client weight** → Mitigated: `client:visible` + island-scoped CSS import, so the runtime loads only when the section is in view.
- **Screen-reader announcements in English on ES pages** → Accepted limitation (documented as non-goal) to avoid adding SR-only i18n keys.
- **React island under `ClientRouter`** → The island remounts cleanly (same pattern as `BuyWidget`/`Artworks`); no GSAP-style swap handling needed.
- **Sticky broken by ancestor `overflow`** → Mitigated: the gallery section does not set `overflow:hidden`.
- **`sizes` drift if the layout changes** → `lib/images.ts` documents the exact column arithmetic; any grid/padding change must be reflected in the `slider` slot.

## Migration Plan

Already-shipped, additive change: the gallery section is gated on `{ artist || slides.length > 0 }`, so it renders nothing for artists/images-less inputs; the hero is unaffected for single-image artworks. Rollback is reverting `ArtworkPage.astro`, the two new component files, the `slider` slot + `slideSet`, and the `global.css` rules.

## Open Questions

- None.