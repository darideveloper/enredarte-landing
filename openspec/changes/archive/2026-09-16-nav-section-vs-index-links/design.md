## Context

Header and Footer share `getNavLinks(lang)` (`src/lib/nav.ts`), which previously returned bare fragments (`#artworks-collection`, `#salas-gallery`, `#curadores`). Bare fragments break on non-home pages, and `#curadores` has no target at all. The agreed rule: every nav item links to its dedicated index page. Four index pages (`obras`, `salas`, `artistas`, `curadores`) use Spanish-slug canonical URLs mirroring the existing detail-page prefixes (`/obras/<slug>`, `/salas/<slug>`, etc.).

## Goals / Non-Goals

**Goals:**
- Nav links to dedicated index pages from every page (no anchor links in nav).
- Index routes follow the existing i18n convention (`routes.ts` + `getLocalizedPath` + `LangBtns`).
- Header/Footer stay in sync via the single shared helper.

**Non-Goals:**
- Index page full visual/listing design (rich content is a follow-up; minimal route-wired stubs that render per tasks 2.3 are in scope).
- Changing nav labels, order, or count (still 5 items, no Home link).
- Touching legal/contact/social footer columns.

## Decisions

- **Dedicated index pages over anchors**: all five content nav items resolve to real pages via `getLocalizedPath`, so they work identically from home, blog, legal, and detail pages with no fragment-scroll edge cases. Homepage sections (`#artworks-collection`, `#salas-gallery`) remain as content with "Ver todo" CTAs pointing at the same indexes.
- **Spanish slugs for index keys (`obras`, `salas`, `artistas`, `curadores`)**: matches existing detail prefixes and legal-slug precedent; English via `en/` prefix. Alternative (translated slugs like `/rooms`) rejected — breaks the established convention.
- **`routes.ts` as single source of truth**: adding the 4 keys auto-enables `getLocalizedPath`, `getPageKeyFromUrl`, sitemap, and language-switch preservation — no parallel URL tables.

## Risks / Trade-offs

- [Index pages land as thin stubs if content change slips] → Mitigation: routes+components ship together (tasks ordered so).
- [Spec drift in `component-dependencies.md` + organism specs] → Mitigation: explicit docs task in `tasks.md`.

## Migration Plan

No migration: additive routes + href changes only. Rollback = revert `nav.ts`/`routes.ts`/`[...path].astro` diff. No data or API changes.

## Open Questions

- Should `Menu.astro` mark the Curadores link active when on `/curadores` (page link) vs never-active for anchors? (Suggest: active only for page-backed items: Blog, Curadores.)
- Exact "Ver todo" label/copy per language (needs `pages.home.*` translation keys).
