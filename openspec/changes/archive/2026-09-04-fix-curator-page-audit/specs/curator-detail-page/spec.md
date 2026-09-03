## MODIFIED Requirements

### Requirement: Render the curator profile hero layout
The curator page SHALL render an editorial profile hero organism (`CuratorHero.astro`) displaying the curator's portrait photo (or initials monogram fallback if no photo exists), localized name, localized biography text meeting WCAG AA contrast (minimum 4.5:1 against the paper background), accessible touch targets of at least 44px for contact links, accessible monogram markup with `aria-hidden="true"`, and external link indicators.

#### Scenario: Profile shows portrait, name, bio, and contact links
- **GIVEN** a curator with a photo, bio, email, and website
- **WHEN** the curator detail page renders
- **THEN** the portrait is displayed alongside the name, biography, email link, and website link
- **AND** the biography text color achieves WCAG AA contrast ratio (>= 4.5:1) against the paper surface
- **AND** the contact links have a minimum touch target height of 44px

#### Scenario: Curator without photo shows initials fallback
- **GIVEN** a curator with `photo: null`
- **WHEN** the curator detail page renders
- **THEN** an elegant monogram of the curator's name initials is displayed in place of the photo with `aria-hidden="true"` and an accessible container label

#### Scenario: Missing contact channels are omitted
- **GIVEN** a curator with no email or website
- **WHEN** the curator detail page renders
- **THEN** no broken or empty contact links are displayed

### Requirement: Render the curated galleries section
The curator page SHALL render a dedicated curated galleries organism (`CuratorSalas.astro`) displaying all galleries (*salas*) curated by this curator, linking directly to each gallery's detail page (`/salas/<slug>` in Spanish and `/en/salas/<slug>` in English) with its title, artwork count, and cover image. The section eyebrow SHALL be fully localized in Spanish ("Explora") and English ("Explore"), and individual gallery card titles SHALL render as `<h3>` elements to preserve semantic document heading hierarchy.

#### Scenario: Curator with assigned galleries displays gallery cards
- **GIVEN** a curator who curates two galleries
- **WHEN** the curator page renders
- **THEN** both galleries are displayed with their cover image, title, artwork count, and link to their detail page
- **AND** the gallery card titles are rendered as `<h3>` elements nested under the section's `<h2>`

#### Scenario: Curator section header is fully localized
- **GIVEN** the curator page renders in English (`/en/curadores/<slug>`)
- **WHEN** the curated rooms section is displayed
- **THEN** the section eyebrow renders localized text ("Explore") rather than hardcoded Spanish

#### Scenario: Curator with no assigned galleries displays fallback notice
- **GIVEN** a curator with zero associated galleries
- **WHEN** the curator page renders
- **THEN** an appropriate localized empty state or notification message is displayed
