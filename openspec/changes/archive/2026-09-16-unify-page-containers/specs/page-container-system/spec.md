## ADDED Requirements

### Requirement: Canvas tier containers match the landing

Every canvas-tier section (galleries, grids, hero, immersive) SHALL use full-bleed horizontal spacing identical to the landing page: `px-6 md:px-14` with no max-width constraint, so content edges align with the landing at every viewport.

#### Scenario: Blog grid edges align with landing collection

- **WHEN** a user views `/blog` and `/` at the same desktop viewport width
- **THEN** the blog header hairline, grid left edge, and grid right edge align horizontally with the landing `#artworks-collection` content edges within 1px

#### Scenario: No max-width cap on canvas sections

- **WHEN** any canvas-tier section from the tier-assignment table renders at 1920px viewport width
- **THEN** its content box spans viewport width minus 112px (56px `md:px-14` per side) with no `max-w-*` class constraining it

#### Scenario: Mobile spacing unchanged

- **WHEN** any migrated page renders below 768px viewport width
- **THEN** horizontal padding is 24px per side (`px-6`), identical to before the change

### Requirement: Reading tier containers stay centered and capped

Every reading-tier block (article body, prose, footer inner, legal) SHALL use `mx-auto max-w-6xl px-6 md:px-14`, except the legal page which SHALL keep `mx-auto max-w-3xl px-6 md:px-14`.

#### Scenario: Article body stays readable on wide screens

- **WHEN** a blog post renders at 1920px viewport width
- **THEN** the article column is centered and capped at 1152px (`max-w-6xl`), not stretched edge-to-edge

#### Scenario: No uncentered max-width anywhere

- **WHEN** the codebase is searched for `max-w-6xl` / `max-w-3xl` / `max-w-5xl` layout containers
- **THEN** every match also carries `mx-auto`, except inner measure caps (`max-w-[720px]`, `max-w-[560px]`, `max-w-[72ch]`, `max-w-[48ch]`, `max-w-[44ch]`, `max-w-[420px]`, `max-w-[260px]`) which constrain text measure inside an already-placed container

### Requirement: Tier assignment per page and section

The system SHALL assign tiers as follows — canvas: landing sections, `BlogIndex` header/grid/empty-state wrappers, `GalleryPage` header + `#sala-artworks` section and wrappers, `ArtistPage` sections and inner grid, `BlogPost` hero overlay (when banner exists) and no-banner header, `CollectionIndex` wrapper, `CuratorHero` inner, `CuratorSalas` inner; reading: `BlogPost` body, `Footer` inner (bleed section bg + centered inner, decided), `LegalPage` (narrow); untouched: `ArtworkPage` immersive split, `Hero` split-layout cell (`px-6 lg:px-16` bespoke), `BannerBar` spacing scale (except `md:px-12` → `md:px-14`).

#### Scenario: Sala artworks section has section-level padding

- **WHEN** `GalleryPage` `#sala-artworks` renders
- **THEN** the section itself carries `px-6 md:px-14` (not only its inner divs), so filters and row cards never touch viewport edges after the inner caps are removed

#### Scenario: BannerBar matches landing rhythm

- **WHEN** the banner bar renders at desktop width
- **THEN** its horizontal padding is `md:px-14` (56px), matching landing sections instead of the current `md:px-12` (48px)

### Requirement: Shared container contract prevents drift

The two tiers SHALL be encoded once — as a Tailwind v4 `@utility` (or a `Container.astro` component) with `canvas` / `reading` / `narrow` variants — and every migrated file SHALL consume it instead of hand-written padding/max-width classes.

#### Scenario: Single source of truth

- **WHEN** a developer needs a page container
- **THEN** exactly one documented construct (`@utility container-site` variants or `Container.astro` props) provides it, and `docs/component-dependencies.md` references it

#### Scenario: No hand-rolled page containers remain

- **WHEN** the migrated page/organism files are searched for `px-6 md:px-14` combined with `max-w-6xl` or bare `px-6 md:px-14` section classes
- **THEN** no hand-rolled occurrences remain outside the shared construct (excluding `ArtworkPage` and inner text-measure caps)
