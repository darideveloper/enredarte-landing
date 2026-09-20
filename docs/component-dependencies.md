# Component Dependency Map

Living reference of how pages compose components (and subcomponents) in this project.

> **Keep this in sync.** Whenever pages or components are added, removed, renamed, or
> their imports change, regenerate the diagram below and update the Notes section.

## Pages layer

`src/pages/` contains a single catch-all route plus three auxiliary endpoints:

```
src/pages/
├── [...path].astro       ← the only real route (i18n catch-all)
├── 404.astro             ← branded 404 (→ dist/404.html, served by nginx error_page; no API fetch)
├── design-system.astro   ← standalone showcase page (noindex)
└── robots.txt.ts         ← API route, no components
```

`[...path].astro` drives everything through `getStaticPaths()`:

- Calls `buildSiteData()` from `src/data/api.ts` once, which fetches every backend resource
  (galleries, artists, art-curators, the five taxonomies, artworks) via the `src/lib/api/*`
  endpoint modules and `fetchAll` pagination helper, then derives localized filter groups.
- Emits the route-map pages (`home` + the three legal stubs `aviso-de-privacidad`,
  `terminos-y-condiciones`, `politica-de-cookies`, each es root-level / `en/…`)
  plus the two purchase shells (`compra-exitosa`, `compra-cancelada`, es / `en/…`,
  static shells hosting sales islands — no backend fetch),
  one detail page per gallery from the API
  (`salas/<slug>` es / `en/salas/<slug>` en), one detail page per artwork
  (`obras/<slug>` es / `en/obras/<slug>` en), one detail page per artist
  (`artistas/<slug>` es / `en/artistas/<slug>` en), and one detail page per curator
  (`curadores/<slug>` es / `en/curadores/<slug>` en), threading the shared `siteData`
  prop through to `Home`/`GalleryPage`/`ArtworkPage`/`ArtistPage`/`CuratorPage`.
- Isolated blog fetch (Option A, outside `buildSiteData`): calls `fetchAll(listPosts)` from `src/lib/api/posts.ts`,
  filters `published_at != null`, derives `total_pages = ceil(count/11)`, emits paginated index pages
  (`/blog` + `/blog/page/2` … es, `/en/blog` + `/en/blog/page/2` … en, page 1 is base path, 11-item slices,
  empty-state when `count==0`) and per-post detail pages (`/blog/:slug` es / `/en/blog/:slug` en, drafts excluded).
  Detail pages fetch full `Post` via `detail(slug)` and thread `post: Post` + `postSlug` to `BlogPost`.
- Looks up the page component in `COMPONENT_MAP` → `home: Home`, `gallery: GalleryPage`,
  `artwork: ArtworkPage`, `artist: ArtistPage`, `blog: BlogIndex`, `post: BlogPost`, `curator: CuratorPage`,
  `compra-exitosa: SuccessPage`, `compra-cancelada: CancelPage`,
  `aviso-de-privacidad`/`terminos-y-condiciones`/`politica-de-cookies`: `LegalPage` (generic, `pageKey` selects the `pages.legal.*` copy).
- Wraps the result in `Layout.astro`, passing `localizedPaths` (the en/es gallery/artwork/artist/curator *or*
  blog page/post URLs via `getLocalizedSalaPath`/`getLocalizedArtworkPath`/`getLocalizedArtistPath`/
  `getLocalizedCuratorPath`/`getLocalizedBlogPath`/`getLocalizedBlogPagePath`/`getLocalizedPostPath`; route-map
  pages like `home` and the legal stubs need none — `LangBtns` falls back to `getLocalizedPath(pageKey)`)
   to `Layout` → `Header` → `LangBtns`
   so the language switch preserves the slug/page, and `preloadImage` prefers `Post.banner_image` (verbatim absolute URL, no prefix) for post detail.

## Full dependency diagram

