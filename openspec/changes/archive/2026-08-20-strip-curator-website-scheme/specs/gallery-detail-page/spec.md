## MODIFIED Requirements

### Requirement: Render the curator block
The gallery page SHALL render the full curator data — photo, name, localized bio, email, and website — using a `CuratorCard` molecule composed from the existing `Image` atom and the card styling already used by `CardSummary`. The website SHALL be displayed as a link whose visible text is the website URL without its scheme (leading `http://` or `https://` removed), while the link target remains the full original URL.

#### Scenario: Curator information is displayed
- **GIVEN** a gallery whose curator has a photo, bio, email, and website
- **WHEN** the gallery page renders
- **THEN** the curator's photo, name, bio, email, and website are visible
- **AND** the bio is shown in the active language

#### Scenario: Website link hides the URL scheme
- **GIVEN** a curator whose website is `https://www.example.com/`
- **WHEN** the curator card renders the website link
- **THEN** the visible text reads `www.example.com` (no `https://` prefix and no trailing slash)
- **AND** the link's `href` is the full `https://www.example.com/`

#### Scenario: Email is unaffected
- **GIVEN** a curator with an email address
- **WHEN** the curator card renders
- **THEN** the email is displayed unchanged as a `mailto:` link
