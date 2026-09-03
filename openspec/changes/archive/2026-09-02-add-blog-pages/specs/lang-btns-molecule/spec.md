## MODIFIED Requirements

### Requirement: Routes inactive language
The button corresponding to the inactive language MUST be a functional link that routes to the correct localized path.

#### Scenario: Viewing English page
- **WHEN** the user is viewing a page in English (`lang="en"`, `pageKey="about"`)
- **THEN** the ES button MUST be a link pointing to the localized Spanish URL (e.g., `/acerca-de`) and have interactive hover effects

#### Scenario: Paginated blog index preserves page across languages
- **WHEN** the user is on `/blog/page/2` (es)
- **THEN** the English button links to `/en/blog/page/2` via the `localizedPaths` prop passed through `Layout` → `Header` → `LangBtns`

#### Scenario: Blog post detail preserves slug across languages
- **WHEN** the user is on `/blog/enredarte-abre-nuevas-salas` (es)
- **THEN** the English button links to `/en/blog/enredarte-abre-nuevas-salas` via `localizedPaths`
