## Purpose

Provides a dual-button interface that surfaces all available languages (ES and EN), highlighting the active language and providing functional links to switch to inactive languages.

## ADDED Requirements

### Requirement: Displays all language options
The component MUST display a distinct button for "ES" and a distinct button for "EN".

#### Scenario: Rendering buttons
- **WHEN** the component is rendered
- **THEN** both an ES button and an EN button are visible to the user

### Requirement: Disables active language
The button corresponding to the current active language MUST be disabled and non-interactive.

#### Scenario: Viewing Spanish page
- **WHEN** the user is viewing a page in Spanish (`lang="es"`)
- **THEN** the ES button MUST be disabled with no hover effects and no `href` attribute

### Requirement: Routes inactive language
The button corresponding to the inactive language MUST be a functional link that routes to the correct localized path.

#### Scenario: Viewing English page
- **WHEN** the user is viewing a page in English (`lang="en"`, `pageKey="about"`)
- **THEN** the ES button MUST be a link pointing to the localized Spanish URL (e.g., `/es/acerca-de`) and have interactive hover effects
