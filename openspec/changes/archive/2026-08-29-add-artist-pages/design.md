# add-artist-pages Design

## Context

EnredArte is an Astro SSG fed by a Django DRF API at build time. All routes funnel through the single catch-all `src/pages/[...path].astro`, which calls `buildSiteData()` once and threads a shared `SiteData` prop into per-slug page components (`Home`, `GalleryPage`, `ArtworkPage`) selected via `COMPONENT_MAP`. The gallery page already demonstrates the target rhythm — hero + curator card + a curated artworks section — so the artist page is an extension of an established pattern, not a new architectural shape.

The API's `Artist` type has no direct gallery relation. Galleries are linked to artworks in both directions: `Artwork.gallery_links` and `Gallery.artwork_links`. The artist's "active galleries" therefore must be derived through their artworks.

## Goals / Non-Goals

**Goals:**
- A build-time artist detail page per artist, in Spanish (`/artistas/<slug>`) and English (`/en/artistas/<slug>`), reached via the existing catch-all.
- Render artist info (photo, name, bio, years, location, email/website/socials), their artworks as a static editorial list, and their currently-active galleries.
- Maximal reuse of existing components and data helpers.
- A discoverability entry point (artist name link on artwork detail pages) and fixed nav anchors.

**Non-Goals:**
- No artists index page (`/artistas` listing) — explicitly declined.
- No filter UI on the artist page — the artworks section is deliberately static.
- No new visual world; the page inherits the "Gallery Salon" design system (DESIGN.md unchanged).
- No e-commerce, forms, or new API endpoints.

## Decisions

### 1. Extend the catch-all route, no new route file
Artist paths are pushed from `siteData.artists` in `[...path].astro`'s `getStaticPaths()` (`artistas/<slug>` es, `en/artistas/<slug>` en), `ArtistPage` joins `COMPONENT_MAP` under `artist`, and `artistSlug` is threaded through props with a `localizedPaths` branch (`getLocalizedArtistPath`) and a `preloadImage` branch (artist photo, falling back to featured artwork).
**Why:** identical to how `GalleryPage`/`ArtworkPage` were added; keeps routing in one file. **Alternative rejected:** a `src/pages/artistas/[slug].astro` route — would split routing and re-fetch site data.

### 2. Derive active galleries from the artist's artworks
`resolveArtistGalleries(artist, galleries, artworks)` collects every `GalleryLink` across the artist's artworks, deduplicates by gallery id, filters to `is_active`, and orders primary-first then by gallery index in `siteData.galleries`. This matches "the gallery where he is active right now": an artist appears in a gallery exactly when one of their works is hung there.
**Why:** the API has no artist→gallery relation; this is the only faithful derivation. **Alternative rejected:** using `Gallery.artwork_links` reversed — equivalent but requires scanning all galleries; artwork-side is more direct.

### 3. Add locations to the build-time data
`buildSiteData()` already fetches 9 resources; add `listLocations` and expose `locations` on `SiteData` so the artist's `location: Ref` resolves to a localized name (fallback: the slug). One extra additive fetch at build time; no consumer breaks.
**Why:** the endpoint already exists (`src/lib/api/locations.ts`) and the type is already modeled; displaying the slug raw would leak non-localized identifiers. **Alternative rejected:** show `location.slug` directly — ugly, not bilingual.

### 4. Page composition (top to bottom)
1. **Artist hero** — paper section, `lg:grid-cols-[1fr_360px]`: left is eyebrow "Artista" (`Headline` muted), `h1` name (serif `text-4xl md:text-5xl`), bio (`text-description`), a metadata line of years · location (12px uppercase muted, composed inline, e.g. `1985 · Los Cabos`), and contact/social links (crimson 11px tracked; website shown via `stripUrlScheme`); right is the photo in `aspect-[4/5]` (`Image` atom) over the `#0D0D0D` container with initials fallback (the `CuratorCard` photo grammar). Section omitted fields that don't exist.
2. **Artworks** — eyebrow "Explora" + serif title, then the featured artwork as `ImageBanner` (`overlay="darker"`) followed by alternating `ImageRowCard`s tagged with `getFacetLabel("discipline|technique|theme")`. Reuses the exact `GalleryPage` artworks markup minus the `Filters` island. Order: `is_highlighted` first, then API order (via `resolveArtistArtworks`). Section omitted when the artist has no works.
3. **Active galleries** — eyebrow "Activa en" + serif title, then the active galleries as `ImageCard`s (typically 1–3, no hard cap) in a `grid-cols-1 md:grid-cols-3` grid built from `toSalaView` (localized name, "Sala NN" subtitle, work count, curator line). Section omitted when empty.
**Why:** mirrors `GalleryPage` so visitors get a consistent gallery-reading rhythm, and every block reuses a tested component. **Alternative rejected:** homepage-style `ImageCard` mosaic for artworks — loses the editorial, tag-rich reading the gallery page established; `ImageRowCard` list was chosen.

### 5. Entry point: artist name on artwork detail
Add `artistSlug` to `ArtworkDetailView` (from `artwork.artist.slug`) and wrap the artist `Headline` in `ArtworkInfoPanel` with a link built from `getLocalizedArtistPath`. This is the natural, low-friction path from any artwork to its creator.
**Why:** no artists index exists (declined), so per-artwork linking is the only entry point that always has real content. **Alternative rejected:** linking artist names inside `CardSummary`/`ImageCard` — nested interactive elements inside the card link, plus the islands already wrap everything.

### 6. Fix nav anchors to real sections
In `src/lib/nav.ts` (shared by Header and Footer): `obras` → `#artworks-collection`, `salas` → `#salas-gallery`, `artistas` → `#artworks-collection` (the collection hosts the artist filter; with no index page, this is the honest real target). All three current anchors are dead (the sections are `#salas-gallery` and `#artworks-collection`).
**Why:** the user asked for the anchor fix; leaving `#obras`/`#salas` dead while fixing `#artistas` would be incoherent. Requires MODIFIED deltas to the `header-organism` and `footer-organism` specs, which pinned the placeholder behavior.

### 7. i18n
Add to both `es.json` and `en.json` (parity enforced by `validate-i18n`): `global.artist.label` (Artista/Artist), `global.artist.works` (Obras/Works), `global.artist.activeIn` (Activa en/Active in). Social platform labels reuse `global.footer.social.<platform>` when the key exists, else the raw platform string.

## Risks / Trade-offs

- **Large artist catalogs** → [A long static list of `ImageRowCard`s is heavier than the filterable mosaic] → Acceptable for typical artist page sizes; the `Artworks` island/filters can be added later if catalogs grow (the cards already carry `data-*` facets).
- **No active gallery** → [The section disappears entirely] → Intentional; an artist with no hung works has no gallery to show, and the page still works (hero + works).
- **Artist with no works** → [Empty artworks section] → Section is omitted; the page still shows info + galleries.
- **`og:image` with absolute API URLs** → [`BaseSEO` prepends the site URL, which would corrupt an absolute URL] → Pre-existing behavior on `GalleryPage`; passed consistently, flagged as a follow-up if the user wants og images fixed globally.
- **`obras`/`artistas` share one anchor** → [Redundant-feeling nav] → Accepted trade-off of no index page; revisit if an artists section is ever added to the homepage.

## Migration Plan

No runtime migration: all changes are build-time SSG output. Rollback = revert the PR. The only build-time addition is the `locations` fetch (already reachable endpoint, same token).