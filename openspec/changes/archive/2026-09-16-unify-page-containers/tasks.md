## 1. Shared container contract

- [x] 1.1 Add `@utility container-site-canvas / -reading / -narrow` variants to `src/styles/global.css` (fallback: `@layer components` plain classes)
- [x] 1.2 Verify utilities compile (dev server starts, classes resolve in inspector)
- [x] 1.3 Adopt canvas variant in landing reference sections (`Home.astro` artworks collection, `Gallery.astro` section, `Header.astro` bar) — pixel-identical output
- [x] 1.4 Verify landing pixel-identical at 375/768/1440/1920px before migrating other pages

## 2. Blog pages

- [x] 2.1 Migrate `BlogIndex.astro` header (line ~47), empty-state wrapper (~65), grid wrapper (~74) to canvas variant
- [x] 2.2 Migrate `BlogPost.astro` hero overlay (~96) and no-banner header (~111) to canvas variant; confirm body (~118) uses reading variant
- [x] 2.3 Verify `/blog`, `/en/blog`, and a post page at 375/768/1440/1920px against landing edges

## 3. Sala and artista pages

- [x] 3.1 Migrate `GalleryPage.astro` header (~81), artworks header (~98), filters wrapper (~105) to canvas variant; apply canvas variant (section-level `px-6 md:px-14`) to `#sala-artworks` (~97)
- [x] 3.2 Migrate `ArtistPage.astro` inner grid (~91) to canvas (drop cap, keep section padding)
- [x] 3.3 Verify a sala page and an artista page (obras + salas sections) at all four widths

## 4. Collection, curator, banner, footer

- [x] 4.1 Migrate `CollectionIndex.astro` wrapper (~63) to canvas variant
- [x] 4.2 Migrate `CuratorHero.astro` inner (~29) and `CuratorSalas.astro` inner (~21) to canvas variant
- [x] 4.3 Change `BannerBar.astro` `md:px-12` to `md:px-14`
- [x] 4.4 Apply footer decision: full-bleed section + centered `max-w-6xl` inner in `Footer.astro`
- [x] 4.5 Verify collection, curator, footer pages at all four widths

## 5. Docs and final verification

- [x] 5.1 Update `docs/component-dependencies.md` with the shared container construct and tier assignment
- [x] 5.2 Grep audit: no `max-w-6xl/3xl/5xl` layout container without `mx-auto` outside the shared construct and text-measure caps
- [x] 5.3 `pnpm run build` passes; all routes emit; no regressions on mobile
