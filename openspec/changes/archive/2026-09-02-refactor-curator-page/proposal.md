## Why

`CuratorPage.astro` is currently a monolithic ~136-line page component containing inline JSX and layout markup for the profile hero (portrait frame, initials monogram, bio paragraph, contact link tags) and the curated salas section (header, responsive grid, empty state).

This violates the repository's strict Atomic Component Hierarchy, where page components must act as lightweight orchestrators (~35-50 lines) composing reusable organisms and molecules (such as `ArtworkPage.astro` and `Home.astro`).

## What Changes

- Create `src/components/organisms/CuratorHero.astro` to encapsulate the curator portrait, initials monogram fallback, localized biography, and contact link list.
- Create `src/components/organisms/CuratorSalas.astro` to encapsulate the *"Explora / Salas Curadas"* header, responsive `ImageCard` grid, and empty state fallback.
- Refactor `src/components/pages/curador/CuratorPage.astro` into a lightweight ~35-line page orchestrator that receives props, configures `PageSEO`, and composes `<CuratorHero />` + `<CuratorSalas />`.
- Update `docs/component-dependencies.md` to reflect the atomic hierarchy.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `curator-detail-page`: Refactors the curator detail page layout to compose `CuratorHero` and `CuratorSalas` organisms following the atomic component hierarchy without changing external route behavior or SEO contracts.

## Impact

- **Components**:
  - `[NEW] src/components/organisms/CuratorHero.astro`
  - `[NEW] src/components/organisms/CuratorSalas.astro`
  - `[MODIFY] src/components/pages/curador/CuratorPage.astro`
- **Documentation**:
  - `[MODIFY] docs/component-dependencies.md`
