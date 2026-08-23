# footer-organism Specification

## Purpose
Defines the behavior contract for the footer organism: dark editorial palette, atomic composition from existing atoms, shared navigation consumption, business-data-driven contact and social content, and a localized bottom bar.

## ADDED Requirements

### Requirement: Dark Editorial Footer Bar
The `Footer` component SHALL render as a full-width footer with the dark `ink` palette, contrasting the light paper pages above it.

#### Scenario: Rendering the dark footer
- **WHEN** the `Footer` component is rendered
- **THEN** it uses `bg-ink` with light foreground text and a top border that separates it from the page content
- **THEN** it is placed at the end of the page body, below the page content

### Requirement: Atomic Composition
The `Footer` SHALL compose the existing `Logo`, `Link`, `Headline`, and `LangBtns` atoms rather than re-implementing their markup.

#### Scenario: Composing existing atoms
- **WHEN** the `Footer` is rendered
- **THEN** it renders the `Logo` atom with a light-on-dark variant linking to the localized home path
- **THEN** it renders nav and contact links through the `Link` atom using the footer variant
- **THEN** it renders column headings through the `Headline` atom
- **THEN** it renders the language switcher through the `LangBtns` atom in its `inverse` variant in the bottom bar

### Requirement: Shared Navigation
The `Footer` MUST source its navigation links from the same shared `getNavLinks(lang)` helper as the `Header`, keeping both in sync.

#### Scenario: Mirroring the header navigation
- **WHEN** the `Footer` is rendered
- **THEN** it outputs exactly four navigation links: **Home**, **Obras**, **Salas**, **Artistas**
- **THEN** the **Home** link points to the localized home page path (e.g. `/` for English, `/es` for Spanish)
- **THEN** the **Obras**, **Salas**, and **Artistas** links render as the same UI-only anchor placeholders as the header (`#obras`, `#salas`, `#artistas`)

### Requirement: Localized Column Headings and Tagline
The `Footer` SHALL localize its column headings and tagline through the i18n layer.

#### Scenario: Localizing the brand tagline
- **WHEN** the site is rendered in Spanish
- **THEN** the brand tagline resolves to the Spanish site description ("Descubre el arte en cada rincón")
- **WHEN** the site is rendered in English
- **THEN** the brand tagline resolves to the English site description ("Discover art in every corner")
- **THEN** column headings resolve through the `global.footer` translation keys

### Requirement: Business Contact Data
The `Footer` SHALL render phone, email, and address contact details sourced from `BUSINESS_DATA`, with phone and email as clickable `tel:` and `mailto:` links respectively.

#### Scenario: Rendering contact details
- **WHEN** the `Footer` contact column is rendered
- **THEN** it displays the formatted phone number as a `tel:` link
- **THEN** it displays the business email as a `mailto:` link
- **THEN** it displays the full address derived from the business contact data

### Requirement: Social Links
The `Footer` SHALL render Facebook and Instagram as inline SVG icon links sourced from `SOCIAL_LINKS`, each with a localized `aria-label`.

#### Scenario: Rendering social icons
- **WHEN** the `Footer` brand column is rendered
- **THEN** it renders a Facebook icon link pointing to the configured Facebook URL
- **THEN** it renders an Instagram icon link pointing to the configured Instagram URL
- **THEN** each icon link exposes an accessible localized `aria-label`

### Requirement: Localized Bottom Bar
The `Footer` SHALL render a bottom bar with the copyright line (current year + business name + localized rights text), a "Powered by" attribution linking to `https://darideveloper.com`, and the language switcher.

#### Scenario: Rendering the bottom bar
- **WHEN** the `Footer` bottom bar is rendered
- **THEN** it displays `© {currentYear} {businessName}` followed by the localized rights text
- **THEN** it displays the localized "Powered by" label followed by a `DariDevTeam` brand link to `https://darideveloper.com`
- **THEN** it renders the `LangBtns` language switcher in its `inverse` variant

### Requirement: i18n Parity
The `Footer` SHALL only reference translation keys that exist in both `en.json` and `es.json`.

#### Scenario: Keeping translations in sync
- **WHEN** `pnpm validate-i18n` runs
- **THEN** all `global.footer` translation keys referenced by the footer exist in both language files