```
                             ┌──────────────────────────────────────────────┐
                             │                [...path].astro               │
                             └──────────────┬───────────────┬───────────────┘
                                            │               │ routes (i18n)
                                            ▼               ▼
  Home / GalleryPage / ArtworkPage / ArtistPage / CuratorPage / BlogIndex / BlogPost / LegalPage   lib/i18n/routes.ts
                              │               │          data/api.ts (buildSiteData)
                              │               ▼          lib/api/* (11 endpoint modules incl. posts, pagination.fetchAll)
                              ▼        lib/i18n/utils (getLocalizedSalaPath/ArtworkPath/ArtistPath/CuratorPath/BlogPath/PagePath/PostPath)
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
│   ├── atoms/Markdown.astro ──► lib/markdown (renderMarkdown; description, title stays plain)
│   ├── Headline.astro ────────► lib/utils
│   ├── ImageBanner.astro
│   │   ├── Image.astro ────────► lib/utils
│   │   └── CardSummary.astro ──► lib/utils, lib/format/price (formatPrice + pickPrice + currencyForLang)
│   └── Btn.astro ─────────────► lib/utils
├── BannerBar.astro
│   ├── BannerText.astro ───────► lib/utils
│   └── lib/markdown (renderInline for global.banner.* `**` → <strong>)
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
└── Artworks.tsx (React island, client:load, `limit={LANDING_LIMIT}` = 12) ─► store/catalog.ts, lib/utils
    └── ImageCard.astro (ALL artworks as slot children in API order, stamped with space-separated data-* facets, formatted `price` from `lang`; Artworks shows the last 12 matches — filter-then-cap-tail) ─► { Image, CardInfo }
```

### CollectionIndex.astro tree (index pages, `/obras` + `/salas` + `/artistas` + `/curadores` es/en)

```
CollectionIndex.astro (wrapper: `container-site-canvas py-16`) ──► data/api.ts (siteData prop: toArtworkView/toSalaView, resolveArtistName/resolveArtistArtworks)
├── PageSEO.astro ─► BaseSEO.astro (title/description from pages.<pageKey>.*)
├── Title.astro + Headline.astro (eyebrow/title/description header, all four indexes)
├── IF pageKey === "obras" (obras-catalog: same composition as Home collection, uncapped)
│   ├── Filters.tsx (React island, client:load; all 6 groups, same labels/viability/collapse as landing)
│   └── Artworks.tsx (React island, client:load; default grid, no `limit`)
│       └── ImageCard.astro (all artworks, `aspect-[4/5]`, per-lang `price`, all six data-* facets) ─► { Image, CardInfo }
└── ELSE (salas/artistas/curadores): static `<div mt-10 grid …>` of ImageCards, no islands
    (`artistas`: `grid-cols-1 sm:2 md:3 lg:4`; `salas`/`curadores`: `grid-cols-1 sm:2 lg:3`)
```

### GalleryPage.astro tree (per gallery, `/salas/<slug>` es + `/en/salas/<slug>` en)

```
GalleryPage.astro
├── PageSEO.astro ─► BaseSEO.astro (explicit title/description/ogImage props)
├── atoms/Markdown.astro ────► lib/markdown (galleryDescription)
├── Headline.astro ───────► lib/utils
├── Image.astro ───────────► lib/utils
├── CuratorCard.astro (molecule)
│   ├── Image.astro
│   ├── atoms/Markdown.astro ──► lib/markdown (bio, variant="on-dark")
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
    ├── atoms/Markdown.astro ─────► lib/markdown (description)
    ├── BuyWidget.tsx (React island, client:load, only when `status == "available"`) ─► lib/api/sales (postBuy), zod email, sessionStorage artwork-stash
    ├── status badge (static `<p>`, reserved → in-progress / sold → sold / else unavailable)
    ├── lib/i18n/utils (getTranslations for status/spec labels + purchase copy)
    ├── lib/format/price (formatPrice + pickPrice + currencyForLang on `lang`)
    └── data/api.ts (ArtworkDetailView prop)
    data/api.ts (toArtworkDetailView → images/alt, title, description, artist,
        artistSlug, year, dimensions, priceUsd/priceMxn, status, taxonomy labels via getFacetLabel)
    lib/i18n/utils (getLocalizedArtworkPath)
    lib/api/artwork-visits.ts (recordArtworkVisit: astro:page-load fire-and-forget POST :slug/visit/,
        no body/auth, keepalive, no retry, dev-only console.warn; slug via data-artwork-slug)
```

