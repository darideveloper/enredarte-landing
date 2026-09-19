## 1. Public visit client

- [x] 1.1 Create `src/lib/api/artwork-visits.ts` with `recordArtworkVisit(slug)` — single `fetch POST` to `{PUBLIC_API_BASE_URL}/api/artworks/artworks/:slug/visit/`, no body, no `Authorization`, `keepalive: true`, `AbortSignal.timeout(~5s)`, trailing-slash trim + `encodeURIComponent`, missing-`PUBLIC_API_BASE_URL` guidance error, zero retries
- [x] 1.2 Verify no `API_TOKEN` / `apiFetch` / `safeFetch` import in the new module (public-only path)

## 2. Artwork page trigger

- [x] 2.1 Expose `artworkSlug` as a `data-` attribute in `ArtworkPage.astro` section markup
- [x] 2.2 Add inline `<script>` in `ArtworkPage.astro` firing `recordArtworkVisit` once per `astro:page-load` (initial + ClientRouter swaps), fire-and-forget with catch-all swallow and dev-only `console.warn`, response body ignored
- [x] 2.3 Guard against double-registration/double-fire on repeated `astro:page-load` swaps (one POST per navigation)

## 3. Verification

- [x] 3.1 Typecheck (`pnpm exec astro check` or repo equivalent) and confirm no layout/SEO/conversion-slot regressions on `/obras/:slug` + `/en/obras/:slug` for available and non-available statuses
- [x] 3.2 Manual browser check via devtools network tab: one bodyless `POST .../visit/` per mount, none on non-artwork pages; `404`/`429`/offline produce no UI effect
- [x] 3.3 Conditional doc sync: if the merge diff touches `src/pages|components|layouts|lib|data|store|styles`, regenerate `docs/component-dependencies.md` on main before cleanup (AGENTS.md post-merge rule)
