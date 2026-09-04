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
- Emits the route-map pages, one detail page per gallery from the API
  (`salas/<slug>` es / `en/salas/<slug>` en), one detail page per artwork
  (`obras/<slug>` es / `en/obras/<slug>` en), and one detail page per artist
  (`artistas/<slug>` es / `en/artistas/<slug>` en), threading the shared `siteData`
  prop through to `Home`/`GalleryPage`/`ArtworkPage`/`ArtistPage`.
- Isolated blog fetch (Option A, outside `buildSiteData`): calls `fetchAll(listPosts)` from `src/lib/api/posts.ts`,
  filters `published_at != null`, derives `total_pages = ceil(count/11)`, emits paginated index pages
  (`/blog` + `/blog/page/2` … es, `/en/blog` + `/en/blog/page/2` … en, page 1 is base path, 11-item slices,
  empty-state when `count==0`) and per-post detail pages (`/blog/:slug` es / `/en/blog/:slug` en, drafts excluded).
  Detail pages fetch full `Post` via `detail(slug)` and thread `post: Post` + `postSlug` to `BlogPost`.
- Looks up the page component in `COMPONENT_MAP` → `home: Home`, `gallery: GalleryPage`,
  `artwork: ArtworkPage`, `artist: ArtistPage`, `blog: BlogIndex`, `post: BlogPost`.
- Wraps the result in `Layout.astro`, passing `localizedPaths` (the en/es gallery/artwork/artist *or*
  blog page/post URLs via `getLocalizedSalaPath`/`getLocalizedArtworkPath`/`getLocalizedArtistPath`/
  `getLocalizedBlogPath`/`getLocalizedBlogPagePath`/`getLocalizedPostPath`) to `Layout` → `Header` → `LangBtns`
  so the language switch preserves the slug/page, and `preloadImage` prefers `Post.banner_image` (prefixed with `API_BASE_URL`) for post detail.

## Full dependency diagram

```
                             ┌──────────────────────────────────────────────┐
                             │                [...path].astro               │
                             └──────────────┬───────────────┬───────────────┘
                                            │               │ routes (i18n)
                                            ▼               ▼
 Home / GalleryPage / ArtworkPage / ArtistPage / BlogIndex / BlogPost   lib/i18n/routes.ts
                              │               │          data/api.ts (buildSiteData)
                              │               ▼          lib/api/* (10 endpoint modules + posts, pagination.fetchAll)
                              ▼        lib/i18n/utils (getLocalizedBlogPath/PagePath/PostPath)
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
│   │   └── CardSummary.astro ──► lib/utils, lib/format/price (formatPrice + pickPrice + currencyForLang)
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
    └── ImageCard.astro (slot children, stamped with space-separated data-* facets, formatted `price` from `lang`) ─► { Image, CardInfo }
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
│   └── ImageRowCard.astro (all artworks, `immersive` mode, alternating image/info-card, data-* facets)
│       ├── Image.astro
│       ├── CardSummary.astro ──► lib/utils, lib/format/price
│       └── data/api.ts (ArtworkView + tag labels via getFacetLabel)
├── data/api.ts (siteData prop: gallery lookup by slug, curator/artwork/artist resolution)
│   ├── lib/api/*.ts (types, client, pagination, 10 endpoint modules)
│   ├── store/catalog.ts (GroupKey)
│   └── lib/i18n/utils (getTranslations, pickTranslation, getLocalizedSalaPath)
└── lib/i18n/utils (getTranslations)
```

### ArtworkPage.astro tree (per artwork, `/obras/<slug>` + `/en/obras/<slug>`)

