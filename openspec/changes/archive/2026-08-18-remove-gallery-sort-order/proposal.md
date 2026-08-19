## Why

The backend API no longer returns `sort_order` for galleries (or any top-level resource). The frontend `Base` type still declares `sort_order: number`, causing `gallery.sort_order` to be `undefined` at runtime. This produces "Sala undefined" in the gallery card subtitles on the homepage and detail pages — a user-visible bug.

## What Changes

- Remove `sort_order` from the `Base` interface in `src/lib/api/types.ts` (it's absent from all top-level API responses: galleries, artists, disciplines, techniques, themes, formats, scales, art-curators).
- Derive gallery display order from array position (index in the API response) instead of a `sort_order` field.
- Update `toSalaView` to accept an `index` parameter and use it for `isLarge` and `subtitle`.
- Update the `Home.astro` caller to pass the index.
- Update `GalleryPage.astro` to look up the gallery's index from `siteData.galleries` for the eyebrow.
- Update the `gallery-data` spec to reflect that `sort_order` is no longer part of the Gallery type and subtitles derive from array position.

## Capabilities

### Modified Capabilities

- `gallery-data`: The Gallery type no longer includes `sort_order`. Card subtitles and the `isLarge` flag derive from the gallery's position in the API response array, not from a `sort_order` field.

## Impact

- **Types**: `src/lib/api/types.ts` — `Base` interface loses `sort_order`.
- **Data mapping**: `src/data/api.ts` — `toSalaView` signature and body change; callers in `Home.astro` change.
- **Detail page**: `src/components/pages/sala/GalleryPage.astro` — eyebrow calculation changes.
- **Spec**: delta spec at `changes/remove-gallery-sort-order/specs/gallery-data/spec.md` — gallery-data requirements updated to reflect array-position derivation.
- **No breaking API changes**: The backend already doesn't return `sort_order`; this aligns the frontend type system with reality.
- **Nested types unaffected**: `ArtworkImage.sort_order` and `ArtworkLink.sort_order` are still returned by the API and remain unchanged. `resolveGalleryArtworks` (which sorts `artwork_links` by `ArtworkLink.sort_order`) requires no change.
