## 1. i18n & Data Layer

- [x] 1.1 Add curator translation keys to `src/messages/es.json` and `src/messages/en.json` and verify with `pnpm validate-i18n`
- [x] 1.2 Add `getLocalizedCuratorPath(slug, lang)` in `src/lib/i18n/utils.ts` and export it
- [x] 1.3 Add `resolveCuratorGalleries(curator, galleries)` in `src/data/api.ts` to associate each curator with their curated galleries

## 2. Curator Page Implementation & Routing

- [x] 2.1 Create `src/components/pages/curador/CuratorPage.astro` implementing the profile hero (portrait image / monogram initials fallback, name, bio, email, website) and curated galleries section reusing `ImageCard`, `Headline`, `Title`, and `PageSEO`
- [x] 2.2 Update `src/pages/[...path].astro` to emit static paths for every curator (`/curadores/<slug>` and `/en/curadores/<slug>`), map `curator: CuratorPage` in `COMPONENT_MAP`, and pass `localizedPaths` to `<Layout>`

## 3. Documentation & Verification

- [x] 3.1 Update `docs/component-dependencies.md` to document the new `CuratorPage` hierarchy and route mappings
- [x] 3.2 Execute `pnpm build` to verify `validate-i18n`, `validate-imports`, and Astro static page generation succeed with 0 errors