```
ArtworkPage.astro
├── PageSEO.astro ─► BaseSEO.astro (explicit localized title/description/ogImage = primary image)
├── ArtworkImageViewer.astro (molecule, left column)
│   ├── Image.astro ──────────────► lib/utils
│   └── lib/gsap.ts (ScrollTrigger pin+scrub timeline over layered .artwork-image children,
│       gsap.matchMedia() desktop + prefers-reduced-motion branches, astro:after-swap revert
│       + astro:page-load re-init lifecycle; single-image → no pin, static)
└── ArtworkInfoPanel.astro (molecule, right column)
    ├── Headline.astro ───────────► lib/utils
    ├── Btn.astro ────────────────► lib/utils (mailto CTA via data/site-config EMAIL)
    ├── lib/i18n/utils (getTranslations for status/spec labels)
    ├── lib/format/price (formatPrice + pickPrice + currencyForLang on `lang`)
    └── data/api.ts (ArtworkDetailView prop)
    data/api.ts (toArtworkDetailView → images/alt, title, description, artist,
        artistSlug, year, dimensions, priceUsd/priceMxn, status, taxonomy labels via getFacetLabel)
    lib/i18n/utils (getLocalizedArtworkPath)
```

### ArtistPage.astro tree (per artist, `/artistas/<slug>` + `/en/artistas/<slug>`)

```
ArtistPage.astro
├── PageSEO.astro ─► BaseSEO.astro (explicit localized title/description/ogImage = photo ?? featured artwork)
├── Headline.astro ──────────► lib/utils
├── Title.astro ─────────────► lib/utils (atoms)
├── Image.astro ─────────────► lib/utils
├── ImageBanner.astro (featured artwork)
│   ├── Image.astro
│   └── CardSummary.astro ──► lib/utils, lib/format/price
├── ImageRowCard.astro (remaining artworks, alternating, discipline/technique/theme tags via getFacetLabel)
│   ├── Image.astro
│   ├── CardSummary.astro ──► lib/utils, lib/format/price
│   └── data/api.ts (ArtworkView prop)
├── ImageCard.astro (active galleries, from toSalaView, isLarge stripped)
│   ├── Image.astro
│   └── CardInfo.astro
├── data/api.ts (artist lookup by slug, resolveArtistArtworks, resolveArtistGalleries,
│   resolveLocationName, toArtworkView, toSalaView)
└── lib/i18n/utils (getTranslations, pickTranslation, getLocalizedArtistPath)
```

### BlogIndex.astro tree (paginated, `/blog` + `/blog/page/N` and `/en/blog` …)

```
BlogIndex.astro
├── PageSEO.astro ─► BaseSEO.astro (title/description/keywords from pages.blog.*, alternateUrls via getLocalizedBlogPagePath)
├── Headline.astro (eyebrow Revista/Journal) ─► lib/utils
├── Btn.astro (empty-state CTA, ghost) ─► lib/utils
├── PostCard.astro (per PostSummary in slice; featured lg:col-span-2 when posts.length>1 — first card of every page)
│   ├── lib/api/posts (pickPostField for title/description)
│   ├── lib/i18n/utils (getLocalizedPostPath for href, Intl.DateTimeFormat for date, API_BASE_URL+banner_image, getTranslations for readMore)
│   └── Featured variant: overlay title + readMore CTA, accent bar + lift on regular
└── PaginationNav.astro (molecule, hidden when total_pages<=1; md: full numbered, <md: collapsed Prev — page/total — Next)
    └── lib/i18n/utils (getLocalizedBlogPagePath, page 1 ↔ base path, getTranslations for prev/next/page)
    lib/i18n/utils (getLocalizedPostPath, getLocalizedBlogPath for empty-state)
    lib/api/types (PostSummary, Lang)
```

### BlogPost.astro tree (per post, `/blog/:slug` + `/en/blog/:slug`)