### ArtistPage.astro tree (per artist, `/artistas/<slug>` + `/en/artistas/<slug>`)

```
ArtistPage.astro
├── PageSEO.astro ─► BaseSEO.astro (explicit localized title/description/ogImage = photo ?? featured artwork)
├── atoms/Markdown.astro ────► lib/markdown (bio)
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
│   ├── lib/markdown (renderInline for descriptions)
 │   ├── lib/i18n/utils (getLocalizedPostPath for href, Intl.DateTimeFormat for date, banner_image verbatim, getTranslations for readMore)
│   └── Featured variant: overlay title + readMore CTA, accent bar + lift on regular
└── PaginationNav.astro (molecule, hidden when total_pages<=1; md: full numbered, <md: collapsed Prev — page/total — Next)
    └── lib/i18n/utils (getLocalizedBlogPagePath, page 1 ↔ base path, getTranslations for prev/next/page)
    lib/i18n/utils (getLocalizedPostPath, getLocalizedBlogPath for empty-state)
    lib/api/types (PostSummary, Lang)
```

### BlogPost.astro tree (per post, `/blog/:slug` + `/en/blog/:slug`)

```
BlogPost.astro
├── PageSEO.astro ─► BaseSEO.astro (title=title_*, description=description_*, keywords=keywords_*, ogImage=banner_image verbatim, alternateUrls via getLocalizedPostPath)
├── Headline.astro (eyebrow Revista/Journal) ─► lib/utils
├── Btn.astro (ghost backToBlog) ─► lib/utils
├── atoms/Markdown.astro ────► lib/markdown (description quote)
├── lib/markdown (renderMarkdown at build, set:html, trusted CMS → markdown-prose; renderInline for aside description)
├── lib/code-copy (shared code-block copy handler, also used by Markdown atom)
├── lib/api/posts (pickPostField for title/description/keywords/content)
├── lib/i18n/utils (getLocalizedPostPath, getLocalizedBlogPath, getTranslations for back/share/readingTime)
└── aside sticky meta (Headline + Btn + banner thumb, lg only) + share script (navigator.share → clipboard)

### CuratorPage.astro tree (per curator, `/curadores/<slug>` + `/en/curadores/<slug>`)

```
CuratorPage.astro
├── PageSEO.astro ─► BaseSEO.astro (explicit localized title/description/ogImage)
├── CuratorHero.astro (organism)
│   ├── Headline.astro ───────────► lib/utils
│   ├── atoms/Markdown.astro ─────► lib/markdown (bio)
│   ├── Image.astro ──────────────► lib/utils
│   ├── lib/utils (stripUrlScheme, cn)
│   └── lib/i18n/utils (getTranslations, pickTranslation)
├── CuratorSalas.astro (organism)
│   ├── Title.astro ──────────────► lib/utils
│   ├── Headline.astro ───────────► lib/utils
│   ├── ImageCard.astro ──────────► { Image.astro, CardInfo.astro, lib/utils }
│   ├── lib/utils (cn)
│   └── lib/i18n/utils (getTranslations)
├── data/api.ts (siteData prop: curator lookup, resolveCuratorGalleries, toSalaView)
│   └── lib/i18n/utils (getTranslations, pickTranslation, getLocalizedSalaPath)
└── lib/i18n/utils (getLocalizedCuratorPath, pickTranslation)
```

### Compra trees (purchase shells, `/compra-exitosa` + `/compra-cancelada` es/en)

```
SuccessPage.astro (static shell, PageSEO noIndex)
├── Headline.astro ───────────► lib/utils
├── OrderFlow.tsx (React island, client:load) ─► lib/api/sales (getOrderSummary), ?order= parse, 3s/×20 poll, timeout+retry, 429-pause
│   ├── OrderSummaryCard.tsx ─► lib/format/price (single card owner: ready + complete phases)
│   └── DeliveryForm.tsx (React, two-step, only when paid_pending_data) ─► lib/api/sales (postDelivery/getOrderSummary, onComplete(summary) → complete phase)
└── lib/i18n/utils (getLocalizedPath obras for fallback link)

