## ADDED Requirements

### Requirement: Artwork cards link to the artwork detail page
The `toArtworkView` builder SHALL set each artwork view's `href` to the localized artwork detail path (`/obras/<slug>` for Spanish, `/en/obras/<slug>` for English) instead of the placeholder `"#"`, so every artwork card across the site (homepage `ImageCard`s and gallery `ImageRowCard`s) becomes navigable to its detail page.

#### Scenario: Artwork view href points to its detail page (Spanish, root)
- **GIVEN** an artwork with slug `horizonte-en-tres-tiempos` and active language `es`
- **WHEN** `toArtworkView` produces the view
- **THEN** the view's `href` is `/obras/horizonte-en-tres-tiempos`

#### Scenario: English href uses the locale prefix
- **GIVEN** an artwork with slug `horizonte-en-tres-tiempos` and active language `en`
- **WHEN** `toArtworkView` produces the view
- **THEN** the view's `href` is `/en/obras/horizonte-en-tres-tiempos`