```
BlogPost.astro
├── PageSEO.astro ─► BaseSEO.astro (title=title_*, description=description_*, keywords=keywords_*, ogImage=API_BASE_URL+banner_image, alternateUrls via getLocalizedPostPath)
├── Headline.astro (eyebrow Revista/Journal) ─► lib/utils
├── Btn.astro (ghost backToBlog) ─► lib/utils
├── marked (marked.parse at build, set:html, trusted CMS → blog-prose)
├── lib/api/posts (pickPostField for title/description/keywords/content)
├── lib/i18n/utils (getLocalizedPostPath, getLocalizedBlogPath, getTranslations for back/share/readingTime)
└── aside sticky meta (Headline + Btn + banner thumb, lg only) + share script (navigator.share → clipboard)
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
- `lib/format/price.ts` — `Currency = "MXN" | "USD"`, `currencyForLang(lang)`, `formatPrice(amount, currency, locale?)` (uses `Intl.NumberFormat` with `{ style: "currency", currency }`, returns "" for zero/undefined), `pickPrice(mxn, usd, currency)` (per-currency fallback). Drives the lang→currency rule used by every price-rendering atom/molecule/organism: `es → MXN`, `en → USD`.
- `lib/i18n/utils.ts` — `getTranslations`, `pickTranslation`, `getLocalizedPath`, `getLocalizedSalaPath`, `getLocalizedArtworkPath`, `getLocalizedArtistPath`, `getLocalizedBlogPath`, `getLocalizedBlogPagePath`, `getLocalizedPostPath`
- `lib/i18n/routes.ts` — `routes` map, `PageKey` type
- `lib/i18n/ui.ts` — translation dictionaries
- `lib/nav.ts` — `getNavLinks(lang)`, shared nav source for Header and Footer
- `data/site-config.ts` — `BUSINESS_DATA`
- `data/api.ts` — `buildSiteData()` (build-time fetch of all 11 backend resources), `SiteData`, and view builders (`toArtworkView`, `toArtworkDetailView`, `toSalaView`, `toHeroView`/`HeroView` (homepage hero from the primary `Gallery`), `resolveGalleryArtworks`, `resolveGalleryCurator`, `resolveArtistName`, `resolveArtistArtworks`, `resolveArtistGalleries`, `resolveLocationName`, `getFacetLabel`)
- `lib/api/types.ts` — API-faithful types (`Base`, `Ref`, `Translations<T>`, `Paginated<T>`, `ApiError`, 10 resource interfaces)
- `lib/api/client.ts` — `safeFetch`/`FetchError`/`apiFetch` (token-injecting fetch)
- `lib/api/pagination.ts` — `fetchAll` pagination helper
- `lib/api/{artists,art-curators,locations,galleries,disciplines,techniques,themes,formats,scales,artworks,posts}.ts` — `list`/`detail` endpoint modules (`posts` adds `PostSummary`/`Post` + `pickPostField`, `marked` for Markdown)
- `store/catalog.ts` — `GroupKey`, `ArtworkFacets` (array-valued), `matchesArtwork`, `computeViableOptions`
- `consts.ts` — `SITE_TITLE`, `SITE_DESCRIPTION`, `LOCALE_MAP`
- `styles/global.css` — design tokens (`bg-paper`, `text-crimson`, …)

## Notes

- **Six page components.** The single catch-all `[...path].astro` now serves `Home`
  (root `/` + `/es`), one `GalleryPage` per gallery (`/salas/<slug>` + `/en/salas/<slug>`),
  one `ArtworkPage` per artwork (`/obras/<slug>` + `/en/obras/<slug>`), one `ArtistPage` per artist
  (`/artistas/<slug>` + `/en/artistas/<slug>`), a paginated `BlogIndex` (`/blog` + `/blog/page/N` and `/en/blog` …)
  and a per-post `BlogPost` (`/blog/:slug` + `/en/blog/:slug`). The generic `Services`/`About` pages were
  removed in the `remove-dummy-pages` cleanup.
- **Artwork detail pages**: `ArtworkPage.astro` renders `toArtworkDetailView` (all artwork
  data from `buildSiteData()`) in a two-column layout — a scroll-driven `ArtworkImageViewer`
  on the left (layered `.artwork-image` children crossfaded by a GSAP `ScrollTrigger`
  pin+scrub timeline, `ease: "none"`, end derived from image count; single-image artworks
  fall back to a static `Image` with no pin; disabled via `gsap.matchMedia()` for
  `prefers-reduced-motion` and `max-width: 767px`) and a fixed `ArtworkInfoPanel` on the
  right (title, artist, year/dimensions, description, price/status, taxonomy spec rows,
  mailto CTA) that stays visually fixed because the whole section is pinned. Localized SEO
  via `PageSEO` (`ogImage` = primary image). `LangBtns` `localizedPaths` preserve the
  artwork slug across languages.
- **Artwork card hrefs**: `toArtworkView` now emits `getLocalizedArtworkPath` (real links)
  instead of `"#"`, so every `ImageCard` (homepage) and `ImageRowCard`/`ImageBanner`
  (gallery) artwork navigates to its detail page.
- **Gallery detail pages**: `GalleryPage.astro` renders a hero (eyebrow "Sala 0N" derived
  from `sort_order` only), a `CuratorCard` (full gallery/curator data resolved from the
  art-curators list), and an artworks section reusing the `Filters`/`Artworks` React
  islands but limited to the `artist` + `technique` groups and the gallery's own artworks
  (resolved from `artwork_links`, ordered by `sort_order`). The hero image and the artworks
  section are full-bleed (edge-to-edge): every artwork renders as an `immersive`
  `ImageRowCard` — a full-width 50/50 split where the image keeps its natural aspect
  (`height="auto"`, dynamic/auto height, bleeding to the viewport edge) and the info card
  is vertically centered in the row and pinned near the middle of the viewport while
  scrolling (`md:sticky md:top-[35svh]` inside a `justify-center` column, alternating
  sides). All cards carry space-separated `data-*` facet values so the `Artworks` island
  parses them into arrays before matching. `Artworks` accepts an optional `gridClassName`
  prop that replaces its default `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` columns
  (GalleryPage passes a single-column grid). `ImageRowCard`'s non-immersive mode (no
  `immersive` prop) preserves the original contained 2-column editorial layout for
  `ArtistPage`.
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
- **Build-time backend dependency**: `getStaticPaths` calls `buildSiteData()` plus an isolated blog fetch
  (`fetchAll(listPosts)` + `detail(slug)` per post) which fetches the DRF API using `API_BASE_URL`/`API_TOKEN`
  (server-only, never `PUBLIC_*`). The backend must be reachable and the token valid during `astro build`;
  a failure surfaces a `FetchError` (no silent fallback, blog outage fails whole build).
- **Nav anchors**: the `obras`/`artistas` nav items point at the homepage collection
  section (`#artworks-collection`) and `salas` at the homepage gallery section
  (`#salas-gallery`) — real in-page targets, shared by Header and Footer via `getNavLinks`.
  The `Blog` nav item points to `getLocalizedBlogPath(lang)` (`/blog` es / `/en/blog` en), after Salas (`home → obras → salas → blog → artistas`).
  There is no salas or artists index page in scope.