CancelPage.astro (static, PageSEO noIndex, no island)
├── Headline.astro + Btn.astro (ghost → obras fallback)
├── primary anchor [data-cancel-artwork] → obras href, upgraded client-side to the sessionStorage-stashed artwork slug via inline is:inline script
└── lib/i18n/utils (getLocalizedPath)
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
└── Footer.astro (dark ink palette; contact: tel phone + wa.me WhatsApp + mailto email + plain-text `Mexico City, Mexico`, no map link; legal nav to the three Spanish-slug stubs)
    ├── Logo.astro (bg-red-circle variant) ──► lib/utils (cn)
    ├── Link.astro (footer variant) ─► lib/utils
    ├── Headline.astro ───────────────► lib/utils
    ├── LangBtns.astro (inverse variant)
    │   └── lib/i18n/utils (getLocalizedPath)
    ├── lib/nav.ts (shared getNavLinks with Header)
    │   └── lib/i18n/utils
    ├── data/site-config.ts (BUSINESS_DATA, SOCIAL_LINKS, PHONES, WHATSAPP, EMAIL, LOCATION_SHORT)
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
                  ├── lib/i18n/utils (getLocalizedPath, getTranslations)
                  └── lib/markdown (stripMarkdown — meta/og descriptions always plain text)
```

## Shared leaf layer

Everything below is a terminal dependency imported by multiple components:

- `lib/utils.ts` — `cn()` helper, `stripUrlScheme()` (nearly every component)
- `lib/gsap.ts` — Central GSAP instance & SSR-safe plugin registration (see `docs/gsap-scrolltrigger/`)
- `lib/format/price.ts` — `Currency = "MXN" | "USD"`, `currencyForLang(lang)`, `formatPrice(amount, currency, locale?)` (uses `Intl.NumberFormat` with `{ style: "currency", currency }`, returns "" for zero/undefined), `pickPrice(mxn, usd, currency)` (per-currency fallback). Drives the lang→currency rule used by every price-rendering atom/molecule/organism: `es → MXN`, `en → USD`.
- `lib/i18n/utils.ts` — `getTranslations`, `pickTranslation`, `getLocalizedPath`, `getLocalizedSalaPath`, `getLocalizedArtworkPath`, `getLocalizedArtistPath`, `getLocalizedCuratorPath`, `getLocalizedBlogPath`, `getLocalizedBlogPagePath`, `getLocalizedPostPath`
- `lib/i18n/routes.ts` — `routes` map, `PageKey` type
- `lib/i18n/ui.ts` — translation dictionaries
- `lib/nav.ts` — `getNavLinks(lang)`, shared nav source for Header and Footer
- `data/site-config.ts` — `BUSINESS_DATA`
- `data/api.ts` — `buildSiteData()` (build-time fetch of all 10 backend resources, plus isolated `posts` fetch in `[...path].astro`), `SiteData`, and view builders (`toArtworkView`, `toArtworkDetailView`, `toSalaView`, `toHeroView`/`HeroView` (homepage hero from the primary `Gallery`), `resolveGalleryArtworks`, `resolveGalleryCurator`, `resolveCuratorGalleries`, `resolveArtistName`, `resolveArtistArtworks`, `resolveArtistGalleries`, `resolveLocationName`, `getFacetLabel`)
- `lib/api/types.ts` — API-faithful types (`Base`, `Ref`, `Translations<T>`, `Paginated<T>`, `ApiError`, 10 resource interfaces)
- `lib/api/client.ts` — `safeFetch`/`FetchError`/`apiFetch` (token-injecting fetch)
- `lib/api/pagination.ts` — `fetchAll` pagination helper
- `lib/api/{artists,art-curators,locations,galleries,disciplines,techniques,themes,formats,scales,artworks,posts}.ts` — `list`/`detail` endpoint modules (`posts` adds `PostSummary`/`Post` + `pickPostField`)
- `lib/api/sales.ts` — token-free public sales client (`POST artworks/:slug/buy/`, `GET orders/:slug/`, `POST orders/:slug/delivery/` on `PUBLIC_API_BASE_URL`, no `Authorization`, typed `SalesError` from the `{status,message,data}` envelope, sales types co-located; never reads `API_TOKEN`)
- `lib/markdown.ts` — `renderMarkdown`/`renderInline` (marked 15 GFM `breaks: true`, BlogPost custom renderer: h1→h2, figure, external ↗, code badge+copy; trusted, no sanitize) + `stripMarkdown` (plain-text excerpts for SEO)
- `lib/code-copy.ts` — `attachCodeCopy()` (idempotent code-block copy handler, used by `BlogPost` + `Markdown` atom scripts)
- `atoms/Markdown.astro` — block markdown atom (`markdown-prose` + shared prose utilities, `compact`/`on-dark` variants, opt-in `dropcap`); inline contexts use `renderInline` directly
- `store/catalog.ts` — `GroupKey`, `ArtworkFacets` (array-valued), `matchesArtwork`, `computeViableOptions`
- `consts.ts` — `SITE_TITLE`, `SITE_DESCRIPTION`, `LOCALE_MAP`
- `styles/global.css` — design tokens (`bg-paper`, `text-crimson`, …) + shared `markdown-prose` styles (single source with legacy `blog-prose` selector group) + page container contract (`container-site-canvas` full-bleed `px-6 md:px-14` for galleries/grids/hero, `container-site-reading` centered `max-w-6xl` for prose, `container-site-narrow` centered `max-w-3xl` for legal — single source, no hand-rolled page containers)

## Notes

- **Markdown everywhere**: every API text area (`Artist.bio`, `ArtCurator.bio` via `CuratorCard`/`CuratorHero`,
  `Gallery.description` via `GalleryPage`/`Hero`, `Artwork.description` via `ArtworkInfoPanel`,
  `Post.content_*`/`description_*` via `BlogPost`/`PostCard`) and long i18n prose keys render through
  `lib/markdown` (`breaks: true`, trusted CMS). Titles/names stay plain. `global.banner.*` is authored
  as `**` markdown and rendered via `renderInline` in `BannerBar`. `BaseSEO` strips markdown from all
  meta/og descriptions. `global.filters.noResults` (React island) stays plain text — out of scope.
- **Eight page components.** The single catch-all `[...path].astro` now serves `Home`
  (root `/` + `/es`), `LegalPage` for the three Spanish-slug legal stubs
  (`/aviso-de-privacidad`, `/terminos-y-condiciones`, `/politica-de-cookies` + `/en/…`;
  generic component, `pageKey` selects the `pages.legal.*` copy, all sample text pending legal-counsel review), one `GalleryPage` per gallery fetched from the backend API
  (`/salas/<slug>` + `/en/salas/<slug>`),
  one `ArtworkPage` per artwork (`/obras/<slug>` + `/en/obras/<slug>`), one `ArtistPage` per artist
  (`/artistas/<slug>` + `/en/artistas/<slug>`), one `CuratorPage` per curator
  (`/curadores/<slug>` + `/en/curadores/<slug>`), a paginated `BlogIndex` (`/blog` + `/blog/page/N` and `/en/blog` …)
  and a per-post `BlogPost` (`/blog/:slug` + `/en/blog/:slug`). The generic `Services`/`About` pages were
  removed in the `remove-dummy-pages` cleanup.
- **Curator detail pages**: `CuratorPage.astro` is a thin page orchestrator composing
  `CuratorHero` (curator portrait photo falling back to an initials monogram if `photo: null`,
  localized bio, email, website) and `CuratorSalas` (a grid of `ImageCard` components
  representing all galleries curated by them, resolved via `resolveCuratorGalleries()`).
  Localized SEO is provided via `PageSEO`. `LangBtns` `localizedPaths` preserve the curator
  slug across languages.
- **Artwork detail pages**: `ArtworkPage.astro` renders `toArtworkDetailView` (all artwork
  data from `buildSiteData()`) in a two-column layout with a single page scrollbar — a sticky
  image stage on the left (`.artwork-image-zone`: `lg:sticky lg:top-[93px]
  lg:h-[calc(100svh-93px)]`, layered `.artwork-image` children crossfaded by a pin-less GSAP
  `ScrollTrigger` scrub timeline, `ease: "none"`, trigger = section, `start: "top 93px"`,
  `end: "bottom bottom"`, skipped when the section fits the viewport; single-image artworks
  fall back to a static `Image` with no timeline; disabled via `gsap.matchMedia()` for
  `prefers-reduced-motion` and viewport below `1024px`) and a flowing `ArtworkInfoPanel` on the
  right (title, artist, year/dimensions, description, price/status, taxonomy spec rows,
  buy widget / status badge) in normal document flow, so the footer is only reachable past
  the conversion slot. `overflow-hidden` is scoped to the image
  zone. Localized SEO
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
   (`fetchAll(listPosts)` + `detail(slug)` per post) which fetches the DRF API using `PUBLIC_API_BASE_URL`/`API_TOKEN`
  (server-only, never `PUBLIC_*`). The backend must be reachable and the token valid during `astro build`;
  a failure surfaces a `FetchError` (no silent fallback, blog outage fails whole build).
- **Nav links (dedicated pages)**: all content nav items point at dedicated index pages
  (`/obras`, `/salas`, `/artistas`, `/curadores` es; `/en/`-prefixed en) via `getLocalizedPath`,
  shared by Header and Footer via `getNavLinks`.
  The `Blog` nav item points to `getLocalizedBlogPath(lang)` (`/blog` es / `/en/blog` en), after Salas (`home → obras → salas → blog → artistas → curadores`).
  Index pages render `CollectionIndex.astro`;
  the homepage collection (`#artworks-collection`) and gallery (`#salas-gallery`) sections remain as content
  with "Ver todo" CTAs pointing at the same indexes.
