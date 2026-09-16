## Why

The Home/Inicio link is redundant — the logo already links to the localized home page — so it adds noise to both the header and the footer (they share one nav source).

## What Changes

- Remove the Home/Inicio entry from `getNavLinks()` in `src/lib/nav.ts` (**BREAKING** for nav consumers: header shows 5 links, footer lists 5 links).
- Keep `global.nav.home` translation keys in `src/messages/es.json` / `en.json` (unused, retained for safety/reuse).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `header-organism`: nav drops from six links to five (Obras, Salas, Blog, Artistas, Curadores).
- `footer-organism`: shared nav drops the Home link (five links: Obras, Salas, Blog, Artistas, Curadores); also corrects the pre-existing drift (spec claimed four links without Blog/Curadores).

## Impact

- Affected code: `src/lib/nav.ts` (already applied).
- Affected consumers: `Header.astro` and `Footer.astro` (both render `getNavLinks()`); logo home link unchanged, so home stays reachable.
- No API, data, routing, or responsive-behavior changes.
