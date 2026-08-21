# Component Dependency Map

Living reference of how pages compose components (and subcomponents) in this project.

> **Keep this in sync.** Whenever pages or components are added, removed, renamed, or
> their imports change, regenerate the diagram below and update the Notes section.

## Pages layer

`src/pages/` contains a single catch-all route plus two auxiliary endpoints:

```
src/pages/
├── [...path].astro       ← the only real route (i18n catch-all)
├── design-system.astro   ← standalone showcase page (noindex)
└── robots.txt.ts         ← API route, no components
```

`[...path].astro` drives everything through `getStaticPaths()`:

- Calls `buildSiteData()` from `src/data/api.ts` once, which fetches every backend resource
  (galleries, artists, art-curators, the five taxonomies, artworks) via the `src/lib/api/*`
  endpoint modules and `fetchAll` pagination helper, then derives localized filter groups.
- Emits the route-map pages and one detail page per gallery from the API
  (`salas/<slug>` en / `es/salas/<slug>` es), threading the shared `siteData` prop
  through to `Home`/`GalleryPage`.
- Looks up the page component in `COMPONENT_MAP` → `home: Home`, `gallery: GalleryPage`.
- Wraps the result in `Layout.astro`, passing `localizedPaths` (the en/es gallery URLs) to `Layout` → `Header` → `LangBtns` so the language switch preserves the gallery slug.

## Full dependency diagram

```
                            ┌──────────────────────────────────────────────┐
                            │                [...path].astro               │
                            └──────────────┬───────────────┬───────────────┘
                                           │               │ routes (i18n)
                                           ▼               ▼
                    Home.astro / GalleryPage.astro    lib/i18n/routes.ts
                            │               │          data/api.ts (buildSiteData)
                            │               ▼          lib/api/* (10 endpoint modules,
                            ▼        lib/i18n/utils      pagination.fetchAll)
                   ┌───────────────────────────────────────────────────┐
                   │                    Layout.astro                    │
                   │  global.css                                        │
                   │  <body>                                            │
                   │   ├─ Header.astro (localizedPaths → LangBtns)      │
                   │   ├─ <slot/> = page content                        │
                   │   └─ Footer.astro                                  │
                   └───────────────────────────────────────────────────┘
```

### Home.astro tree

```
Home.astro ──────────────► data/api.ts (toHeroView → HeroView, resolved from primary gallery)
├── PageSEO.astro ─► BaseSEO.astro ─► { consts.ts, site-config.ts, lib/i18n/utils }
├── Hero.astro ─────────────► data/api.ts (HeroView `sala` prop: title/description/curator/artwork)
│   ├── H1.astro ──────────────► lib/utils (cn)
│   ├── Headline.astro ────────► lib/utils
│   ├── ImageBanner.astro
│   │   ├── Image.astro ────────► lib/utils
│   │   └── CardSummary.astro ──► lib/utils
│   └── Btn.astro ─────────────► lib/utils
├── BannerBar.astro
│   └── BannerText.astro ───────► lib/utils
├── Gallery.astro
│   ├── Title.astro ────────────► lib/utils (atoms)
│   ├── Headline.astro
│   └── ImageCard.astro
│       ├── Image.astro
│       └── CardInfo.astro ─────► lib/utils (atoms)
├── Title.astro ────────────────► lib/utils (atoms)
├── Headline.astro
├── Filters.tsx (React island, client:load) ─► atoms/FilterBtn.tsx, atoms/FilterToggle.tsx ─► store/catalog.ts, lib/utils
│   └── data/api.ts (API-derived groups + artwork facets, localized in Home.astro; viability via store/catalog.ts `computeViableOptions`)
└── Artworks.tsx (React island, client:load) ─► store/catalog.ts, lib/utils
    └── ImageCard.astro (slot children, stamped with space-separated data-* facets) ─► { Image, CardInfo }
```

### GalleryPage.astro tree (per gallery, `/salas/<slug>` + `/es/salas/<slug>`)

```
GalleryPage.astro
├── PageSEO.astro ─► BaseSEO.astro (explicit title/description/ogImage props)
├── Headline.astro ───────► lib/utils
├── Image.astro ───────────► lib/utils
├── CuratorCard.astro (molecule)
│   ├── Image.astro
│   └── lib/i18n/utils (getTranslations, pickTranslation)
├── Filters.tsx (React island, client:load; artist + technique groups only)
│   └── atoms/FilterBtn.tsx, atoms/FilterToggle.tsx ─► store/catalog.ts
├── Artworks.tsx (React island, client:load; grid columns overridden via `gridClassName`)
│   └── ImageBanner.astro (featured artwork, data-* facets)
│       ├── Image.astro
│       └── CardSummary.astro
│   └── ImageRowCard.astro (remaining artworks, alternating image/info-card, data-* facets)
│       ├── Image.astro
│       ├── CardSummary.astro
│       └── data/api.ts (ArtworkView + tag labels via getFacetLabel)
├── data/api.ts (siteData prop: gallery lookup by slug, curator/artwork/artist resolution)
│   ├── lib/api/*.ts (types, client, pagination, 10 endpoint modules)
│   ├── store/catalog.ts (GroupKey)
│   └── lib/i18n/utils (getTranslations, pickTranslation, getLocalizedSalaPath)
└── lib/i18n/utils (getTranslations)
```

