## MODIFIED Requirements

### Requirement: Routes inactive language
The button corresponding to the inactive language MUST be a functional link that routes to the correct localized path.

#### Scenario: Viewing English page
- **WHEN** the user is viewing a page in English (`lang="en"`, `pageKey="about"`)
- **THEN** the ES button MUST be a link pointing to the localized Spanish URL (e.g., `/acerca-de`) and have interactive hover effects
