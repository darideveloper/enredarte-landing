## Why

The backend REST API provides art curator profiles (`/apis/artworks/art-curators/`) and links them to the galleries (*salas*) they curate. While gallery detail pages display an embedded curator snippet, curators currently lack dedicated standalone showcase pages.

Providing dedicated curator pages allows visitors to learn about each curator's philosophy, bio, and background, and explore all exhibitions and art galleries curated by them in both Spanish and English.

## What Changes

- Add a dynamic route per curator in both languages (`/curadores/<slug>` for Spanish and `/en/curadores/<slug>` for English) generated at build time in `src/pages/[...path].astro`.
- Add `getLocalizedCuratorPath(slug, lang)` in `src/lib/i18n/utils.ts`.
- Add `resolveCuratorGalleries(curator, galleries)` in `src/data/api.ts` to associate each curator with their curated galleries.
- Create `src/components/pages/curador/CuratorPage.astro` rendering the curator's portrait/monogram, localized bio, contact channels (email, website), and a showcase of their curated galleries (*salas*).
- Support slug-preserving language switching on curator pages by passing `localizedPaths` to `<Layout>` and `<Header>`.
- Add localized translation keys in `src/messages/es.json` and `src/messages/en.json` (enforcing strict parity via `validate-i18n`).
- Update `docs/component-dependencies.md` to keep the living architecture documentation in sync.

## Capabilities

### New Capabilities
- `curator-detail-page`: Generates build-time static curator profile pages (`/curadores/<slug>` and `/en/curadores/<slug>`) with localized bio, contact links, curated galleries grid, slug-preserving language switching, and localized SEO metadata.

### Modified Capabilities
<!-- None: No existing requirement contracts are altered. -->

## Impact

- **Routing & Pages**: `src/pages/[...path].astro` emits additional static paths and maps `curator: CuratorPage`.
- **i18n**: `src/lib/i18n/utils.ts`, `src/messages/es.json`, `src/messages/en.json`.
- **Data Layer**: `src/data/api.ts` (helper to link curators to their galleries).
- **Components**: New `src/components/pages/curador/CuratorPage.astro` composing existing atoms/molecules (`Headline`, `Title`, `Image`, `ImageCard`, `PageSEO`).
- **Docs**: `docs/component-dependencies.md`.
