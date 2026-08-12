# gallery-data Specification

## Purpose
Provides the dummy gallery and curator data module that mirrors the backend models, is bilingual, acts as the single source of truth for both the homepage gallery section and the detail pages, and exposes API-facing types for a future API swap.

## Requirements

### Requirement: Define gallery and curator data types
The system SHALL define `Gallery` and `ArtCurator` data types that mirror the backend models' fields — `Gallery` SHALL include `slug`, `logo`, a `curator` reference, `sortOrder`, a `status` (`active` | `upcoming`), an ordered list of artworks, and bilingual `name`/`description`; `ArtCurator` SHALL include `slug`, `name`, `email`, `website`, `photo`, and a bilingual `bio`. Bilingual content SHALL be embedded as `{es, en}` in the data, while the `GalleryTranslation`, `ArtCuratorTranslation`, and `ArtworkGallery` record types SHALL be declared in `src/lib/api/types.ts` for future API fidelity. Timestamps and unrendered backend fields are out of scope (rendered-only fidelity). The module SHALL expose the future API response types from `src/lib/api/types.ts` and SHALL be shaped so a later API swap requires no page/component changes.

#### Scenario: Types mirror the backend models
- **GIVEN** the dummy gallery data module
- **THEN** `Gallery` exposes `slug`, `logo`, `curator`, `sortOrder`, `status`, ordered `artworks`, and per-language `name`/`description`
- **AND** `ArtCurator` exposes `slug`, `name`, `email`, `website`, `photo`, and per-language `bio`

#### Scenario: Bilingual content is available
- **GIVEN** a gallery with both translations present
- **WHEN** the active language is `es` or `en`
- **THEN** the gallery name/description and curator bio render in that language

### Requirement: Reference shared artworks by slug
The system SHALL link each gallery to its artworks by referencing the shared `Artwork` entries from `src/data/catalog.ts` (which SHALL gain a `slug` field), and SHALL expose them ordered as the `ArtworkGallery` join does (via `sort_order`).

#### Scenario: Gallery exposes its own ordered artworks
- **GIVEN** a gallery referencing three artworks
- **WHEN** the gallery data is read
- **THEN** exactly those three artwork objects (with image, title, artist, and all facet fields) are returned in `sort_order`

#### Scenario: Artworks have stable slugs
- **GIVEN** the `Artwork` interface in `data/catalog.ts`
- **THEN** every artwork carries a unique `slug` value used for gallery-to-artwork references

### Requirement: Single source of truth for the homepage gallery section
The homepage "Pabellón de Salas" section SHALL derive its cards from the shared galleries module instead of the inline `salasData` array in `Home.astro`, so both the homepage and the detail pages consume the same data.

#### Scenario: Homepage cards match the shared data
- **GIVEN** the galleries module contains five galleries
- **WHEN** the homepage is rendered
- **THEN** the `Gallery` organism displays one card per gallery, with each card's title/meta derived from the module and its `href` pointing to that gallery's detail page

#### Scenario: Card subtitle derives from sortOrder and status
- **GIVEN** a gallery with `sortOrder: 1` and `status: "active"`, and a second gallery with `sortOrder: 4` and `status: "upcoming"`
- **WHEN** the homepage gallery section renders
- **THEN** the first card's subtitle reads "Sala 01 · Activa" and the second reads "Sala 04 · Próximamente", both derived from the module's `sortOrder` and `status`

### Requirement: Expose API-facing types
The system SHALL declare the gallery/curator response types in `src/lib/api/types.ts` (currently empty) and SHALL have the dummy data module satisfy them, defining the contract the future API response must match.

#### Scenario: Types are importable by the data module
- **GIVEN** `src/lib/api/types.ts`
- **THEN** it exports the gallery and curator response types used by `data/galleries.ts`
- **AND** the dummy data is assignable to those types without casts
