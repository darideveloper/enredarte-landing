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

- Reads `routes` from `src/lib/i18n/routes.ts` → currently a single key: `home` (en `""` → root, es `es` → `/es`).
- Also emits one detail page per gallery from `data/galleries.ts`: `salas/<slug>` (en) and `es/salas/<slug>` (es).
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
                            │               │            data/galleries.ts
                            │               ▼
                            ▼        lib/i18n/utils (getLocalizedSalaPath)
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
Home.astro
├── PageSEO.astro ─► BaseSEO.astro ─► { consts.ts, site-config.ts, lib/i18n/utils }
├── Hero.astro
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
│   └── data/catalog.ts (fixture groups + artwork facets, localized in Home.astro; viability via store/catalog.ts `computeViableOptions`)
└── Artworks.tsx (React island, client:load) ─► store/catalog.ts, lib/utils
    └── ImageCard.astro (slot children, stamped with data-* facets) ─► { Image, CardInfo }
```

### GalleryPage.astro tree (per gallery, `/salas/<slug>` + `/es/salas/<slug>`)

```
GalleryPage.astro
├── PageSEO.astro ─► BaseSEO.astro (explicit title/description/ogImage props)
├── Headline.astro ───────► lib/utils
├── Image.astro ───────────► lib/utils
├── CuratorCard.astro (molecule)
│   ├── Image.astro
│   └── lib/i18n/utils (getTranslations)
├── Filters.tsx (React island, client:load; artist + technique groups only)
│   └── atoms/FilterBtn.tsx, atoms/FilterToggle.tsx ─► store/catalog.ts
├── Artworks.tsx (React island, client:load; grid columns overridden via `gridClassName`)
│   └── ImageBanner.astro (featured artwork, data-* facets)
│       ├── Image.astro
│       └── CardSummary.astro
│   └── ImageRowCard.astro (remaining artworks, alternating image/info-card, data-* facets)
│       ├── Image.astro
│       ├── CardSummary.astro
│       └── data/catalog.ts (getFacetLabel)
├── data/galleries.ts (gallery lookup by slug)
│   ├── data/catalog.ts (artworks + filter groups, resolved by slug)
│   ├── lib/api/types.ts (ArtCurator, Gallery, Lang)
│   └── lib/i18n/utils (getTranslations)
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
- `lib/i18n/utils.ts` — `getTranslations`, `getLocalizedPath`, `getLocalizedSalaPath`
- `lib/i18n/routes.ts` — `routes` map, `PageKey` type
- `lib/i18n/ui.ts` — translation dictionaries
- `lib/nav.ts` — `getNavLinks(lang)`, shared nav source for Header and Footer
- `data/site-config.ts` — `BUSINESS_DATA`
- `data/catalog.ts` — `Artwork` (with `slug`), `filterGroups`, `getFacetLabel`
- `data/galleries.ts` — `GalleryData`/`galleries` (5 dummy galleries + curators), `getSalasData(lang)` for the homepage section
- `lib/api/types.ts` — `Lang`, `LocalizedText`, `ArtCurator`, `Gallery`, `GalleryTranslation`, `ArtCuratorTranslation`, `ArtworkGallery`
- `consts.ts` — `SITE_TITLE`, `SITE_DESCRIPTION`, `LOCALE_MAP`
- `styles/global.css` — design tokens (`bg-paper`, `text-crimson`, …)

## Notes

- **Two page components.** The single catch-all `[...path].astro` now serves `Home`
  (root `/` + `/es`) and one `GalleryPage` per gallery in `data/galleries.ts`
  (`/salas/<slug>` + `/es/salas/<slug>`). The generic `Services`/`About` pages were
  removed in the `remove-dummy-pages` cleanup.
- **Gallery detail pages**: `GalleryPage.astro` renders a hero (eyebrow "Sala 0N" derived
  from `sortOrder`/`status`), a `CuratorCard` (full gallery/curator data), and an artworks
  section reusing the `Filters`/`Artworks` React islands but limited to the `artist` +
  `technique` groups and the gallery's own artworks. The first artwork renders as a
  featured `ImageBanner`, the rest as alternating `ImageRowCard`s (image + info card);
  all carry `data-*` facets so the `Artworks` island filters them. `Artworks` accepts an
  optional `gridClassName` prop that replaces its default `grid-cols-1 sm:grid-cols-2
  lg:grid-cols-4` columns (GalleryPage passes a single-column grid).
- **Language switch on gallery pages**: `LangBtns` accepts an optional `localizedPaths`
  prop (the en/es gallery URLs), threaded through `Layout` → `Header` from
  `[...path].astro` via `getLocalizedSalaPath`. Without the prop, behavior is the
  route-map default (unchanged).
- **Homepage salas data**: the inline `salasData` array was removed from `Home.astro`;
  the `Gallery` section now derives its cards from `data/galleries.ts` via
  `getSalasData(lang)` (real `href`s to detail pages, subtitles from `sortOrder`/`status`).
- **Nav anchors**: the `salas`/`obras`/`artistas` nav items still point at `#salas`,
  `#obras`, `#artistas` homepage anchors — there is no salas index page in scope.
- **Design-system page** is a standalone showcase and is intentionally not part of the
  runtime page tree.
- **Orphaned / not reachable from any page** (candidates for cleanup):
  - `molecules/GlobalLoader.tsx`
  - `lib/api/client.ts` (`safeFetch`) and `lib/api/constants.ts` — `lib/api/types.ts` is
    now used by `data/galleries.ts`.
- **Reference stateful atom**: `atoms/Input.tsx` is the store-bound form atom (vanilla, self-bound via `useField`, injectable hook prop). `atoms/ValidatedInput.tsx` no longer exists — its responsibilities folded into `Input`.
- **Store machinery**: `store/` (`form.ts`, `useField.ts` — zustand + zod) is kept as shared state for upcoming form work. `store/catalog.ts` (zustand + persist, `useCatalog` hook, `matchesArtwork` predicate, `computeViableOptions` helper) is the shared filter-state store for the interactive collection section.
- **Interactive collection**: `data/catalog.ts` holds fixture filter groups (bilingual) and artwork data. `atoms/FilterBtn.tsx` and `atoms/FilterToggle.tsx`, `molecules/Filters.tsx`, and `organisms/Artworks.tsx` are React islands (`client:load`) bound to `store/catalog.ts`; `Filters` collapses to the first group by default with an expand/collapse toggle whose `isExpanded` state is persisted in the store, and disables chips that can no longer match any artwork (`disabled` prop on `FilterBtn`, viability computed client-side from the `facets` prop via `computeViableOptions`); `Artworks` receives `ImageCard.astro` slot children stamped with `data-*` facet attributes, toggles their visibility, and renders a localized empty-state block (`emptyLabel`/`resetLabel` props) with a restart-filters button backed by the store's `reset` action when no card matches. The old `.astro` versions of `Filters`/`FilterBtn`/`Artworks` were removed.
