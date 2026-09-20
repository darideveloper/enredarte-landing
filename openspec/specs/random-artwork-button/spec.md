# random-artwork-button Specification

## Purpose

Defines the behavior contract for the random-artwork navigation button: a React island that jumps same-tab to a randomly picked available artwork, excluding the page currently viewed and hiding when no destination exists.

## Requirements

### Requirement: Random available-artwork navigation
The `RandomArtworkBtn` component SHALL navigate same-tab to a randomly picked available artwork's localized detail page.

#### Scenario: Picking a random artwork
- **WHEN** the user clicks the button with a non-empty slug list
- **THEN** the component picks one slug uniformly at random and calls `window.location.assign()` with `getLocalizedArtworkPath(pick, lang)` (`/obras/<slug>` for Spanish, `/en/obras/<slug>` for English)

### Requirement: Build-time available-only pool
The slug list SHALL contain only artworks with `status === "available"`, computed at build time.

#### Scenario: Filtering sold and reserved works
- **WHEN** `[...path].astro` builds the `availableSlugs` prop from `siteData.artworks`
- **THEN** artworks with any other status (sold, reserved, on_loan, not_available) are excluded

### Requirement: Current artwork exclusion
The component SHALL exclude the currently viewed artwork from the draw when a current slug is known.

#### Scenario: Excluding the current page
- **WHEN** `currentSlug` matches an entry in the slug list and more than one candidate remains
- **THEN** the pick is drawn from the list minus `currentSlug`
- **WHEN** `currentSlug` is undefined or not in the list
- **THEN** the pick is drawn from the full list

### Requirement: Empty-draw hiding
The component SHALL render nothing when no destination exists.

#### Scenario: Hiding with nowhere to go
- **WHEN** the slug list is empty, or filtering out `currentSlug` leaves zero candidates
- **THEN** the component renders nothing (no disabled placeholder)

### Requirement: Localized label
The button SHALL display its label from the `global.footer.random` translation key.

#### Scenario: Rendering both languages
- **WHEN** rendered in Spanish
- **THEN** the label reads "Descubrir una obra"
- **WHEN** rendered in English
- **THEN** the label reads "Discover an artwork"
- **WHEN** `pnpm validate-i18n` runs
- **THEN** the `global.footer.random` key exists in both `es.json` and `en.json`
