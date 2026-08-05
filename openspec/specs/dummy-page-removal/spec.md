# dummy-page-removal Specification

## Purpose

Ensures the About and Services dummy pages are fully removed from the codebase — routes gone, page components and the duplicate `Button` atom deleted, Footer links trimmed, and orphaned translations cleaned up — so the site serves only the Home landing page.

## Requirements

### Requirement: About and Services routes are removed
The routing configuration SHALL NOT contain `services` or `about` entries, and the dynamic route SHALL NOT render either page component.

#### Scenario: Routes config has only home
- **WHEN** `src/lib/i18n/routes.ts` is inspected
- **THEN** it SHALL contain only the `home` route key and SHALL NOT contain `services` or `about`

#### Scenario: Dynamic route has no dummy pages
- **WHEN** `src/pages/[...path].astro` is inspected
- **THEN** it SHALL NOT import or map `Services` or `About` components

#### Scenario: Dummy URLs no longer resolve
- **WHEN** a user requests `/services`, `/es/servicios`, `/about`, or `/es/sobre-nosotros`
- **THEN** none of these pages SHALL be generated or served

### Requirement: Dummy page components are deleted
The `Services.astro` and `About.astro` page components SHALL be removed from the codebase.

#### Scenario: Page component files removed
- **WHEN** the `src/components/pages/` directory is inspected
- **THEN** it SHALL contain only the `landing/Home.astro` page component

### Requirement: Duplicate Button atom is deleted
The `src/components/atoms/Button.tsx` component SHALL be removed because its only consumer is the deleted `Services.astro`. `Btn.tsx` SHALL remain the single button atom.

#### Scenario: Button atom removed
- **WHEN** the `src/components/atoms/` directory is inspected
- **THEN** `Button.tsx` SHALL NOT exist and `Btn.tsx` SHALL still exist

#### Scenario: No dangling imports
- **WHEN** the codebase is searched for imports of `atoms/Button`
- **THEN** there SHALL be zero references

### Requirement: Footer links only Home
The Footer SHALL list only the Home page in its link section.

#### Scenario: Footer link list trimmed
- **WHEN** `src/components/organisms/Footer.astro` is rendered
- **THEN** its links list SHALL contain only the Home navigation link

### Requirement: Orphaned translations are removed
The message files SHALL NOT contain translation keys for the removed pages or the removed button label.

#### Scenario: Message files cleaned
- **WHEN** `src/messages/en.json` and `src/messages/es.json` are inspected
- **THEN** they SHALL NOT contain `global.nav.services`, `global.nav.about`, `global.learnMore`, or any `pages.services.*` / `pages.about.*` keys
