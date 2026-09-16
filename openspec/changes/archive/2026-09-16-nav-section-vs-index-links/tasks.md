## 1. Routes + nav helper

- [x] 1.1 Add `obras`, `salas`, `artistas`, `curadores` keys to `src/lib/i18n/routes.ts` (es canonical, `en/` prefix)
- [x] 1.2 Rewrite `src/lib/nav.ts`: home-prefixed anchors for obras/artistas (`#artworks-collection`) and salas (`#salas-gallery`), `getLocalizedPath("curadores")` for curadores, blog unchanged
- [x] 1.3 Verify `getPageKeyFromUrl` + sitemap pick up the new keys (no extra wiring)

## 2. Static paths + component map

- [x] 2.1 Emit ES/EN static paths for the 4 indexes in `src/pages/[...path].astro` `getStaticPaths()`
- [x] 2.2 Add COMPONENT_MAP entries + `localizedPaths` branches for the index pageKeys
- [x] 2.3 Create minimal index page components under `src/components/pages/` (listing content can be thin v1)

## 3. Discovery CTAs on Home

- [x] 3.1 Add "Ver todo" links to `obras` + `artistas` indexes in `Home.astro` collection section (with `pages.home.*` translation keys)
- [x] 3.2 Add "Ver todo" link to `salas` index in `Gallery.astro`
- [x] 3.3 Add missing translation keys to `src/messages/es.json` + `en.json`, run `pnpm validate-i18n`

## 4. Docs + verification

- [x] 4.1 Update `docs/component-dependencies.md` nav paragraph (section-vs-page rule, orphaned-index discovery)
- [x] 4.2 Click-test matrix: each nav item on `/`, `/en/`, `/blog`, one detail page — anchors land home+scroll, Curadores lands on index, LangBtns preserves index page
- [x] 4.3 Run build + `pnpm validate-i18n`
