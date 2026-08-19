## 1. Update Types

- [x] 1.1 Remove `sort_order: number` from the `Base` interface in `src/lib/api/types.ts` (line 7), leaving `ArtworkImage.sort_order` and `ArtworkLink.sort_order` intact since the backend still returns those

## 2. Derive Gallery Order from Array Position

- [x] 2.1 Update `toSalaView` in `src/data/api.ts` to accept an `index: number` parameter
- [x] 2.2 Change `toSalaView` `isLarge` from `gallery.sort_order === 1` to `index === 0`
- [x] 2.3 Change `toSalaView` `subtitle` from using `gallery.sort_order` to using `String(index + 1)`
- [x] 2.4 Update the `toSalaView` call in `src/components/pages/landing/Home.astro` (`.map((gallery, index) => ...)`) to pass the index

## 3. Update Gallery Detail Page

- [x] 3.1 In `src/components/pages/sala/GalleryPage.astro`, compute the gallery index from `siteData.galleries` via `findIndex(g => g.slug === gallery.slug)` and use `index + 1` for the `eyebrow` instead of `gallery.sort_order`

## 4. Verify

- [x] 4.1 Run the dev server / build and confirm the "Pabellón de Salas" card subtitles read "Sala 01", "Sala 02", etc. (no "Sala undefined")
- [x] 4.2 Confirm the first gallery renders as the large/featured card and detail page eyebrows no longer show "undefined"
