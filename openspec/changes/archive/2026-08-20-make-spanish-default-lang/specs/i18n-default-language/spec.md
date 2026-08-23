## ADDED Requirements

### Requirement: Spanish is the default (unprefixed) language
The i18n routing system SHALL treat Spanish as the default language, owning the bare root paths with no language prefix. English SHALL use the `/en` prefix.

#### Scenario: Spanish home at root
- **WHEN** the home page is requested at `/`
- **THEN** the system renders the Spanish home page with `lang="es"`

#### Scenario: English home under prefix
- **WHEN** the home page is requested at `/en`
- **THEN** the system renders the English home page with `lang="en"`

#### Scenario: Spanish gallery at unprefixed path
- **WHEN** a gallery with slug `s` is requested at `/salas/s`
- **THEN** the system renders the Spanish gallery page

#### Scenario: English gallery under prefix
- **WHEN** a gallery with slug `s` is requested at `/en/salas/s`
- **THEN** the system renders the English gallery page

### Requirement: Language detection from URL
The system SHALL derive the current language from the first URL segment: `/en` resolves to English, and any other path resolves to Spanish (the default).

#### Scenario: Detecting English
- **WHEN** the URL's first segment is `en`
- **THEN** the detected language is `en`

#### Scenario: Detecting Spanish by default
- **WHEN** the URL's first segment is anything other than `en` (including the root `/`)
- **THEN** the detected language is `es`

### Requirement: Translation fallback to Spanish
The translation function SHALL resolve a missing translation key for the current language by falling back to Spanish (the default language).

#### Scenario: Missing key on English page
- **WHEN** an `en` translation key is missing
- **THEN** the system returns the corresponding `es` value

#### Scenario: Missing key on Spanish page
- **WHEN** an `es` translation key is missing
- **THEN** the system does not fall back to the `en` translation (Spanish is the default and has no cross-language fallback)

### Requirement: Legacy redirects for old Spanish URLs
The system SHALL redirect legacy Spanish-prefixed URLs (`/es`, `/es/...`) to their new unprefixed equivalents to preserve existing URLs.

#### Scenario: Redirect old Spanish home
- **WHEN** `/es` is requested
- **THEN** the system redirects to `/`

### Requirement: SEO default language and x-default
The SEO component SHALL default to Spanish when no language is provided and SHALL emit an `x-default` hreflang tag pointing at the root (`/`).

#### Scenario: SEO default language
- **WHEN** the SEO component is rendered without a `lang` prop
- **THEN** the component treats the language as `es`

#### Scenario: x-default hreflang
- **WHEN** a localized page with known `currentPage` renders SEO metadata
- **THEN** the HTML includes `<link rel="alternate" hreflang="x-default" href="<site-root>/">`
