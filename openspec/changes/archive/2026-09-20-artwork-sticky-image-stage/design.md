## Context

The artwork detail page (`src/components/pages/obra/ArtworkPage.astro`) rendered a two-column desktop layout: `ArtworkImageViewer` left, `ArtworkInfoPanel` right. For multi-image artworks the whole section was pinned by a GSAP ScrollTrigger (`pin: true`, `end: +=(n-1)*100%`) while the panel declared its own fixed box (`lg:sticky lg:top-[93px] lg:h-[calc(100svh-93px)] lg:overflow-y-auto`). Live measurement on prod (`cien-miradas`, 1280x720, single image — no pin involved) showed panel content 959px inside a 627px box with the buy button at y=939 below the viewport, and `panel.scrollTop` stuck at 0 after paging to the footer. Two independent scroll containers meant the footer was reachable without ever seeing the conversion slot. Constraints: keep the scroll-driven crossfade (a named product capability), keep mobile and `prefers-reduced-motion` behavior, no new dependencies, Tailwind v4 arbitrary values, shared 93px header token.

## Goals / Non-Goals

**Goals:**
- Single page scrollbar on desktop; footer reachable only past the buy widget / status badge.
- Preserve the multi-image crossfade, `1 / N` counter, and scrub-immediacy below the header.
- Converge desktop toward the mobile scroll model (one scroll container).

**Non-Goals:**
- No visual redesign (paper/ink/crimson, serif title, dark stage unchanged).
- No copy, pricing, SEO, or visit-counter changes.
- No per-image timeline weighting (even split default).

## Decisions

- **Sticky image stage instead of sticky info panel.** The artifact leads (Experience mode): a stable `calc(100svh - 93px)` stage while editorial content flows past reads as standing before a painting reading its plaque. Alternative A (no stickiness anywhere, image stretches to info height) was rejected because tall descriptions would crop the artwork arbitrarily via `object-cover`. Alternative C (split panel with fixed buy bar) was rejected because it keeps two scrollbars — a keyboard/focus hazard — with the most code.
- **Pin-less scrub (`pin: false`, trigger = section, `start: "top 93px"`, `end: "bottom bottom"`).** The pin was never the effect; the crossfade timeline is. Page scroll drives the timeline through the info column's natural height, so scrub distance scales with content instead of image count. Rejected: keeping `pin: true` (reintroduces pin-spacing scroll detached from the CTA) and deleting the timeline entirely (drops a product capability).
- **Guard: skip the timeline when the section fits the viewport.** With `end: "bottom bottom"` and zero scroll distance the scrub would jump to the end; short-info artworks show the first image statically instead.
- **Viewer fills the stage (`height: 100%`) instead of `min-height: 100vh`.** The old reservation would overflow the `100svh - 93px` sticky box; the stage now owns the reservation.
- **Hardcode the 93px header token in the new sticky class**, same as before — header height changes rarely; no CSS-var plumbing.

## Risks / Trade-offs

- [Risk] Very tall info content makes the crossfade dwell long per image → Mitigation: even-split timeline keeps pacing proportional; revisit weighting only on complaint.
- [Risk] Header height drift (logo/padding change) desyncs `top-[93px]` from `start: "top 93px"` → Mitigation: both live in the same two files as before; re-measure via `header.getBoundingClientRect().bottom` if `Header.astro` changes.
- [Risk] `ScrollTrigger.refresh()` timing with late image decode → Mitigation: existing `refresh()` call kept; trigger measures final layout.
- [Trade-off] Single-image artworks lose nothing, but multi-image artworks lose the "locked" pin feel — accepted: the lock was the bug vector.

## Migration Plan

Already implemented and working. Rollback: revert the six files (3 components, 2 specs, dependency doc) — no data migration, no API change. Docs `docs/component-dependencies.md` already re-synced, so no post-merge doc step remains.

## Open Questions

- None blocking. Optional follow-up: bias timeline dwell toward the primary image instead of the even split.
