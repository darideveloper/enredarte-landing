## 1. Organism Components

- [x] 1.1 Create `src/components/organisms/CuratorHero.astro` encapsulating the curator portrait, initials monogram fallback, typography, bio, and contact links
- [x] 1.2 Create `src/components/organisms/CuratorSalas.astro` encapsulating the curated salas section header, responsive `ImageCard` grid, and empty state

## 2. Page Refactoring & Verification

- [x] 2.1 Refactor `src/components/pages/curador/CuratorPage.astro` to compose `<CuratorHero />` and `<CuratorSalas />` as a slim orchestrator (~35 lines)
- [x] 2.2 Update `docs/component-dependencies.md` to reflect the new `CuratorHero` and `CuratorSalas` organisms
- [x] 2.3 Execute `pnpm build` to verify `validate-i18n`, `validate-imports`, and Astro static generation succeed with 0 errors
