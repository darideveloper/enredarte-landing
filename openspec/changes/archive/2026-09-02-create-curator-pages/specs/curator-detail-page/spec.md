## Purpose

Provides a build-time generated curator detail page per art curator in both languages (`/curadores/<slug>` for Spanish, `/en/curadores/<slug>` for English) with localized bio, contact channels, associated curated galleries, slug-preserving language switching, and localized SEO metadata.

## ADDED Requirements

### Requirement: Generate a curator detail route per curator
The system SHALL generate a dedicated curator detail page for every active art curator fetched from the API at build time, in both languages — `/curadores/<slug>` for Spanish (root) and `/en/curadores/<slug>` for English (`en/` prefix) — by extending the existing `[...path].astro` catch-all `getStaticPaths()` and adding a `curator` entry to its `COMPONENT_MAP`.

#### Scenario: Spanish curator page exists
- **GIVEN** an art curator with slug `renata-ortega`
- **WHEN** `/curadores/renata-ortega` is requested
- **THEN** the curator detail page renders with the Spanish curator content

#### Scenario: English curator page exists
- **GIVEN** an art curator with slug `renata-ortega`
- **WHEN** `/en/curadores/renata-ortega` is requested
- **THEN** the curator detail page renders with the English curator content

#### Scenario: Unknown slug yields no page
- **GIVEN** a slug with no matching curator
- **WHEN** it is requested
- **THEN** no curator page is emitted for that slug

### Requirement: Render the curator profile hero layout
The curator page SHALL render an editorial profile header with the curator's portrait photo (or initials fallback if no photo exists), localized name, localized biography text, and available contact links (email mailto, external website).

#### Scenario: Profile shows portrait, name, bio, and contact links
- **GIVEN** a curator with a photo, bio, email, and website
- **WHEN** the curator detail page renders
- **THEN** the portrait is displayed alongside the name, biography, email link, and website link

#### Scenario: Curator without photo shows initials fallback
- **GIVEN** a curator with `photo: null`
- **WHEN** the curator detail page renders
- **THEN** an elegant monogram of the curator's name initials is displayed in place of the photo

#### Scenario: Missing contact channels are omitted
- **GIVEN** a curator with no email or website
- **WHEN** the curator detail page renders
- **THEN** no broken or empty contact links are displayed

### Requirement: Render the curated galleries section
The curator page SHALL render a dedicated section displaying all galleries (*salas*) curated by this curator, linking directly to each gallery's detail page (`/salas/<slug>` in Spanish and `/en/salas/<slug>` in English) with its title, artwork count, and cover image.

#### Scenario: Curator with assigned galleries displays gallery cards
- **GIVEN** a curator who curates two galleries
- **WHEN** the curator page renders
- **THEN** both galleries are displayed with their cover image, title, artwork count, and link to their detail page

#### Scenario: Curator with no assigned galleries displays fallback notice
- **GIVEN** a curator with zero associated galleries
- **WHEN** the curator page renders
- **THEN** an appropriate localized empty state or notification message is displayed

### Requirement: Language switch preserves the curator slug
On a curator detail page, the `LangBtns` language switcher SHALL link to the same curator slug in the alternate language (`/curadores/<slug>` <-> `/en/curadores/<slug>`) by passing localized paths to the layout.

#### Scenario: Switch language stays on the curator
- **GIVEN** the user is on `/curadores/hugo-salinas` (Spanish)
- **WHEN** they click the English language button
- **THEN** they navigate to `/en/curadores/hugo-salinas` with English content

### Requirement: Emit localized SEO metadata
The curator page SHALL emit a localized `<title>` and meta description, a canonical URL equal to the current path, and an `og:image` pointing at the curator's portrait (or site default image), via the existing `PageSEO` component.

#### Scenario: SEO metadata is present
- **GIVEN** a rendered curator page
- **THEN** the document title and meta description reflect the curator's name and bio
- **AND** the canonical URL and hreflang tags match the requested curator path
