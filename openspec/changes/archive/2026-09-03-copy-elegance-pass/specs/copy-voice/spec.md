## ADDED Requirements

### Requirement: Formal, matchmaker voice system
The system SHALL apply a shared brand voice across all user-facing copy: formal address (ES `usted` / EN elevated `you`), matchmaker thesis `Obras que encuentran su hogar. Usted encuentra su obra.` / `Works find their home. You find your work.`, invitation verbs (`Descubrir`, `Leer la curaduría`, `Afinar selección`), and explicit positive 65% proof `El 65% es para el artista` / `65% goes to the artist` — never negative framing (`no marketplace`) or transactional verbs.

#### Scenario: New page copy follows voice
- **WHEN** copy is added for any landing or future section
- **THEN** it uses formal address, invitation verbs, and the 65% positive framing where trust proof appears

#### Scenario: Voice is referenceable
- **WHEN** a contributor needs guidance on tone
- **THEN** this spec is the single source of truth for register, thesis line, and proof phrasing

### Requirement: i18n keys for all landing user-visible strings
The system SHALL source every user-visible landing string from `src/messages/{es,en}.json` via `getTranslations(lang)` — no hardcoded Spanish literals remain in landing components for badge, CTAs, headers, banner items, filter labels, empty states, or SEO description.

#### Scenario: ES/EN toggle shows translated landing
- **WHEN** the user switches language
- **THEN** every landing string (hero, banner, gallery headers, collection header, filters, empty state, SEO) appears in the selected language

#### Scenario: No hardcoded literals on landing
- **WHEN** the codebase is searched for landing component literals
- **THEN** no user-visible Spanish string remains hardcoded outside `src/messages/`
