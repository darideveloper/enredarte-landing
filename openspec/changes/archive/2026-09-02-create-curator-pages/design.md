## Context

See `proposal.md` for motivation.

The project utilizes Astro 7 SSG with a single dynamic catch-all route `src/pages/[...path].astro`. At build time, `buildSiteData()` fetches all backend resources in parallel, including `curators` and `galleries`. `Gallery` records carry a `curator: Ref | null` relation.

Currently, gallery pages (`src/components/pages/sala/GalleryPage.astro`) embed a `CuratorCard.astro` component to describe the curator of that specific gallery, but there is no standalone curator page where visitors can view the curator's full profile and all galleries curated by them.

## Goals / Non-Goals

**Goals:**
- Dynamically generate static routes for every active curator fetched from the backend (`/curadores/<slug>` in Spanish and `/en/curadores/<slug>` in English).
- Build `src/components/pages/curador/CuratorPage.astro` as a 100% static Astro component without client JavaScript overhead.
- Present the curator's portrait (with initials fallback), localized bio, email, website, and an interactive grid/list of their curated galleries (*salas*).
- Maintain slug-preserving language toggles between Spanish and English.
- Maintain full compatibility with SEO (`PageSEO`), Astro ClientRouter, and the living dependency map (`docs/component-dependencies.md`).

**Non-Goals:**
- Modifying backend API models, endpoints, or serializers.
- Introducing React client islands or interactive state on the curator page (pure Astro is optimal here).
- Building an index list page for all curators (out of scope for this change).

## Decisions

### Decision 1: Pure Astro component for CuratorPage
- **Approach**: Implement `CuratorPage.astro` using native Astro components (`Headline.astro`, `Title.astro`, `Image.astro`, `ImageCard.astro`, `PageSEO.astro`).
- **Rationale**: The curator profile and gallery list are static content known at build time. Avoids unnecessary client-side React hydration and keeps bundle size minimal.
- **Alternatives Considered**: React island with interactive filtering — unnecessary since a curator typically oversees a small number of galleries (1 to 5), so a clean static grid is much faster and more accessible.

### Decision 2: Layout Architecture — Editorial Monograph (Option A)
- **Approach**:
  - **Header / Hero Section**: Split-grid layout on desktop (`aspect-[4/5]` portrait on left, name, bio, email, and website on right). Monogram initials avatar when no photo is provided.
  - **Curated Galleries Section**: Editorial header ("Explora / Salas Curadas") followed by a responsive grid of `ImageCard` components linking to each gallery's detail page (`/salas/<slug>`).
- **Rationale**: Harmonizes with the visual design of `GalleryPage.astro` and `Home.astro`, adhering to EnredArte's paper (`#F2EDE4`), ink (`#1A1A1A`), and crimson (`#C41E3A`) color palette.

### Decision 3: View Helper `resolveCuratorGalleries` & `toSalaView`
- **Approach**: In `src/data/api.ts`, add helper function `resolveCuratorGalleries(curator, galleries)` to filter galleries matching `gallery.curator?.id === curator.id`. Map these through existing `toSalaView` so gallery cards have consistent badge numbers, artwork counts, and localized links.
- **Rationale**: Reuses existing business logic and avoids duplicating gallery card transformation logic.

### Decision 4: Localized Routing & Paths
- **Approach**:
  - Spanish: `/curadores/<slug>`
  - English: `/en/curadores/<slug>`
  - Add `getLocalizedCuratorPath(slug, lang)` in `src/lib/i18n/utils.ts`.
  - Pass `localizedPaths` in `[...path].astro` when `pageKey === "curator"`.
- **Rationale**: Matches existing route conventions (`/salas/<slug>` vs `/en/salas/<slug>`).

## Risks / Trade-offs

- **[Risk] Curator has no assigned galleries** →
  - *Mitigation*: Render a graceful localized notification message (`global.curator.noSalas`) instead of an empty broken grid.
- **[Risk] Curator has no portrait photo (`photo: null`)** →
  - *Mitigation*: Render a stylized 2-letter uppercase initials monogram inside a dark frame container (`bg-[#0D0D0D]`), identical to `CuratorCard.astro`.
- **[Risk] i18n translation key desynchronization** →
  - *Mitigation*: Run `pnpm validate-i18n` in CI and local build pipeline to ensure `es.json` and `en.json` have 100% key parity.
