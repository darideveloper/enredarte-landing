## Context

The project ships a single-page landing (Home) with anchor sections (Salas, Artistas, Curadores, Gaceta, Eventos, Trade). The initial project setup scaffolded two dummy pages — About and Services — each wired through three layers: route keys in `src/lib/i18n/routes.ts`, the dynamic route `src/pages/[...path].astro` (`getStaticPaths` + `COMPONENT_MAP`), and page components under `src/components/pages/`. These pages also pulled in a second button atom (`Button.tsx`) that duplicates `Btn.tsx` with an incompatible design vocabulary (rounded, `brand-500`/`gray` colors vs. the crimson/ink/paper, sharp-corner system).

Removal is purely additive-to-absence: no new dependencies, no schema changes, no build-config changes. The sitemap integration (`@astrojs/sitemap`) derives paths from generated static routes, so it adapts automatically.

## Goals / Non-Goals

**Goals:**
- Remove the About and Services pages (EN + ES routes) and their page components.
- Delete the `Button.tsx` atom, whose only consumer is `Services.astro`.
- Remove orphaned route keys, translations, and the Footer's dead nav links.
- Leave the Home page, `Btn.tsx`, SEO, Header, LangBtns, design-system page, and sitemap fully working.

**Non-Goals:**
- No new pages, sections, or routing redesign (e.g., building the real Salas/Artistas pages).
- No restyling of the Footer or other surviving components.
- No changes to `Btn.tsx` or any other shared atom/molecule/organism.
- No reworking of the SEO resolution chain (`BaseSEO.astro` falls back gracefully for `home` only).

## Decisions

### Delete, don't disable
Remove the routes and components outright rather than commenting them out or guarding with flags. Dead scaffold code should not linger — the repo history preserves it, and a route key in `routes.ts` would still generate a static path.

### Reduce Footer nav to `["home"]`
`Footer.astro:25` iterates a hardcoded array `["home", "services", "about"]` and calls `t(`global.nav.${key}`)`. Since the `services`/`about` nav translations are deleted, the array MUST be trimmed to `["home"]` in the same change or the Footer will render a `MISSING:` translation in dev and a stale `//home`... link. Keeps the loop pattern intact.

### Remove translation keys in lockstep
The keys `global.nav.services`, `global.nav.about`, `global.learnMore`, and `pages.services.*` / `pages.about.*` exist only for the dummy pages. Removing them alongside the routes avoids orphaned keys (and avoids the `[i18n] Missing translation key` dev warning if `currentPage` ever resolved to a removed key). `global.nav.home`, `global.footer.*`, and `pages.home.*` are retained.

### Leave `getLocalizedPath` and `PageKey` mechanics untouched
`getLocalizedPath` already returns `"/"` for unknown/missing keys, and `PageKey` is derived from `routes` via `keyof typeof routes`, so collapsing the map to one key requires no defensive code. `BaseSEO.astro` resolves `currentPage` from the key only, so it stays consistent.

## Risks / Trade-offs

- **Stale docs** → `docs/astro-i18n.md` and `docs/astro-atomic-components.md` reference `/services`, `/about`, and `Button.tsx`. These are documentation-only; a follow-up cleanup is tracked as an optional task, not a build blocker.
- **Archived OpenSpec specs** reference `pageKey="about"` / `href="/about"` as examples → Archive artifacts are historical records and are intentionally NOT modified.
- **Design-system page** shows a `#about` placeholder anchor in the Link demo → It is a demo href, not a page route; no change required.
- **Accidental link 404** → Search confirms no surviving component links to the removed localized paths (Header uses anchor sections; Footer is the only routable-nav consumer).
