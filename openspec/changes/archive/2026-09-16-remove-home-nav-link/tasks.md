## 1. Nav source

- [x] 1.1 Remove the `home` entry from `getNavLinks()` in `src/lib/nav.ts` (keep remaining order: obras → salas → blog → artistas → curadores) — already applied, verify still in place
- [x] 1.2 Confirm `global.nav.home` keys stay in `src/messages/es.json` and `src/messages/en.json` (no i18n edits)

## 2. Verify

- [x] 2.1 Run `pnpm validate-i18n` and `pnpm validate-imports`
- [x] 2.2 Run `pnpm run dev` and check ES + EN header and footer render five links (Obras/Salas/Blog/Artistas/Curadores, no Inicio/Home) with correct hrefs and logo home link intact
