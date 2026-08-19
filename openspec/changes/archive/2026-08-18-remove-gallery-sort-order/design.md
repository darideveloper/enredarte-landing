## Context

The backend DRF API has removed `sort_order` from all top-level resource endpoints (galleries, artists, disciplines, etc.). The frontend `Base` type in `src/lib/api/types.ts` still declares `sort_order: number`, creating a type-runtime mismatch. For galleries, this causes `gallery.sort_order` to be `undefined` at runtime, which surfaces as "Sala undefined" in card subtitles on the homepage and gallery detail pages.

The `sort_order` field still exists in nested objects (`ArtworkImage`, `ArtworkLink`) — those are unaffected.

## Goals / Non-Goals

**Goals:**
- Remove `sort_order` from the `Base` interface to match the actual API response
- Derive gallery display order from the array position in the API response
- Fix the "Sala undefined" bug on homepage and detail pages
- Update the gallery-data spec to reflect the new behavior

**Non-Goals:**
- Changing the backend API
- Affecting other resource types (artists, disciplines, etc.) beyond removing `sort_order` from `Base`
- Changing how `ArtworkLink.sort_order` or `ArtworkImage.sort_order` work (still in API)

## Decisions

### D1: Remove `sort_order` from `Base` entirely (not just making it optional)

**Decision:** Delete `sort_order: number` from the `Base` interface.

**Rationale:** The backend doesn't return `sort_order` for any top-level resource (verified: galleries, artists, disciplines, techniques, themes, formats, scales, art-curators). Making it optional would be technically correct but misleading — it implies some resources might have it. Removing it from `Base` and leaving it on nested types (`ArtworkImage`, `ArtworkLink`) where it actually exists is cleaner.

**Alternative considered:** Make `sort_order` optional on `Base` (`sort_order?: number`). Rejected because it weakens the type contract for no benefit — no top-level resource returns it.

### D2: Derive gallery order from array index

**Decision:** Use the gallery's 0-based index in the `siteData.galleries` array as the display order.

**Rationale:** The API returns galleries in a specific order (presumably the intended display order). The array index is the simplest, most direct way to derive order without adding new fields or assumptions.

**Alternatives considered:**
- Use `gallery.id` as sort key — rejected because ID order doesn't necessarily match display order.
- Use `created_at` — rejected because creation time doesn't imply display order.
- Add a client-side `sort_order` field — rejected because it's unnecessary indirection; the array order IS the order.

### D3: `toSalaView` receives index as a parameter

**Decision:** Add an `index: number` parameter to `toSalaView`.

**Rationale:** The function needs to know the gallery's position to compute `isLarge` (index === 0) and `subtitle` (index + 1). Passing it as a parameter keeps the function pure and explicit.

### D4: GalleryPage.astro looks up index from siteData

**Decision:** In the detail page, find the gallery's index by searching `siteData.galleries` for the matching slug.

**Rationale:** The detail page receives `siteData` as a prop and `gallerySlug` to identify the current gallery. Computing `siteData.galleries.findIndex(g => g.slug === gallerySlug)` is straightforward and doesn't require new props or data fetching.

## Risks / Trade-offs

- **[Risk]** API response order changes between builds → gallery numbering changes. **Mitigation:** This is the same risk as before (sort_order was also mutable on the backend). The API response order is the source of truth in both cases.
- **[Trade-off]** Removing `sort_order` from `Base` is a type-level breaking change for any code that accesses `resource.sort_order` on a top-level resource. **Mitigation:** Verified no code does this except the gallery-specific code being changed in this change.
