## MODIFIED Requirements

### Requirement: Formal, matchmaker voice system
The system SHALL apply a shared brand voice across all user-facing copy: formal address (ES `usted` / EN elevated `you`), matchmaker thesis `Obras que encuentran su hogar. Usted encuentra su obra.` / `Works find their home. You find your work.`, invitation verbs (`Descubrir`, `Leer la curaduría`, `Afinar selección`), and explicit positive 65% proof `El 65% es para el artista` / `65% goes to the artist` — never negative framing (`no marketplace`) or transactional verbs. Voice long copy MAY be authored as markdown (`**`, links, lists) and SHALL be rendered via the shared `markdown-rendering` renderer (GFM, `breaks: true`, trusted CMS) so bold/links render in prose styling.

#### Scenario: New page copy follows voice
- **WHEN** copy is added for any landing or future section with markdown
- **THEN** it uses formal address, invitation verbs, and the 65% positive framing where trust proof appears, and renders via `renderMarkdown`

#### Scenario: Voice is referenceable
- **WHEN** a contributor needs guidance on tone
- **THEN** this spec is the single source of truth for register, thesis line, and proof phrasing
