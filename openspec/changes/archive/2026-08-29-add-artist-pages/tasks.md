## 1. Data layer (`src/data/api.ts`)

- [x] 1.1 Fetch `locations` in `buildSiteData()` (add `listLocations` import) and expose `locations: Location[]` on `SiteData`
- [x] 1.2 Add `resolveArtistArtworks(artist, artworks)` — artworks where `artist.id` matches, ordered `is_highlighted` first then API order
- [x] 1.3 Add `resolveArtistGalleries(artist, galleries, artworks)` — dedupe `gallery_links` across the artist's artworks, keep `is_active` only, order primary-first then gallery index
- [x] 1.4 Add a location-name resolver (`resolveLocationName(ref, locations, lang)`) using `pickTranslation`, falling back to the slug
- [x] 1.5 Add `artistSlug` to the `ArtworkDetailView` interface and populate it in `toArtworkDetailView` from `artwork.artist.slug`

## 2. Routing and i18n

- [x] 2.1 Add `getLocalizedArtistPath(slug, lang)` in `src/lib/i18n/utils.ts` (`/artistas/<slug>` es, `/en/artistas/<slug>` en)
- [x] 2.2 Add `global.artist.label`, `global.artist.works`, `global.artist.activeIn` keys to both `src/messages/es.json` and `src/messages/en.json` (parity required by `validate-i18n`)

## 3. Artist page component (`src/components/pages/artista/ArtistPage.astro`)

- [x] 3.1 Create `ArtistPage.astro` with props (`lang`, `artistSlug`, `siteData`), resolving the artist + `PageSEO` (title=name, description=bio, ogImage=photo ?? featured artwork, alternateUrls)
- [x] 3.2 Render the hero: eyebrow, `h1` name, bio, years · location metadata line, contact/social links, portrait (`aspect-[4/5]`, initials fallback)
- [x] 3.3 Render the artworks section: featured `ImageBanner` + alternating `ImageRowCard`s with discipline/technique/theme tags; omit when the artist has no works
- [x] 3.4 Render the active galleries section: `ImageCard` grid from `toSalaView`; omit when no active gallery

## 4. Wiring

- [x] 4.1 Extend `src/pages/[...path].astro`: artist paths in `getStaticPaths()`, `artist: ArtistPage` in `COMPONENT_MAP`, `artistSlug` prop threading, `localizedPaths` branch, `preloadImage` branch
- [x] 4.2 Link the artist name in `src/components/molecules/ArtworkInfoPanel.astro` to the artist page via `artwork.artistSlug`
- [x] 4.3 Fix nav anchors in `src/lib/nav.ts`: `obras`→`#artworks-collection`, `salas`→`#salas-gallery`, `artistas`→`#artworks-collection`

## 5. Docs and verification

- [x] 5.1 Update `docs/component-dependencies.md` with the `ArtistPage` tree and refresh the Notes section (reachable pages, nav anchors)
- [x] 5.2 Run `pnpm build` (validates i18n + imports) and verify an artist page at desktop and mobile widths against the gallery-page conventions