### Layout.astro tree (Header + Footer shared by every page)

```
Layout.astro
├── styles/global.css
├── Header.astro
│   ├── Logo.astro ─────────────► lib/utils (cn)
│   ├── LangBtns.astro
│   │   └── lib/i18n/utils (getLocalizedPath)
│   ├── Menu.astro
│   │   └── Link.astro ─────────► lib/utils
│   ├── lib/nav.ts ─────────────► lib/i18n/utils (getNavLinks)
│   ├── lib/utils
│   └── lib/i18n/utils
├── <slot/> = page content (Home.astro)
└── Footer.astro (dark ink palette)
    ├── Logo.astro (bg-red-circle variant) ──► lib/utils (cn)
    ├── Link.astro (footer variant) ─► lib/utils
    ├── Headline.astro ───────────────► lib/utils
    ├── LangBtns.astro (inverse variant)
    │   └── lib/i18n/utils (getLocalizedPath)
    ├── lib/nav.ts (shared getNavLinks with Header)
    │   └── lib/i18n/utils
    ├── data/site-config.ts (BUSINESS_DATA, SOCIAL_LINKS, PHONES, EMAIL)
    └── lib/i18n/utils (getLangFromUrl, getLocalizedPath, getTranslations)
```

### design-system.astro tree (showcase, imports the component library directly)

```
design-system.astro
├── Btn, Logo, Link, Headline, Image, BannerText (atoms, .astro)
├── FilterBtn (atoms, .tsx React island, named export)
├── H1, Menu, ImageBanner (molecules, .astro)
├── LangBtns, CardSummary, Title, CardInfo (atoms, .astro)
├── Filters (molecules, .tsx React island, named export)
├── Header, Gallery (organisms, .astro)
├── Artworks (organisms, .tsx React island, named export)
└── styles/global.css
```

### SEO chain (used by Home)

```
PageSEO.astro ─► BaseSEO.astro
                  ├── consts.ts (SITE_TITLE, SITE_DESCRIPTION, LOCALE_MAP)
                  ├── data/site-config.ts
                  └── lib/i18n/utils (getLocalizedPath, getTranslations)
```

## Shared leaf layer

Everything below is a terminal dependency imported by multiple components:

- `lib/utils.ts` — `cn()` helper (nearly every component)
- `lib/gsap.ts` — Central GSAP instance & SSR-safe plugin registration (see `docs/gsap-scrolltrigger/`)
- `lib/i18n/utils.ts` — `getTranslations`, `pickTranslation`, `getLocalizedPath`, `getLocalizedSalaPath`
- `lib/i18n/routes.ts` — `routes` map, `PageKey` type
- `lib/i18n/ui.ts` — translation dictionaries
- `lib/nav.ts` — `getNavLinks(lang)`, shared nav source for Header and Footer
- `data/site-config.ts` — `BUSINESS_DATA`
- `data/api.ts` — `buildSiteData()` (build-time fetch of all 10 backend resources), `SiteData`, and view builders (`toArtworkView`, `toSalaView`, `toHeroView`/`HeroView` (homepage hero from the primary `Gallery`), `resolveGalleryArtworks`, `resolveGalleryCurator`, `resolveArtistName`, `getFacetLabel`)
- `lib/api/types.ts` — API-faithful types (`Base`, `Ref`, `Translations<T>`, `Paginated<T>`, `ApiError`, 10 resource interfaces)
- `lib/api/client.ts` — `safeFetch`/`FetchError`/`apiFetch` (token-injecting fetch)
- `lib/api/pagination.ts` — `fetchAll` pagination helper
- `lib/api/{artists,art-curators,locations,galleries,disciplines,techniques,themes,formats,scales,artworks}.ts` — `list`/`detail` endpoint modules
- `store/catalog.ts` — `GroupKey`, `ArtworkFacets` (array-valued), `matchesArtwork`, `computeViableOptions`
- `consts.ts` — `SITE_TITLE`, `SITE_DESCRIPTION`, `LOCALE_MAP`
- `styles/global.css` — design tokens (`bg-paper`, `text-crimson`, …)

## Notes

