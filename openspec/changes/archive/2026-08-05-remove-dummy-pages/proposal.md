## Why

The About and Services pages are leftover scaffold/dummy pages from the initial project setup. They were never meant to ship — the real product is the single-page landing (Home) with sections like Salas, Artistas, Gaceta, and Eventos. Keeping them adds dead routes, orphaned translations, and a second, conflicting button atom (`Button.tsx`) that duplicates `Btn.tsx` with an incompatible design vocabulary.

## What Changes

- **BREAKING**: Remove the `/services` and `/es/servicios` routes.
- **BREAKING**: Remove the `/about` and `/es/sobre-nosotros` routes.
- Delete `src/components/pages/services/Services.astro` and `src/components/pages/about/About.astro`.
- Delete `src/components/atoms/Button.tsx` — its only consumer is `Services.astro`. `Btn.tsx` remains the single button atom.
- Remove the `services` and `about` entries from `src/lib/i18n/routes.ts`; `PageKey` collapses to `home`.
- Remove `services` and `about` from the dynamic route `src/pages/[...path].astro` (imports + `COMPONENT_MAP`).
- Trim the Footer link list (`src/components/organisms/Footer.astro`) from `["home", "services", "about"]` to `["home"]`.
- Remove orphaned translations from `src/messages/en.json` and `src/messages/es.json`: `global.nav.services`, `global.nav.about`, `global.learnMore`, and the entire `pages.services.*` and `pages.about.*` blocks.
- The generated sitemap and `design-system` page continue to work unchanged; only Home routes remain.

## Capabilities

### New Capabilities
- `dummy-page-removal`: Ensures the About and Services pages (and their routes) no longer exist, the Footer only links to Home, and no orphaned translations or the duplicate `Button` atom remain.

### Modified Capabilities
- (none — no existing spec's requirements change; the removed pages have no corresponding spec)

## Impact

- **Code removed**: `src/components/pages/about/About.astro`, `src/components/pages/services/Services.astro`, `src/components/atoms/Button.tsx`.
- **Code edited**: `src/lib/i18n/routes.ts`, `src/pages/[...path].astro`, `src/components/organisms/Footer.astro`, `src/messages/en.json`, `src/messages/es.json`.
- **Routing**: `/about`, `/es/sobre-nosotros`, `/services`, `/es/servicios` no longer resolve.
- **Dependencies**: none added. `@astrojs/sitemap` auto-adapts to the remaining static paths.
- **Documentation references** (non-blocking): `docs/astro-i18n.md`, `docs/astro-atomic-components.md`, and archived proposal notes reference the removed pages/Button atom.
