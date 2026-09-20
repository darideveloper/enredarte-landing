# footer-organism Specification

## Purpose
Defines the behavior contract for the footer organism: dark editorial palette, atomic composition from existing atoms, shared navigation consumption, business-data-driven contact and social content, and a localized bottom bar.

## Requirements

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
- **THEN** it outputs exactly five navigation links: **Obras**, **Salas**, **Blog**, **Artistas**, **Curadores** (no Home link; home stays reachable via the logo)
- **THEN** the **Obras**, **Salas**, **Artistas**, and **Curadores** links point to their dedicated index pages (`/obras`, `/salas`, `/artistas`, `/curadores` for Spanish; `/en/`-prefixed for English) — the same targets as the header
- **THEN** the **Blog** link points to `getLocalizedBlogPath(lang)` (`/blog` for Spanish, `/en/blog` for English)

### Requirement: Localized Column Headings and Tagline
The `Footer` SHALL localize its column headings and tagline through the i18n layer.

#### Scenario: Localizing the brand tagline
- **WHEN** the site is rendered in Spanish
- **THEN** the brand tagline resolves to the Spanish site description ("Descubre el arte en cada rincón")
- **WHEN** the site is rendered in English
- **THEN** the brand tagline resolves to the English site description ("Discover art in every corner")
- **THEN** column headings resolve through the `global.footer` translation keys

### Requirement: Business Contact Data
The `Footer` SHALL render final phone, WhatsApp, email, and simplified location contact details sourced from `BUSINESS_DATA` / site-config constants, with phone as a `tel:` link, WhatsApp as an external `wa.me` link, email as a `mailto:` link, and the location as plain text. Map integration stays parked in code and unrendered.

#### Scenario: Rendering final contact details
- **WHEN** the `Footer` contact column is rendered
- **THEN** it displays `+52 624 176 4802` as a `tel:+526241764802` link via the `Link` footer variant
- **THEN** it displays `+52 1 624 176 4802` as a `https://wa.me/5216241764802` link opening in a new tab with `rel="noopener"`, via the `Link` footer variant
- **THEN** it displays `info@enredarte.com` as a `mailto:info@enredarte.com` link via the `Link` footer variant
- **THEN** it displays the plain-text location `Mexico City, Mexico` (no street, no zone, no postal code, no country code)
- **THEN** it renders no Google Maps link; `GOOGLE_MAPS` coordinates remain in the codebase commented / unreferenced by the footer for later use

#### Scenario: Sourcing values from site-config
- **WHEN** site-config is read
- **THEN** `PHONES.main` holds display `+52 624 176 4802` with `href tel:+526241764802`
- **THEN** a WhatsApp constant holds display `+52 1 624 176 4802` with `href https://wa.me/5216241764802`
- **THEN** `EMAIL` holds `info@enredarte.com` with `href mailto:info@enredarte.com`
- **THEN** `BUSINESS_DATA.url` is `https://enredarte.mx`
- **THEN** `BUSINESS_DATA.social` keeps Facebook `https://www.facebook.com/enredarte` and Instagram `https://www.instagram.com/enredarte/` unchanged

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
- **THEN** all `global.footer` translation keys referenced by the footer (including any new WhatsApp / legal labels) exist in both language files

### Requirement: Random Artwork Entry
The `Footer` SHALL render the `RandomArtworkBtn` island as the last item of the nav column list, fed by build-time available slugs.

#### Scenario: Rendering the random entry
- **WHEN** the `Footer` is rendered with a non-empty `artworkSlugs` prop
- **THEN** the nav column `<ul>` ends with a list item hosting `<RandomArtworkBtn client:load>` with `slugs={artworkSlugs}`, the page `lang`, the `global.footer.random` label, and the current artwork slug (parsed from `Astro.url`, undefined off artwork pages)
- **WHEN** the draw is empty (no slugs, or only the current artwork)
- **THEN** no trailing item is rendered

#### Scenario: Receiving slugs through Layout
- **WHEN** any page renders through `Layout`
- **THEN** `Layout` forwards its optional `artworkSlugs` prop to `Footer`
- **WHEN** `[...path].astro` renders `Layout`
- **THEN** it passes `availableSlugs` (artworks with `status === "available"`, slugs only)