- **Two page components.** The single catch-all `[...path].astro` now serves `Home`
  (root `/` + `/es`) and one `GalleryPage` per gallery fetched from the backend API
  (`/salas/<slug>` + `/es/salas/<slug>`). The generic `Services`/`About` pages were
  removed in the `remove-dummy-pages` cleanup.
- **Gallery detail pages**: `GalleryPage.astro` renders a hero (eyebrow "Sala 0N" derived
  from `sort_order` only), a `CuratorCard` (full gallery/curator data resolved from the
  art-curators list), and an artworks section reusing the `Filters`/`Artworks` React
  islands but limited to the `artist` + `technique` groups and the gallery's own artworks
  (resolved from `artwork_links`, ordered by `sort_order`). The first artwork renders as a
  featured `ImageBanner`, the rest as alternating `ImageRowCard`s; all carry space-separated
  `data-*` facet values so the `Artworks` island parses them into arrays before matching.
  `Artworks` accepts an optional `gridClassName` prop that replaces its default
  `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` columns (GalleryPage passes a single-column grid).
- **Language switch on gallery pages**: `LangBtns` accepts an optional `localizedPaths`
  prop (the en/es gallery URLs), threaded through `Layout` → `Header` from
  `[...path].astro` via `getLocalizedSalaPath`. Without the prop, behavior is the
  route-map default (unchanged).
- **Homepage salas data**: the `Gallery` section now derives its cards from the galleries
  fetched via `buildSiteData()` (via `toSalaView`): real `href`s to detail pages, subtitles
  from `sort_order` only (no status suffix), and the curator line from the resolved curator.
- **Homepage hero data**: the `Hero` organism (line ~52 of `Home.astro`) now receives a
  `sala` prop resolved by `toHeroView()` in `data/api.ts` from the primary `Gallery`
  (`is_primary === true`, falling back to the first gallery). It renders the gallery's
  localized name/description, curator, and featured artwork; the badge "Sala NN" uses the
  primary gallery's array index. `<Hero />` without props still renders via safe defaults
  (design-system showcase).
- **Build-time backend dependency**: `getStaticPaths` calls `buildSiteData()` which fetches
  the DRF API using `API_BASE_URL`/`API_TOKEN` (server-only, never `PUBLIC_*`). The backend
  must be reachable and the token valid during `astro build`; a failure surfaces a `FetchError`.
- **Nav anchors**: the `salas`/`obras`/`artistas` nav items still point at `#salas`,
  `#obras`, `#artistas` homepage anchors — there is no salas index page in scope.
- **Design-system page** is a standalone showcase and is intentionally not part of the
  runtime page tree.
- **Orphaned / not reachable from any page** (candidates for cleanup):
  - `molecules/GlobalLoader.tsx`
- **`Image` atom height prop**: `atoms/Image.astro` supports an optional `height` prop (`"full"` default | `"auto"`). `ImageRowCard` uses `height="auto"` so each artwork renders at its natural aspect ratio (no fixed-height crop); all other consumers (`ImageCard`, `ImageBanner`, `Hero`) keep the default `full` behavior. `lib/utils` `cn` now composes via `clsx` + `tailwind-merge` (last-wins on conflicting utilities).
- **Reference stateful atom**: `atoms/Input.tsx` is the store-bound form atom (vanilla, self-bound via `useField`, injectable hook prop). `atoms/ValidatedInput.tsx` no longer exists — its responsibilities folded into `Input`.
- **Store machinery**: `store/` (`form.ts`, `useField.ts` — zustand + zod) is kept as shared state for upcoming form work. `store/catalog.ts` (zustand + persist, `useCatalog` hook, `matchesArtwork` predicate, `computeViableOptions` helper) is the shared filter-state store for the interactive collection section.
- **Interactive collection**: filter groups and artwork data are derived from the backend API in `data/api.ts` and threaded into pages via the `siteData` prop. `atoms/FilterBtn.tsx` and `atoms/FilterToggle.tsx`, `molecules/Filters.tsx`, and `organisms/Artworks.tsx` are React islands (`client:load`) bound to `store/catalog.ts`; `Filters` collapses to the first group by default with an expand/collapse toggle whose `isExpanded` state is persisted in the store, and disables chips that can no longer match any artwork (`disabled` prop on `FilterBtn`, viability computed client-side from the `facets` prop via `computeViableOptions`); `Artworks` receives `ImageCard.astro` slot children stamped with space-separated `data-*` facet attributes (parsed into arrays before matching), toggles their visibility, and renders a localized empty-state block (`emptyLabel`/`resetLabel` props) with a restart-filters button backed by the store's `reset` action when no card matches. The old `.astro` versions of `Filters`/`FilterBtn`/`Artworks` were removed.
