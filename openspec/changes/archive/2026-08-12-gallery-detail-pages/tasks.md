## 1. Data layer

- [x] 1.1 Add a `slug` field to the `Artwork` interface and every artwork entry in `src/data/catalog.ts`
- [x] 1.2 Declare gallery/curator response types in `src/lib/api/types.ts` (e.g. `Gallery`, `ArtCurator`, `GalleryTranslation`, `ArtCuratorTranslation`, `ArtworkGallery`) matching the backend models
- [x] 1.3 Create `src/data/galleries.ts` exporting `Gallery`/`ArtCurator` data (5 galleries, bilingual `name`/`description` and curator `bio`, `logo` reusing a gallery image, `sortOrder` + `status` per gallery, `curator` reference) satisfying the API types without casts
- [x] 1.4 Populate each gallery's ordered `artworks` by referencing `Artwork` slugs from `data/catalog.ts` (~3-4 artworks per gallery, 16 total distributed)
- [x] 1.5 Export a `salasData`-shaped view (or mapping helper) from `galleries.ts` with localized `href` (`/salas/<slug>` / `/es/salas/<slug>`) for the homepage `Gallery` organism

## 2. Routing

- [x] 2.1 Extend `getStaticPaths()` in `src/pages/[...path].astro` to emit `salas/<slug>` (en) and `es/salas/<slug>` (es) for every gallery in the module (active and upcoming alike), with `props: { pageKey: "gallery", gallerySlug, lang }`
- [x] 2.2 Add a `gallery` entry to `COMPONENT_MAP` in `[...path].astro`
- [x] 2.3 Add a slug-preserving helper for gallery paths (e.g. `getLocalizedSalaPath(slug, lang)`) in `src/lib/i18n/utils.ts` and reuse it for links, LangBtns, and Home card hrefs

## 3. Components

- [x] 3.1 Create `src/components/molecules/CuratorCard.astro` (photo via `Image`, name, localized bio, email/website links; card styling aligned with `CardSummary`)
- [x] 3.2 Create `src/components/molecules/ImageRowCard.astro` (alternating image/info-card row composed from `Image` + `CardSummary`-style info card showing title, artist, discipline/technique/theme; stacks on mobile; accepts and forwards `data-*` facet attributes)
- [x] 3.3 Extend `src/components/atoms/LangBtns.astro` with an optional `path` prop that builds the other-language gallery URL while keeping the existing route-map behavior as the default

## 4. Gallery page

- [x] 4.1 Create `src/components/pages/sala/GalleryPage.astro` receiving `{ lang, gallerySlug }`: looks up the gallery from `galleries.ts`, renders hero (eyebrow derived from `sortOrder`/`status`, localized name, description, large `Image`), `CuratorCard`, and the artworks section
- [x] 4.2 In `GalleryPage`, render the artworks section with the existing `Filters` island limited to the `artist` and `technique` groups (localized) and the existing `Artworks` island wrapping `ImageRowCard` children stamped with `data-*` facets
- [x] 4.3 In the artworks section, render the first artwork (by `sort_order`) via the existing `ImageBanner` as the featured banner and the rest as alternating `ImageRowCard`s
- [x] 4.4 Wire `PageSEO` on the gallery page with explicit localized `title`/`description`/`ogImage` props
- [x] 4.5 Pass the slug-preserving path to `LangBtns` on the gallery page (via `GalleryPage` → `Layout`/`Header` if needed)

## 5. Homepage integration

- [x] 5.1 Remove the inline `salasData` from `src/components/pages/landing/Home.astro` and derive the `Gallery` section's cards from `galleries.ts` (real `href`s to detail pages, subtitles from `sortOrder`/`status`)
- [x] 5.2 Leave the `#salas` nav anchor unchanged (no salas index page in scope) and document that decision in `docs/component-dependencies.md` Notes

## 6. i18n

- [x] 6.1 Add gallery-page labels ("Sala", "Curaduría", "Obras de la sala", "Activa", "Próximamente", etc.) to `src/messages/en.json`
- [x] 6.2 Add the matching keys to `src/messages/es.json` (parity enforced by `validate-i18n`)

## 7. Docs & validation

- [x] 7.1 Update `docs/component-dependencies.md` (new `GalleryPage` tree, `CuratorCard`/`ImageRowCard`, `data/galleries.ts`, LangBtns path prop; refresh Notes)
- [x] 7.2 Run `pnpm build` (runs `validate-i18n` + `validate-imports`) and confirm it passes
- [x] 7.3 Manual check: open `/salas/<slug>` and `/es/salas/<slug>`, verify hero/curator/artworks, minimal filters, featured + rows, language switch, homepage card navigation
