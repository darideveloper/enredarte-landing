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
- Looks up the page component in `COMPONENT_MAP` → currently `home: Home`.
- Wraps the result in `Layout.astro`.

## Full dependency diagram

```
                            ┌──────────────────────────────────────────────┐
                            │                [...path].astro               │
                            └──────────────┬───────────────┬───────────────┘
                                           │               │ routes (i18n)
                                           ▼               ▼
                                     Home.astro      lib/i18n/routes.ts
                                    (landing)
                                           │
                                           ▼
                  ┌───────────────────────────────────────────────────┐
                  │                    Layout.astro                    │
                  │  global.css                                        │
                  │  <body>                                            │
                  │   ├─ Header.astro                                  │
                  │   ├─ <slot/> = Home content                        │
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
│   ├── Title.astro ────────────► lib/utils
│   ├── Headline.astro
│   └── ImageCard.astro
│       ├── Image.astro
│       └── CardInfo.astro ─────► lib/utils
├── Title.astro ────────────────► lib/utils
├── Headline.astro
├── Filters.astro
│   └── FilterBtn.astro ────────► lib/utils
└── Artworks.astro
    └── ImageCard.astro ─► { Image, CardInfo }
```

### Layout.astro tree (Header + Footer shared by every page)

```
Layout.astro
├── styles/global.css
├── Header.astro
│   ├── Logo.astro ─────────────► lib/utils (cn)
│   ├── Btn.astro ──────────────► lib/utils
│   ├── LangBtns.astro
│   │   └── lib/i18n/utils (getLocalizedPath)
│   ├── Menu.astro
│   │   ├── Link.astro ─────────► lib/utils
│   │   └── <slot/> = Btn.astro (CTA)
│   ├── lib/utils
│   └── lib/i18n/utils
├── <slot/> = page content (Home.astro)
└── Footer.astro
    ├── data/site-config.ts
    └── lib/i18n (routes, utils)
```

### design-system.astro tree (showcase, imports the component library directly)

```
design-system.astro
├── Btn.astro, Logo, Link, Headline, Image, FilterBtn, BannerText (atoms)
├── H1, Menu, LangBtns, CardSummary, ImageBanner, Title, CardInfo, Filters (molecules)
├── Header, Gallery, Artworks (organisms)
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
- `lib/i18n/utils.ts` — `getTranslations`, `getLocalizedPath`
- `lib/i18n/routes.ts` — `routes` map, `PageKey` type
- `lib/i18n/ui.ts` — translation dictionaries
- `data/site-config.ts` — `BUSINESS_DATA`
- `consts.ts` — `SITE_TITLE`, `SITE_DESCRIPTION`, `LOCALE_MAP`
- `styles/global.css` — design tokens (`bg-paper`, `text-crimson`, …)

## Notes

- **Single page tree.** After the `remove-dummy-pages` cleanup the site serves only
  `Home`; the generic `Services`/`About` pages, their `Button.tsx` atom, their routes,
  and their translations were removed.
- **Design-system page** is a standalone showcase and is intentionally not part of the
  runtime page tree.
- **Orphaned / not reachable from any page** (candidates for cleanup):
  - `atoms/Input.tsx`, `atoms/ValidatedInput.tsx`, `molecules/GlobalLoader.tsx`
  - `store/` (`form.ts`, `useField.ts` — zustand + zod form machinery)
  - `lib/api/` (`client.ts`, `types.ts`, `constants.ts`)
