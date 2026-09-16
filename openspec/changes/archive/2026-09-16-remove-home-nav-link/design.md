## Context

- `Header.astro` renders logo left, `Menu` center, lang switcher + hamburger right. Breakpoint behavior (`md:` drawer-to-row switch) is unchanged by this work.
- Nav links come from `getNavLinks(lang)` in `src/lib/nav.ts` (previously six entries including home; now five: obras, salas, blog, artistas, curadores), rendered by both `Header.astro` (via `Menu`) and `Footer.astro` (via `footer`-variant `Link` list). Labels resolve through `global.nav.*` keys in `src/messages/es.json` / `en.json`.
- Existing spec `header-organism` pins a five-link nav without Curadores; it already drifted from code (six links with Curadores) and this change's delta corrects the list to the new five (with Curadores, without Home).

## Goals / Non-Goals

**Goals:**
- Home/Inicio removed from header and footer nav; home stays reachable via the logo (`getLocalizedPath("home", lang)`).
- Spec delta brings `header-organism` back in sync with code.

**Non-Goals:**
- No change to responsive breakpoints, header padding, drawer offset, toggle animation, or footer layout.
- No i18n key cleanup (`global.nav.home` retained in both locales).
- No new nav items, no index pages for salas/artistas/curadores, no changes to in-page anchors (`#artworks-collection`, `#salas-gallery`, `#curadores`).

## Decisions

- **Single-source removal in `getNavLinks()`.** Delete the `home` entry rather than filtering in `Header` — both header and footer drop Inicio/Home together, no divergent nav sources, no prop threading. Alternative considered: header-only filter — rejected, user chose both.
- **Keep dead `global.nav.home` keys.** Zero runtime cost, avoids churn if the link returns or is reused; deletion would be a trivial follow-up.

## Risks / Trade-offs

- [Risk] Footer loses a link users may expect → Mitigation: covered by the footer-organism delta in this change; logo preserves home access in header and footer brand column.
- [Risk] Spec drift re-introduced if the deltas miss the pre-existing Curadores/Blog gaps → Mitigation: both deltas restate the full five-link list explicitly (header-organism + footer-organism).

## Migration Plan

- Single static change, no data migration. Deploy with normal site build; rollback = revert `src/lib/nav.ts` + archived spec delta.
- Verification: `pnpm run dev`, confirm Inicio/Home absent in ES + EN header/footer, logo home link intact.

## Open Questions

- None. Scope answers confirmed: both header + footer, keep i18n keys.
