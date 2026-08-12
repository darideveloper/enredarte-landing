## Why

The "salas" section on the homepage is visual-only: every card points to `#`, and the "artworks" collection always renders the entire catalog. Visitors cannot open a gallery to see its own works, its curator, or its description. This change makes each gallery a first-class, navigable page backed by dummy data shaped exactly like the future backend models, so the eventual API swap is trivial.

## What Changes

- Add a dummy gallery + curator data module (`src/data/galleries.ts`) mirroring the backend `Gallery`, `GalleryTranslation`, `ArtCurator`, `ArtCuratorTranslation`, and `ArtworkGallery` models, including bilingual (es/en) names, descriptions, and curator bios (translations embedded as `{es, en}` in the data, with the translation record types declared in `lib/api/types.ts` for future API fidelity). Each gallery carries a `sortOrder` and a `status` (`active`/`upcoming`) — rendered-only backend fidelity, no timestamps — to drive the homepage subtitles ("Sala 01 · Activa") and the detail-page eyebrow ("Sala 01").
- Give `Artwork` (in `src/data/catalog.ts`) a `slug` field for stable references, and distribute the 16 existing artworks across the 5 current salas (~3-4 each).
- Add a gallery detail page per sala, generated in both languages (`/salas/<slug>` and `/es/salas/<slug>`) by extending the existing `[...path].astro` catch-all routing — no new route file.
- The detail page renders: a hero with localized gallery name, description, and a large image; a curator card (photo, name, bio, email/website); and an artworks section showing **only that gallery's artworks** with a minimal filter set (artist + technique).
- Present the gallery artworks with an improved layout: the first artwork (by sort order) as a large featured banner, the rest as alternating image/info-card rows.
- Move `salasData` out of `Home.astro` into `galleries.ts` so the homepage sala cards link to their detail pages (real `href`, fixing the dead links).
- Extend `LangBtns` with an optional path override so the ES/EN switch preserves the current gallery slug.
- Emit localized SEO metadata on the gallery page (title, description, canonical, og:image) via the existing `PageSEO` component — kept for consistency, since every existing page already emits `PageSEO` and new pages shouldn't regress.
- Add i18n labels for the new page (e.g. "Sala", "Curaduría", "Obras de la sala", "Activa", "Próximamente").
- Keep `docs/component-dependencies.md` in sync with the new components.

## Capabilities

### New Capabilities
- `gallery-detail-page`: The gallery detail page — route generation for `/salas/<slug>` and `/es/salas/<slug>`, hero (name/description/image/logo), curator block, and the artworks section restricted to the gallery's own artworks with minimal filters.
- `gallery-data`: The dummy gallery/curator data module mirroring the backend models, bilingual, single source of truth for both the homepage gallery section and the detail pages, with API-facing types in `src/lib/api/types.ts`.
- `gallery-artwork-layout`: The improved artwork presentation on the detail page — a featured banner for the first artwork plus alternating image/info-card rows for the rest.

### Modified Capabilities
- `homepage-gallery`: The homepage sala cards now navigate to their gallery detail pages instead of dead `#` links, and the section's data comes from the shared `galleries.ts` module.

## Impact

- **Routing**: `src/pages/[...path].astro` — `getStaticPaths()` gains gallery paths; `COMPONENT_MAP` gains `gallery`.
- **Pages**: new `src/components/pages/sala/GalleryPage.astro`; `src/components/pages/landing/Home.astro` drops its inline `salasData`.
- **Components**: new `molecules/CuratorCard.astro` and `molecules/ImageRowCard.astro`; small prop extension to `atoms/LangBtns.astro`. Existing `Gallery`, `Filters`, `Artworks`, `Image`, `ImageCard`, `ImageBanner`, `CardSummary`, `Title`, `Headline`, `Btn`, `PageSEO`, `Layout`, `Header`, `Footer` are reused as-is.
- **Data**: new `src/data/galleries.ts`; `src/data/catalog.ts` (add `slug` to `Artwork`); `src/lib/api/types.ts` (gallery/curator response types for the future API).
- **i18n**: `src/messages/en.json` / `es.json` — new labels (en/es parity enforced by `validate-i18n`).
- **Docs**: `docs/component-dependencies.md` updated.
- **Build**: `pnpm build` (runs `validate-i18n` + `validate-imports`) must stay green.