- **Artist detail pages**: `ArtistPage.astro` renders an artist hero (photo/initials,
  localized bio, years · location metadata, contact/social links), their artworks as a
  static editorial list (featured `ImageBanner` + alternating `ImageRowCard`s with
  discipline/technique/theme tags; no `Filters` island), and their currently-active
  galleries as an `ImageCard` grid built from `toSalaView` (derived from the artist's
  artworks' `gallery_links`, deduped, `is_active` only, primary-first). The artist name on
  artwork detail pages links back to the artist page. `LangBtns` `localizedPaths` preserve
  the artist slug across languages.
- **Blog pages (polished Salon)**: `BlogIndex.astro` renders an editorial header (`Headline` eyebrow `pages.blog.eyebrow` Revista/Journal + serif `h1` + `pages.blog.description` + count meta + hairline), a mosaic `grid gap-[3px] md:gap-4` of `PostCard`s — `PostCard` now a `bg-card-dark` salon card with `aspect-[4/3]` image, `brightness-[0.92]→[0.72]` + `scale-[1.05]` + `shadow-2xl -translate-y-1` on hover, `from-black/75` gradient, top-left date badge, `Headline`/`Btn` tokens, crimson accent bar sliding in and `pl-3` indent, featured `lg:col-span-2 aspect-[16/10]` with overlay title/cta for the first post of every page when `posts.length>1` (`hasFeatured = posts.length>1`). `PaginationNav.astro` is now bilingual (`pages.blog.pagination.prev/next/page`) and responsive: `md` shows full numbered + Prev (ink/ghost) / Next (crimson) with `focus:ring-brand-500`, `<md` collapses to `Prev — page/total — Next` full-width; hidden when `total_pages<=1`. Empty-state is a centered editorial block (`Headline` eyebrow, serif `h2`, `pages.blog.noPostsHint` + ghost `Btn` to `getLocalizedBlogPath`). `BlogPost.astro` renders a `bg-card-dark` hero (`h-[48svh] md:h-[62svh]` with `from-black/75 via-black/35` gradient, bottom-anchored `Headline` eyebrow + serif title + back link), description as left-bordered crimson quote, meta `author • date • readingTime` (`wordCount/200` via `pages.blog.readingTime`), `h-px` divider, `blog-prose` (`prose-headings:font-serif`, `prose-a:text-crimson underline-offset-4`, `blockquote border-crimson`, `code bg-white border`, `pre bg-card-dark`, `lead 1.85`, `measure 72ch`), share `navigator.share→clipboard` + `Btn ghost`, and a `lg:sticky` aside (title/meta/description + `Btn` + banner thumb). `PageSEO` uses `pages.blog.eyebrow` via `pickPostField` and `ogImage`; `LangBtns` `localizedPaths` + `preloadImage` preserved. Drafts excluded. Global `::selection` crimson/paper, `caret-color brand-500`, `scrollbar-color`, `focus-visible` and `text-underline-offset:3px` themed in `styles/global.css`.
- **Footer contact (final info, `footer-contact-final-info`)**: phone `+52 624 176 4802`
  (`tel:`), WhatsApp `+52 1 624 176 4802` (`wa.me`, new tab), `info@enredarte.com` (`mailto:`),
  location plain text `Mexico City, Mexico`. `GOOGLE_MAPS` + full `ADDRESS` detail are parked
  (unrendered) for later map use; `BUSINESS_DATA.url` is `https://enredarte.mx`. Legal stubs are
  sample copy — flag for legal-counsel review before treating as final.
- **Design-system page** is a standalone showcase and is intentionally not part of the
  runtime page tree.
- **404 page** (`404.astro`, `not-found-page` change): static, no `getStaticPaths`, no backend
  fetch (builds offline-safe). Composes `Layout` → `Headline` (eyebrow) + serif `404` display
  + crimson hairline + bilingual `pages.notFound.*` copy + `Btn` primary (`/`) / ghost (`/obras`),
  centered via its own `min-h-[60svh] grid place-items-center` section. `PageSEO` with `noIndex`.
  `Layout`, `Header`, `Footer`, and all atoms reused unchanged.
- **Purchase flow (`artwork-sales` change)**: `BuyWidget`/`OrderFlow`/`DeliveryForm`/`OrderSummaryCard`
  are React islands (`client:load`) receiving localized copy as props (no message imports in
  client bundles). `ArtworkInfoPanel` no longer renders the mailto CTA — the conversion slot
  hosts `BuyWidget` (available) or a status badge. `ArtworkStatus` is the 5-value backend enum.
  `compra-exitosa`/`compra-cancelada` are static shells (no backend fetch at build, `noIndex`).
- **Page container contract**: two tiers, one source (`container-site-*` utilities in
  `styles/global.css`). Canvas (full-bleed `px-6 md:px-14`, no cap — galleries, grids,
  hero, collection/curator/blog listing wrappers, `Header`/`BannerBar`) matches the
  landing edges at every viewport; reading (`mx-auto max-w-6xl`) caps `BlogPost` body
  and `Footer` inner; narrow (`mx-auto max-w-3xl`) caps `LegalPage`. Explicitly
  bespoke and out of contract: `Hero` split-layout cell (`px-6 lg:px-16`),
  `ArtworkPage` immersive split, `ArtworkInfoPanel` rail padding.
- **Orphaned / not reachable from any page** (candidates for cleanup):
  - `molecules/GlobalLoader.tsx`
- **`Image` atom height prop**: `atoms/Image.astro` supports an optional `height` prop (`"full"` default | `"auto"`). `ImageRowCard` uses `height="auto"` so each artwork renders at its natural aspect ratio (no fixed-height crop); all other consumers (`ImageCard`, `ImageBanner`, `Hero`) keep the default `full` behavior. `lib/utils` `cn` now composes via `clsx` + `tailwind-merge` (last-wins on conflicting utilities).
- **Responsive images (`optimize-ssg-images`)**: `atoms/Image.astro` renders remote/asset images via `astro:assets` `getImage` as `<picture>` (AVIF ~55 + WebP ~78 + original fallback, `display:contents` wrapper so layout classes still land on the inner `<img>`), with per-slot `widths`/`sizes` from `lib/images.ts` (`IMAGE_SLOTS`: grid/grid3/gridLarge/featured/row/hero/heroFull/viewer/portrait/logo). Single-transform failure falls back to the verbatim URL (one retry first) instead of failing the build. LCP slots render `eager` + `fetchpriority="high"` with a responsive `imagesrcset` preload (`Layout` `preloadSrcSet`/`preloadSizes`, computed in `[...path].astro` via `lcpPreload`); everything else stays `lazy` + `decoding="async"`. `ImageBanner`/`ImageCard` forward `loading`/`fetchpriority`/`widths`/`sizes`. Locals `logo*.png|webp` + `hero-wood-geometry.jpg` live in `src/assets/` (favicons + `og-image.jpg` stay in `public/`).
- **Reference stateful atom**: `atoms/Input.tsx` is the store-bound form atom (vanilla, self-bound via `useField`, injectable hook prop). `atoms/ValidatedInput.tsx` no longer exists — its responsibilities folded into `Input`.
- **Store machinery**: `store/` (`form.ts`, `useField.ts` — zustand + zod) is kept as shared state for upcoming form work. `store/catalog.ts` (zustand + persist, `useCatalog` hook, `matchesArtwork` predicate, `computeViableOptions` helper) is the shared filter-state store for the interactive collection section.
- **Currency display is language-driven**: artwork prices are no longer pre-formatted server-side. `ArtworkView` / `ArtworkDetailView` / `HeroArtworkView` carry the raw `priceMxn` / `priceUsd` numbers from the DRF API; each leaf renderer (`CardSummary` → `ImageBanner` / `ImageRowCard`, `ArtworkInfoPanel`, `Hero`, plus `CardInfo` on the homepage collection grid via a pre-formatted `price` string from `Home.astro`) calls `formatPrice(pickPrice(priceMxn, priceUsd, currencyForLang(lang)), currencyForLang(lang))` so the URL language is the only source of truth (`es → MX$`, `en → US$`, via `Intl.NumberFormat`). The previously-invisible homepage collection grid now displays prices for the first time. `CardInfo` / `ImageCard` expose a `price` slot for that grid. The hero's hardcoded Spanish fallback ("Desde consulta con curador") was moved to `pages.home.hero.consultCurator` in `src/messages/{es,en}.json` and surfaces only when no featured artwork has a price.
- **Interactive collection**: filter groups and artwork data are derived from the backend API in `data/api.ts` and threaded into pages via the `siteData` prop. `atoms/FilterBtn.tsx` and `atoms/FilterToggle.tsx`, `molecules/Filters.tsx`, and `organisms/Artworks.tsx` are React islands (`client:load`) bound to `store/catalog.ts`; `Filters` collapses to the first group by default with an expand/collapse toggle whose `isExpanded` state is persisted in the store, and disables chips that can no longer match any artwork (`disabled` prop on `FilterBtn`, viability computed client-side from the `facets` prop via `computeViableOptions`); `Artworks` receives `ImageCard.astro` slot children stamped with space-separated `data-*` facet attributes (parsed into arrays before matching), toggles their visibility, and renders a localized empty-state block (`emptyLabel`/`resetLabel` props) with a restart-filters button backed by the store's `reset` action when no card matches. The old `.astro` versions of `Filters`/`FilterBtn`/`Artworks` were removed.
- **Artworks cap + obras catalog (`unify-obras-artworks-grid`)**: `Artworks` accepts an optional `limit?: number` prop with filter-then-cap-tail semantics — it computes the full matching set first, then shows only the last `limit` matches in DOM order (`slice(-limit)`); omitted `limit` keeps uncapped behavior, and the empty-state flag keys off match count (cap never empties). Home passes the full catalog with `limit={LANDING_LIMIT}` (12 = 3 full rows at `lg:4`); both pages map `siteData.artworks` without re-sorting so DOM order equals API order and "last N" is well-defined. `/obras` (`CollectionIndex`, `pageKey === "obras"`) reuses the exact Home composition (`Filters` all 6 groups + `Artworks` default `lg:4` grid + priced/faceted `ImageCards`); selections **and** panel expansion carry over landing ↔ `/obras` via the persisted store (no reset; "all visible" is the empty-selection state). `salas`/`artistas`/`curadores` keep the static grid.
