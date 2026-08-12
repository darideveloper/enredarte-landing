## Context

The site is a single-page Astro app: `src/pages/[...path].astro` is the only route, an i18n catch-all driven by `getStaticPaths()` reading `src/lib/i18n/routes.ts` (currently one key, `home`), mapping to a page component via `COMPONENT_MAP` (currently `home: Home`). `Home.astro` hardcodes an inline `salasData` array (all `href: "#"`) for the `Gallery` organism, and renders the full 16-artwork catalog from `src/data/catalog.ts` through the `Filters`/`Artworks` React islands (zustand-backed, facet filtering via `data-*` attributes on `ImageCard` children).

The backend defines `Gallery`, `GalleryTranslation`, `ArtCurator`, `ArtCuratorTranslation`, and the `ArtworkGallery` join. `src/lib/api/` is an empty scaffold (`safeFetch` helper + empty `types.ts`). The site is bilingual (en/es) with language baked into the URL prefix (`es/`); `LangBtns` builds switch links from the static route map. `pnpm build` gates on `validate-i18n` (en/es key parity) and `validate-imports`; `docs/component-dependencies.md` must stay in sync (AGENTS.md).

## Goals / Non-Goals

**Goals:**
- Navigable gallery detail pages (`/salas/<slug>`, `/es/salas/<slug>`) rendered from dummy data shaped exactly like the backend models, so a future API swap changes data source only.
- Reuse the existing component library and the filter/artworks machinery; introduce only the minimal new pieces.
- Homepage sala cards become real links and read from the shared data module.
- Language switcher preserves the gallery slug; pages emit localized SEO metadata.

**Non-Goals:**
- No artwork detail pages — artwork `href`s remain placeholders.
- No live API integration — the API types are the contract, `data/galleries.ts` is the source.
- No changes to the homepage artwork presentation or the full six-group filter set.
- No backend changes.
- No timestamps or full `is_active` plumbing — only rendered fields are modeled (`sortOrder`, `status`).

## Decisions

### 1. Extend the existing catch-all instead of adding a `salas/[slug].astro` route
`[...path].astro` already owns i18n path generation (`es/` prefix baked into params) and page dispatch via `COMPONENT_MAP`. We extend `getStaticPaths()` to also emit `{ path: "salas/<slug>" }` (en) and `{ path: "es/salas/<slug>" }` (es) per gallery with `props: { pageKey: "gallery", gallerySlug, lang }`, and add `gallery: GalleryPage` to `COMPONENT_MAP`. This keeps a single routing mechanism, lets Astro's sitemap pick up every static path, and preserves `astro:page-load` re-init for existing GSAP sections.

*Alternatives considered:* a dedicated `src/pages/salas/[slug].astro` — rejected: introduces a second page-entry mechanism and would not naturally cover the `es/` prefix; a generated `routes` entry per gallery — rejected: `routes` is a static map keyed by fixed pages, dynamic slugs don't fit.

### 2. New `src/data/galleries.ts` as single source of truth
Define `ArtCurator` and `Gallery` types satisfying response types declared in `src/lib/api/types.ts`. `Gallery` holds `slug`, `logo`, `curator`, `sortOrder`, `status` (`active` | `upcoming`), ordered `artworks` (referencing `Artwork` from `data/catalog.ts` by slug), plus `{es, en}` `name`/`description`; `ArtCurator` holds `slug`, `name`, `email`, `website`, `photo`, and `{es, en}` `bio`. `Artwork` gains a `slug` field. Bilingual content is embedded `{es, en}` in the data while `GalleryTranslation`, `ArtCuratorTranslation`, and `ArtworkGallery` record types are declared in `lib/api/types.ts` for future API fidelity. `sortOrder` + `status` drive the homepage subtitles ("Sala 01 · Activa") and the detail-page eyebrow ("Sala 01"); timestamps are not modeled (rendered-only fidelity). Homepage salas and both-language detail pages read from this module; the inline `salasData` in `Home.astro` is removed and replaced by a `salasData` derived from galleries (each card's `href` = localized detail path).

### 3. New page component `GalleryPage.astro`
Lives at `src/components/pages/sala/GalleryPage.astro` (mirroring `pages/landing/Home.astro`). Props `{ lang, gallerySlug }`. Layout:
- **Hero** — eyebrow (e.g. "Sala 01"), localized name, description, large `Image` (logo/hero image).
- **Curator** — new `CuratorCard.astro` molecule (photo via `Image`, name, localized bio, email/website links; card styling aligned with `CardSummary`).
- **Artworks** — `Filters` (only `artist` + `technique` groups, localized) + `Artworks` island wrapping the new `ImageRowCard` children with `data-*` facets.
- **SEO** — `PageSEO` with explicit localized `title`/`description`/`ogImage` props (canonical falls back to `Astro.url.pathname`).

### 4. New `ImageRowCard.astro` molecule for the improved layout
Featured first artwork uses the existing `ImageBanner` (image + `CardSummary` overlay). Remaining artworks render as alternating rows (image left / info card right, mirrored each row, stacking on mobile) composed from `Image` + a `CardSummary`-style info card showing title, artist, discipline/technique/theme. Rows carry the `data-*` facet attributes so the existing `Artworks` island filters them.

### 5. `LangBtns` optional path override
Add an optional `path` prop; when present, the switcher builds `/<lang-path>/salas/<slug>` for the other language instead of resolving through the static route map. Default behavior (no prop) is unchanged.

### 6. i18n labels via message files
Add gallery-page labels ("Sala", "Curaduría", "Obras de la sala", etc.) to `src/messages/en.json` and `es.json` in the same key shape, satisfying `validate-i18n` parity. Gallery name/description and curator bio come from the data module, not message files.

## Risks / Trade-offs

- **SEO hreflang alternates skipped** → Mitigation: `PageSEO` emits canonical from `Astro.url.pathname`; passing a per-slug `currentPage` won't resolve in the route map. Acceptable for now; can add an alternate-links prop later.
- **Filters on few artworks may feel sparse** → Mitigation: restricted to `artist` + `technique` (per requirements) and reuses existing collapse behavior; viable-option disabling still applies.
- **Gallery artwork row counts are small and fixed** → Mitigation: dummy data distributes the 16 artworks across the 5 galleries; the layout is data-driven, so any count works once the API lands.
- **Catch-all growth** → Mitigation: gallery paths are generated per data entry; adding galleries later automatically emits routes (and sitemap entries).
- **Upcoming salas still emit pages** → Mitigation: `status: "upcoming"` galleries stay on the homepage and keep detail pages (they exist, just labelled "Próximamente"); if the backend later adds truly inactive galleries, `getStaticPaths()` can filter them.

## Migration Plan

- No runtime migration (static site). Rollback = revert the change's commits; the homepage reverts to the inline `salasData` and the catch-all to its single `home` path.
- When the backend API is ready: replace imports of `data/galleries.ts` with API-backed data (same shapes from `lib/api/types.ts`), keeping pages/components untouched.

## Open Questions

- Whether artwork rows should link to a future `/obras/<slug>` page — currently `href` stays a placeholder `#`.
- Whether the gallery hero should include the curator photo as a secondary visual — deferred to implementation/design pass.
