## Context

Landing (`Home.astro`) renders the interactive collection section: `Filters` + `Artworks` React islands (`client:load`) bound to the persisted zustand `catalog` store, with `ImageCard` slot children stamped with six `data-*` facet attributes and per-lang `price`. The `/obras` index (`CollectionIndex.astro`, `pageKey === "obras"`) renders a static Astro `div` grid (`lg:3`) of `ImageCards` with only `{src, alt, title, href, meta}` — no filters, no prices, no facets. Both pages already receive the same `siteData` (artworks + `filterGroups`), and `toArtworkView` already returns facets and raw prices, so `/obras` drops data it already has. `Artworks` toggles visibility today via per-card `hidden` flags; it has no notion of a result cap. `docs/component-dependencies.md` is a living doc that must stay in sync with import changes (per `AGENTS.md`).

## Goals / Non-Goals

**Goals:**
- One grid implementation (`Artworks`) and one filter implementation (`Filters`) serving both landing (capped preview) and `/obras` (full catalog).
- Landing filters search the whole catalog (filter-then-cap), capped silently at the last 12 matches in API order (3 full rows at `lg:4`).
- `/obras` shows all matches uncapped with prices, identical grid, and carried-over selections.

**Non-Goals:**
- URL-synced filters (`/obras?artist=…`) — parked as an explicit follow-up.
- Count hints ("+N more") or in-place show-more on landing — overflow is served by the existing CTA.
- Touching `salas` / `artistas` / `curadores` branches, `GalleryPage`, `ArtistPage`, or the store shape.

## Decisions

**1. Cap as an optional `limit` prop on `Artworks` (not a sliced children list).**
The matching pass already iterates all cards; extend it to collect matches in DOM order, then apply `slice(-limit)` when set and hide the head. Rationale: passing the full catalog keeps filters meaningful (a static 16-child slice would be cap-then-filter, which was rejected in discovery). Alternative considered — build-time slice in `Home.astro`: zero `Artworks` change but filters dead-end on works that exist on `/obras`. Rejected.

**2. Tail preference (`slice(-limit)`), not head.**
"Last 12" was defined as API-order tail, and it must hold both unfiltered and filtered. Since DOM order equals API order (both pages map `siteData.artworks` without re-sorting — enforced by tasks 2.1/3.1), taking the tail of the match list satisfies both cases with one rule. Alternative — `slice(0, limit)`: simpler to describe but shows the oldest works and contradicts the agreed definition. Rejected.

**3. Conditional obras branch inside `CollectionIndex` (no shared-section extraction yet).**
Replicate Home's `localizedGroups + facets + Filters + Artworks + ImageCard(+price, +data-*)` block verbatim behind `pageKey === "obras"`. Rationale: smallest blast radius — landing, gallery, and artist pages are untouched; `GalleryPage` already duplicates this pattern with its own 2-group variant, so a third call-site is idiomatic here. Alternative — extract `<ArtworksSection>` organism now: DRYer but forces landing into the refactor and couples grid density/price policy prematurely. Deferred until the UX proves out.

**4. `LANDING_LIMIT = 12` constant next to Home's collection section.**
Single source for the magic number (12 = 3 full rows at `lg:4`); `Artworks` default stays uncapped so `/obras` and `GalleryPage` need no prop.

**5. Keep persisted carry-over; no store change.**
`catalog.ts` already persists `selections` + `isExpanded` under `enredarte-catalog-storage`, so landing → `/obras` continuity (active filters and panel expansion) works with zero code. "All visible by default" falls out of the empty-selection state. Alternative — reset on `/obras` mount: more predictable index but breaks the "Ver todas keeps my filters" story that was chosen. Rejected.

**6. Identical default grid on `/obras` (no `gridClassName` override).**
"Same grid" literally: drop the bespoke `lg:3 / gap-1` div so future `Artworks` grid tweaks apply everywhere. The `gridClassName` escape hatch remains for later divergence.

## Risks / Trade-offs

- [Risk] Landing ships N cards in DOM instead of 16 → larger initial HTML/JS-hidden nodes. → Mitigation: cards are `hidden`, not removed; catalogs are tens of artworks, and `/obras` already ships all of them. Accept.
- [Risk] Persisted selections can make `/obras` open pre-filtered, surprising visitors who expect "all". → Mitigation: chosen behavior; empty-state + reset button is one click away. Revisit if analytics complain.
- [Risk] Copy-pasted composition block drifts between Home and CollectionIndex. → Mitigation: parked shared-section extraction as follow-up; docs sync keeps the duplication visible.
- [Risk] `hidden` + tail-cap interplay with the GSAP entrance/filter animations specified on `Artworks`. → Mitigation: cap applies visibility flags through the same `hidden` mechanism animations already observe; verify entrance cascade still reads correctly with capped cards.

## Migration Plan

Static-site change, no data migration. Deploy normally; rollback is a revert. No feature flag (both pages are public content, change is atomic across 3 files + docs).

## Open Questions

- None blocking. Parked follow-ups: (1) URL-synced filters for shareable selections; (2) shared `<ArtworksSection>` extraction if a third full-catalog call-site appears.
