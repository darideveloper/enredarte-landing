## 1. Copy and i18n keys

- [x] 1.1 Add `pages.notFound.*` keys (eyebrow, title, description ES-primary + EN secondary, CTA labels) to `src/messages/es.json`
- [x] 1.2 Add matching `pages.notFound.*` keys to `src/messages/en.json` and confirm key parity between both dictionaries

## 2. Page implementation

- [x] 2.1 Create `src/pages/404.astro` inside shared `Layout`: `Headline` eyebrow, serif `404` display, crimson hairline, bilingual description, `Btn` primary → `/` + `Btn` ghost → `/obras`
- [x] 2.2 Apply self-contained centering (`min-h-[60svh] grid place-items-center text-center`, `max-w-3xl px-6` container); no changes to `Layout`, `Header`, `Footer`, or any atom
- [x] 2.3 Wire `noindex` SEO via the existing `PageSEO`/`BaseSEO` chain (no bespoke meta tags)

## 3. Verification

- [x] 3.1 Run `pnpm run build` and confirm `dist/404.html` is emitted with HTTP 404 semantics intact
- [x] 3.2 Verify against the production build (`pnpm run build`, then serve `dist/` via preview or the nginx container — dev server does not exercise the nginx `error_page` path) that a bogus URL (e.g. `/salas/no-existe` and `/en/obras/nope`) renders the branded page centered at mobile + desktop widths with working CTAs
- [x] 3.3 Confirm no `rounded` containers, no white/cool-gray surfaces, and crimson confined to eyebrow + hairline + primary CTA

## 4. Docs sync

- [x] 4.1 Update `docs/component-dependencies.md`: add `404.astro` to the pages layer and dependency diagram per the living-diagram rule