- **Artist detail pages**: `ArtistPage.astro` renders an artist hero (photo/initials,
  localized bio, years · location metadata, contact/social links), their artworks as a
  static editorial list (featured `ImageBanner` + alternating `ImageRowCard`s with
  discipline/technique/theme tags; no `Filters` island), and their currently-active
  galleries as an `ImageCard` grid built from `toSalaView` (derived from the artist's
  artworks' `gallery_links`, deduped, `is_active` only, primary-first). The artist name on
  artwork detail pages links back to the artist page. `LangBtns` `localizedPaths` preserve
  the artist slug across languages.
- **Blog pages (polished Salon)**: `BlogIndex.astro` renders an editorial header (`Headline` eyebrow `pages.blog.eyebrow` Revista/Journal + serif `h1` + `pages.blog.description` + count meta + hairline), a mosaic `grid gap-[3px] md:gap-4` of `PostCard`s — `PostCard` now a `bg-card-dark` salon card with `aspect-[4/3]` image, `brightness-[0.92]→[0.72]` + `scale-[1.05]` + `shadow-2xl -translate-y-1` on hover, `from-black/75` gradient, top-left date badge, `Headline`/`Btn` tokens, crimson accent bar sliding in and `pl-3` indent, featured `lg:col-span-2 aspect-[16/10]` with overlay title/cta for the first post of every page when `posts.length>1` (`hasFeatured = posts.length>1`). `PaginationNav.astro` is now bilingual (`pages.blog.pagination.prev/next/page`) and responsive: `md` shows full numbered + Prev (ink/ghost) / Next (crimson) with `focus:ring-brand-500`, `<md` collapses to `Prev — page/total — Next` full-width; hidden when `total_pages<=1`. Empty-state is a centered editorial block (`Headline` eyebrow, serif `h2`, `pages.blog.noPostsHint` + ghost `Btn` to `getLocalizedBlogPath`). `BlogPost.astro` renders a `bg-card-dark` hero (`h-[48svh] md:h-[62svh]` with `from-black/75 via-black/35` gradient, bottom-anchored `Headline` eyebrow + serif title + back link), description as left-bordered crimson quote, meta `author • date • readingTime` (`wordCount/200` via `pages.blog.readingTime`), `h-px` divider, `blog-prose` (`prose-headings:font-serif`, `prose-a:text-crimson underline-offset-4`, `blockquote border-crimson`, `code bg-white border`, `pre bg-card-dark`, `lead 1.85`, `measure 72ch`), share `navigator.share→clipboard` + `Btn ghost`, and a `lg:sticky` aside (title/meta/description + `Btn` + banner thumb). `PageSEO` uses `pages.blog.eyebrow` via `pickPostField` and `ogImage`; `LangBtns` `localizedPaths` + `preloadImage` preserved. Drafts excluded. Global `::selection` crimson/paper, `caret-color brand-500`, `scrollbar-color`, `focus-visible` and `text-underline-offset:3px` themed in `styles/global.css`.
- **Design-system page** is a standalone showcase and is intentionally not part of the
  runtime page tree.
- **Orphaned / not reachable from any page** (candidates for cleanup):
  - `molecules/GlobalLoader.tsx`
- **`Image` atom height prop**: `atoms/Image.astro` supports an optional `height` prop (`"full"` default | `"auto"`). `ImageRowCard` uses `height="auto"` so each artwork renders at its natural aspect ratio (no fixed-height crop); all other consumers (`ImageCard`, `ImageBanner`, `Hero`) keep the default `full` behavior. `lib/utils` `cn` now composes via `clsx` + `tailwind-merge` (last-wins on conflicting utilities).
- **Reference stateful atom**: `atoms/Input.tsx` is the store-bound form atom (vanilla, self-bound via `useField`, injectable hook prop). `atoms/ValidatedInput.tsx` no longer exists — its responsibilities folded into `Input`.
- **Store machinery**: `store/` (`form.ts`, `useField.ts` — zustand + zod) is kept as shared state for upcoming form work. `store/catalog.ts` (zustand + persist, `useCatalog` hook, `matchesArtwork` predicate, `computeViableOptions` helper) is the shared filter-state store for the interactive collection section.
- **Currency display is language-driven**: artwork prices are no longer pre-formatted server-side. `ArtworkView` / `ArtworkDetailView` / `HeroArtworkView` carry the raw `priceMxn` / `priceUsd` numbers from the DRF API; each leaf renderer (`CardSummary` → `ImageBanner` / `ImageRowCard`, `ArtworkInfoPanel`, `Hero`, plus `CardInfo` on the homepage collection grid via a pre-formatted `price` string from `Home.astro`) calls `formatPrice(pickPrice(priceMxn, priceUsd, currencyForLang(lang)), currencyForLang(lang))` so the URL language is the only source of truth (`es → MX$`, `en → US$`, via `Intl.NumberFormat`). The previously-invisible homepage collection grid now displays prices for the first time. `CardInfo` / `ImageCard` expose a `price` slot for that grid. The hero's hardcoded Spanish fallback ("Desde consulta con curador") was moved to `pages.home.hero.consultCurator` in `src/messages/{es,en}.json` and surfaces only when no featured artwork has a price.
- **Interactive collection**: filter groups and artwork data are derived from the backend API in `data/api.ts` and threaded into pages via the `siteData` prop. `atoms/FilterBtn.tsx` and `atoms/FilterToggle.tsx`, `molecules/Filters.tsx`, and `organisms/Artworks.tsx` are React islands (`client:load`) bound to `store/catalog.ts`; `Filters` collapses to the first group by default with an expand/collapse toggle whose `isExpanded` state is persisted in the store, and disables chips that can no longer match any artwork (`disabled` prop on `FilterBtn`, viability computed client-side from the `facets` prop via `computeViableOptions`); `Artworks` receives `ImageCard.astro` slot children stamped with space-separated `data-*` facet attributes (parsed into arrays before matching), toggles their visibility, and renders a localized empty-state block (`emptyLabel`/`resetLabel` props) with a restart-filters button backed by the store's `reset` action when no card matches. The old `.astro` versions of `Filters`/`FilterBtn`/`Artworks` were removed.
