## Context

The artwork detail page previously rendered its image viewer inside a `max-w-6xl` container with an equal-width two-column grid and a fixed `aspect-[4/5]` image box. On desktop the artwork was visually subordinate to surrounding chrome. The change establishes an immersive, full-height presentation where the artwork dominates and the editorial info recedes into a fixed-width side panel, and it fixes three rendering defects discovered while making that layout work: a scroll dead-zone under the sticky header, a white seam/gap when the ScrollTrigger pin engages, and hardcoded description hex values. All changes are already implemented in the working tree; this document records the design decisions behind them.

## Goals / Non-Goals

**Goals:**
- Make the artwork the dominant visual element on desktop via a full-bleed, viewport-height presentation.
- Keep the info panel independently scrollable and always visible during the pinned image scrub.
- Ensure the pin-and-scrub begins immediately on scroll (no dead-zone) and renders without white seams or a load-time blink.
- Extend the token system rather than introducing new hardcoded colors.

**Non-Goals:**
- No new behavior or features beyond what is currently implemented — this change documents the existing state.
- No changes to routing, data fetching, SEO, or localization.
- No changes to the reduced-motion or mobile stacked fallback beyond aligning its breakpoint with the new layout.

## Decisions

### 1. Asymmetric full-bleed grid instead of constrained equal columns
Replaced `max-w-6xl` + `lg:grid-cols-2` with `grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]` and removed the section's horizontal padding. The image zone takes the full remaining viewport width; the info panel is a fixed-width companion.

**Why:** A 50/50 split inside a 1152px container left the artwork small and the panel oversized. An asymmetric split with a narrow panel maximizes image real estate while keeping a readable editorial column.
**Alternative considered:** A 2fr/1fr ratio — rejected because the fixed-width column (`380px`/`420px`) gives predictable panel typography regardless of viewport.
**Alternative considered:** Image-only full-bleed with info in an overlay — rejected because it hides the spec list and price that collectors need.

### 2. Viewport-height image box instead of `aspect-[4/5]`
Removed the fixed `aspect-[4/5]` from the image container and set `.artwork-viewer { min-height: 60vh }` with `min-height: 100vh` at `≥1024px`. Images fill the box via `object-cover`.

**Why:** A `4/5` box capped the image well below the viewport, defeating "bigger images." Full viewport height makes the artwork fill the screen. The `60vh` mobile minimum keeps the page compact below the immersive breakpoint.
**Alternative considered:** `aspect-video` or a taller `3/4` — rejected; neither achieves the immersive full-height intent.

### 3. ScrollTrigger breakpoint aligned to the immersive layout (768px → 1024px)
The pin-and-scrub `matchMedia` condition moved from `(min-width: 768px)` to `(min-width: 1024px)`, and the stacked fallback to `(max-width: 1023px)`.

**Why:** Below 1024px the layout stacks (image above info), so pinning the section makes no sense there. The desktop-only immersive layout is the only place the scrub is used.

### 4. Header-aware pin start (`start: "top 80px"`)
Changed the ScrollTrigger `start` from `"top top"` to `"top 80px"`, matching the sticky header's height (padding + logo ≈ 77px, rounded to 80px).

**Why:** With `start: "top top"`, the first ~77px of scroll was spent revealing the section from behind the sticky header before the scrub engaged — a dead-zone. Offsetting the start to the header's bottom makes the animation begin immediately.
**Trade-off:** The 80px constant is coupled to the header's height; a header height change requires revisiting this value.

### 5. Removing `min-h-screen` from the grid wrapper to fix the pin gap
The grid wrapper originally carried `min-h-screen`. When ScrollTrigger pins, it inserts a pin-spacer sized to the element's height; the `min-h-screen` wrapper created a height mismatch that produced a visible gap when the pinned element shifted to `position: fixed`.

**Why:** The viewer's own `min-height: 100vh` already establishes the immersive height; the wrapper's redundant `min-h-screen` only caused the spacer mismatch. Removing it lets the pin spacer match the real layout height.
**Alternative considered:** Keeping `min-h-screen` and adjusting `pinSpacing` — rejected; removing the redundant constraint is simpler and matches the source of truth (the viewer CSS).

### 6. Paper base background on `<body>`
Added `bg-paper` to the `<body>` class in `Layout.astro`.

**Why:** The body previously had no background, so the browser-default white showed through the ~3px seam between the sticky header bottom and the pinned section's `top: 80px` offset — the "line / gap / blink." Coloring the base canvas paper makes every seam (pins, overscroll, page edges) render in the page tone. This also matches the DESIGN.md "Paper Rule" and `design-system.astro`, which already set `bg-paper` on its body.
**Alternative considered:** Aligning the pin start to the exact header height instead — fragile (header height varies by breakpoint/font loading) and fixes only this page's seam, not the base white canvas.

### 7. Sticky info panel with CTA in normal flow
On `lg+` the panel becomes `sticky top-0 overflow-y-auto` with a height of `calc(100vh - 80px)` — the viewport minus the pinned section's `top: 80px` offset, so the panel's bottom aligns exactly with the viewport bottom even at short window heights. It uses a `border-l` separator (replacing the old `border-t`). The inquiry CTA renders directly after the spec data in normal document flow, spaced by the panel's `gap-8` (32px) rhythm. Below `lg`, the panel uses a `border-t` and standard padding.

**Why:** A sticky full-height panel keeps the editorial content and CTA available for the entire pinned scrub, matching the gallery-wall metaphor.
**Why not bottom-anchored:** The earlier `mt-auto` wrapper pushed the CTA to the bottom of the `h-screen` container, which overflowed the visible panel on shorter viewports. Flowing the CTA after the data with the standard spacing keeps it reachable without depending on viewport height.
**Alternative considered:** Keeping the CTA pinned to the panel bottom with a partial overlap — rejected; it caused the overflow defect this decision fixes.

### 8. `description` color token
Added `--color-description: #7A7568` to the Tailwind theme and migrated the hardcoded `text-[#7A7568]` in `ArtworkInfoPanel`, `Hero`, and `GalleryPage` to `text-description`.

**Why:** The value was used in three places as body-copy color; promoting it to a token aligns with the `global-colors` capability and DESIGN.md's token-first rule.

## Risks / Trade-offs

- **[Header height coupling]** → The `top 80px` start depends on the sticky header's height. Mitigation: header height is stable (fixed padding + logo size) and documented in the spec; a future header change must revisit this value.
- **[Desktop-only immersive height]** → `min-height: 100vh` forces images to cover the viewport on desktop regardless of source aspect. Mitigation: acceptable for a gallery presentation; stacked `4/5` fallback below 1024px preserves the artwork's natural shape on mobile/tablet.
- **[Sticky panel viewport height]** → On short viewports the panel becomes a scroll region. Mitigation: `overflow-y-auto` keeps all spec rows and the CTA reachable.
- **[`bg-paper` on body]** → Dark sections (footer, image cards) rely on their own backgrounds; body paper only affects areas with no section background, which is the desired seam-free behavior. Low risk.

## Migration Plan

No migration required — the change is already implemented and verified via `pnpm build` (19 pages). Rollback consists of reverting the touched files: `ArtworkPage.astro`, `ArtworkImageViewer.astro`, `ArtworkInfoPanel.astro`, `Layout.astro`, `global.css`, `Hero.astro`, `GalleryPage.astro`.

## Open Questions

None — the implementation matches the current working tree and the modified specs.