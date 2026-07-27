## ADDED Requirements

### Requirement: Custom i18n routing via catch-all page
The project SHALL use a custom i18n system centered on a catch-all `src/pages/[...path].astro` router. All page routes SHALL be defined in `src/lib/i18n/routes.ts` as a single object mapping page keys to per-language slugs.

#### Scenario: English home page renders at root
- **WHEN** a user visits `/`
- **THEN** the catch-all router SHALL render the home page component with `lang="en"`

#### Scenario: Spanish home page renders at /es
- **WHEN** a user visits `/es`
- **THEN** the catch-all router SHALL render the home page component with `lang="es"`

#### Scenario: getStaticPaths generates all language variants
- **WHEN** the site is built
- **THEN** `getStaticPaths` in `[...path].astro` SHALL generate one static page per language for every route in `routes.ts`

### Requirement: English routes are unprefixed
English routes SHALL NOT include a language prefix. The English home page path SHALL be `""` (empty string, rendering at `/`). Other English pages SHALL render at `/<slug>` (e.g., `/services`).

#### Scenario: English route has no prefix
- **WHEN** a route key has `en: "services"` in `routes.ts`
- **THEN** the page SHALL be accessible at `/services`

### Requirement: Spanish routes use /es/ prefix
Spanish routes SHALL use the `/es/` prefix. The Spanish home page path SHALL be `"es"`. Other Spanish pages SHALL render at `/es/<slug>` (e.g., `/es/servicios`).

#### Scenario: Spanish route has prefix
- **WHEN** a route key has `es: "es/servicios"` in `routes.ts`
- **THEN** the page SHALL be accessible at `/es/servicios`

### Requirement: JSON translation files
Translations SHALL be stored in `src/messages/<lang>.json` files with nested key structure. One file per language. Each language file SHALL have an identical key structure.

#### Scenario: Translation key resolves to correct value
- **WHEN** a page calls `t("pages.home.title")` with `lang="es"`
- **THEN** it SHALL return the value from `src/messages/es.json` at key `pages.home.title`

#### Scenario: Missing key falls back to default language
- **WHEN** a translation key exists in `en.json` but not in `es.json`
- **THEN** the `t()` function SHALL return the English value as fallback

#### Scenario: Missing key logs warning in dev
- **WHEN** a translation key is missing from all languages and `import.meta.env.DEV` is true
- **THEN** the `t()` function SHALL log `[i18n] Missing translation key: "<key>"` to console and return `MISSING: <key>`

### Requirement: Variable interpolation in translations
The `t()` function SHALL support variable interpolation using `{varName}` syntax in translation strings.

#### Scenario: Variable replaces placeholder
- **WHEN** a translation string is "Welcome, {name}!" and `t("key", { name: "Alice" })` is called
- **THEN** it SHALL return "Welcome, Alice!"

### Requirement: Build-time i18n validation
A validation script at `scripts/validate-i18n.ts` SHALL verify that all language files have identical key structures. The script SHALL run before `astro build` in the build pipeline.

#### Scenario: Validation passes with matching keys
- **WHEN** `en.json` and `es.json` have identical dotted keys
- **THEN** the validation script SHALL exit with code 0 and print "✅ i18n validation passed!"

#### Scenario: Validation fails with missing keys
- **WHEN** `es.json` is missing a key that exists in `en.json`
- **THEN** the validation script SHALL exit with code 1 and print the missing keys

### Requirement: Language detection from URL
The system SHALL detect the current language from the URL pathname. If the first path segment is `"es"`, the language is Spanish. All other paths are English.

#### Scenario: Language detected from URL
- **WHEN** `getLangFromUrl` is called with URL `https://example.com/es/servicios`
- **THEN** it SHALL return `"es"`

### Requirement: Language switcher
The system SHALL provide a way to switch between languages using `getLocalizedPath()` to compute the alternate language URL for the current page.

#### Scenario: Language switcher computes correct URL
- **WHEN** on English page `/services` and switching to Spanish
- **THEN** `getLocalizedPath("services", "es")` SHALL return `/es/servicios`
