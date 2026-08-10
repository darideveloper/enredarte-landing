## Purpose

Defines the `<ClientRouter />` integration, its interplay with i18n and GSAP, and the modular documentation structure in `docs/astro-client-side-page-transitions.md` that allows projects to adopt Client Router alone or in combination with i18n and/or GSAP.

## Requirements

### Requirement: Client Router is active on all pages
The project SHALL import `<ClientRouter />` from `astro:transitions` and render it in the shared layout `<head>` so that every page dispatches `astro:page-load` on initial load and after every client-side navigation.

#### Scenario: Navigation fires lifecycle events
- **WHEN** an internal `<a>` link is clicked on any page using the shared layout
- **THEN** the target page HTML is fetched and swapped in-place without a full browser reload, and `astro:after-swap` followed by `astro:page-load` are dispatched on `document`.

### Requirement: Modular documentation for Client Router combinations
The guide at `docs/astro-client-side-page-transitions.md` SHALL be structured so each integration layer is a standalone section: a base Client Router setup (§3), a Client Router + i18n subsection, a Client Router + GSAP subsection, and framework-specific notes (Zustand persistence). A project consuming only the base setup SHALL find a complete, self-contained guide without cross-dependencies on i18n or GSAP sections.

#### Scenario: Developer wants Client Router only
- **WHEN** a developer reads §3 and stops
- **THEN** they have all the information to add `<ClientRouter />` to their layout and migrate `DOMContentLoaded` logic to `astro:page-load` without needing to read the i18n or GSAP subsections.

#### Scenario: Developer wants Client Router + i18n
- **WHEN** a developer continues to the i18n subsection
- **THEN** they find guidance on `<html lang>` attribute update via `<head>` swap, localized `<a href>` path compatibility, and hreflang alternate link handling.

#### Scenario: Developer wants Client Router + GSAP
- **WHEN** a developer continues to the GSAP subsection
- **THEN** they find the full pattern: `mm.revert()` on `astro:after-swap`, re-init on `astro:page-load`, direct `init()` for first paint, `ScrollTrigger.refresh()` on every navigation, `transition:animate="none"` on animated sections, and a Hero entrance guard via `sessionStorage`.
