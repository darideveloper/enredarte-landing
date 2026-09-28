## MODIFIED Requirements

### Requirement: Render the curator profile hero layout
The curator page SHALL render an editorial profile hero organism (`CuratorHero.astro`) displaying the curator's portrait photo (or initials monogram fallback if no photo exists), localized name, localized biography text meeting WCAG AA contrast (minimum 4.5:1 against the paper background), social links from `social_links` only (email and website SHALL NOT be rendered visibly), accessible touch targets of at least 44px for social links, accessible monogram markup with `aria-hidden="true"`, and external link indicators. Email and website data SHALL still be passed to `personSchema` for SEO JSON-LD (hidden for humans, kept for machines).

#### Scenario: Profile shows portrait, name, bio, and social links
- **GIVEN** a curator with a photo, bio, and social links (e.g. `hugo-salinas` with instagram)
- **WHEN** the curator detail page renders
- **THEN** the portrait is displayed alongside the name, biography, and social links only
- **AND** no email or website link is visible
- **AND** the biography text color achieves WCAG AA contrast ratio (>= 4.5:1) against the paper surface
- **AND** the social links have a minimum touch target height of 44px

#### Scenario: Curator without photo shows initials fallback
- **GIVEN** a curator with `photo: null`
- **WHEN** the curator detail page renders
- **THEN** an elegant monogram of the curator's name initials is displayed in place of the photo with `aria-hidden="true"` and an accessible container label

#### Scenario: Missing social links are omitted
- **GIVEN** a curator with empty `social_links` (e.g. `renata-ortega`)
- **WHEN** the curator detail page renders
- **THEN** no contact row or divider is displayed and no broken or empty social links appear

#### Scenario: Social platform labels are localized with fallback
- **GIVEN** a curator social link with platform `instagram`
- **WHEN** the hero renders the link
- **THEN** the visible label uses `global.footer.social.<platform>` when the key exists, else the raw platform string
