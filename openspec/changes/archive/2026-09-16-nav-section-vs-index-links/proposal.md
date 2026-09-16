## Why

Three of five header/footer nav items are broken or degraded: `Curadores → #curadores` points at a nonexistent section (dead everywhere), and the bare-fragment links (`#artworks-collection`, `#salas-gallery`) work on Home but resolve against the current page everywhere else (blog, legal, detail pages). Fixing this now unblocks the planned `/salas`, `/obras`, `/artistas`, `/curadores` index pages with a clear section-vs-page routing rule.

## What Changes

- Nav rule: every nav item links to its dedicated index page (`/obras`, `/salas`, `/artistas`, `/curadores`, with `en/` prefix in English). Homepage sections remain as content but are no longer nav targets.
- `Obras`, `Salas`, `Artistas`, `Curadores` → dedicated index pages via `getLocalizedPath` — no anchor links in nav.
- Add 4 index routes (`obras`, `salas`, `artistas`, `curadores`, Spanish-slug canonical with `en/` prefix) with static paths, component map entries, and localized-path support.
- "Ver todo" CTAs in the homepage collection and gallery sections link to the same index pages (consistent with nav).
- Header and Footer both pick this up automatically (shared `getNavLinks`); no separate header/footer markup changes.

## Capabilities

### New Capabilities
- `collection-index-pages`: index routes + listing pages for obras, salas, artistas, curadores in both languages.

### Modified Capabilities
- `header-organism`: nav targets change from bare fragments to home-prefixed anchors + one index path.
- `footer-organism`: same nav target change (shared helper); legal/contact columns untouched.

## Impact

- `src/lib/i18n/routes.ts`, `src/lib/nav.ts` (+ home-base anchor helper), `src/pages/[...path].astro` (paths, COMPONENT_MAP, localizedPaths).
- 4 new page components under `src/components/pages/`; "Ver todo" CTAs in `Home.astro` collection section and `Gallery.astro`.
- Docs/specs sync: `docs/component-dependencies.md`, `header-organism` and `footer-organism` spec assertions.
