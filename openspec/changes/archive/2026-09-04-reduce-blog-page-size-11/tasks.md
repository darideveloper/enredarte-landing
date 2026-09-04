## 1. Code — paginated emission

- [x] 1.1 Change `const pageSize = 12` to `11` in `src/pages/[...path].astro:71` and verify `total_pages = Math.ceil(published.length / pageSize)` and `slice = published.slice(start, start + pageSize)` still derive correctly
- [x] 1.2 Build locally `pnpm build` and sanity-check emitted blog routes: `count=11 → 1 page`, `count=12 → 2 pages (11+1)`, `count=22 → 2 pages (11+11)`, `count=0 → empty-state` still emits `/blog` per language

## 2. Docs

- [x] 2.1 Update `docs/component-dependencies.md:30-31` from `ceil(count/12)` / `12-item slices` to `ceil(count/11)` / `11-item slices`, and verify `BlogIndex` tree note still accurate (mosaic + featured `hasFeatured = posts.length>1` unchanged)
- [x] 2.2 Update `docs/blog-api.md:60` example comment `GET /api/blog/posts/?page=1&page_size=12` → `11` (or note as illustrative; keep consistent with spec)

## 3. Spec reconciliation (covered by delta specs)

- [x] 3.1 Confirm `specs/blog/spec.md` and `specs/blog-pagination/spec.md` archive correctly produce `page_size=11`, `count <= 11`, and updated `count=22/12` mosaic scenarios (no other requirements changed)
- [x] 3.2 Run `openspec validate --change reduce-blog-page-size-11` and `pnpm build` pass; grepping `rg "page_size=12|count <= 12|ceil\(count/12\)"` finds no remaining normative blog assertions

## 4. Visual QA

- [x] 4.1 Visually verify `BlogIndex` at `lg` (3-col) has no orphan row on a full page: 11 cards → featured(2-col) + 10 = 12 grid units = 4 clean rows; single-item page uniform (no `lg:col-span-2`)
- [x] 4.2 Verify `PaginationNav` still: `total_pages<=1` hidden, `page 1 → /blog` base path, `Prev/Next` disabled states, bilingual labels (`Anterior/Siguiente` vs `Previous/Next`)

