## MODIFIED Requirements

### Requirement: Render section header
The system SHALL display a header using the `Title` molecule sourced from i18n (`pages.home.salas.eyebrow` and `pages.home.salas.title`) with formal, curated phrasing (e.g. `Capítulos` / `Chapters`, `Salas curadas para usted` / `Rooms curated for you`) instead of hardcoded `Explora` / `Pabellón de Salas`, and SHALL require `lang` prop (no default) so callers must pass `lang` explicitly.

#### Scenario: User views the gallery section
- **GIVEN** the gallery section is rendered
- **THEN** it displays the i18n eyebrow and title via `Title` molecule, and an optional "Ver todas las salas →" link.

#### Scenario: i18n header
- **WHEN** language is switched between ES and EN
- **THEN** the gallery header eyebrow and title appear in the selected language in formal register
