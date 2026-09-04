## Context

Blog pagination is SSG-only. At build time `src/pages/[...path].astro:getStaticPaths` calls `fetchAll(listPosts)` (which pages internally at `page_size=100` via `src/lib/api/pagination.ts:9`), filters `published_at != null`, then derives `total_pages = ceil(count/pageSize)` and slices `pageSize` per page emitting `/blog`, `/blog/page/N` and `/en/blog` variants (`src/pages/[...path].astro:71-89`). The index grid (`src/components/pages/blog/BlogIndex.astro:77`) is a responsive mosaic: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[3px] auto-rows-fr` with the first item of any page where `posts.length>1` rendered as `PostCard featured` spanning `lg:col-span-2` (`BlogIndex.astro:30-32`). `PaginationNav.astro` is generic over `pagination` (`page`, `total_pages`) and uses `getLocalizedBlogPagePath` with page 1 mapping to the base path; it is i18n-aware and responsive.

Current `pageSize = 12`. With featured semantics that means a full page occupies 13 grid units (featured 2 + 11 regular) → `13 % 3 == 1` on `lg`, producing a trailing orphan row. Stakeholder request is to move to `11` so the mosaic tiles cleanly. No API, routing, or component contract change is desired.

## Goals / Non-Goals

**Goals:**
- Reduce posts per index page from 12 to 11 so every full page tiles the `lg:grid-cols-3` mosaic without orphans.
- Keep all existing contracts: Fork A emission in `[...path].astro`, `hasFeatured = posts.length>1` per-page, `page 1 ↔ base path`, bilingual `PaginationNav`, `fetchAll` isolation, drafts excluded, empty-state.
- Update specs and docs so they no longer assert `12`.

**Non-Goals:**
- No new pagination mode, no client-side pagination, no infinite scroll.
- No change to `fetchAll` page size, no backend `?page_size` default, no `BlogPost` detail.
- No redesign of `PostCard` featured styling or `PaginationNav` responsive behavior.

## Decisions

**Decision: Single constant change in `src/pages/[...path].astro:71` (`pageSize = 11`).**
- *Rationale:* That constant is the sole source of truth for `total_pages` and slicing. `BlogIndex`/`PaginationNav` already parameterize over `posts`/`pagination`, so they need no edit. Alternatives considered:
  - *Config file / env var / `src/lib/constants.ts`*: Rejected — YAGNI. Only one site uses this value, and indirection would obscure the SSG math without benefit. The spec already documents the value; a constant next to its consumers is clearest.
  - *Make it data-driven per language*: Rejected — both locales share the same grid; differing page sizes would break `localizedPaths` symmetry.

**Decision: Treat this as a spec delta on existing capabilities `blog` and `blog-pagination`, not a new capability.**
- *Rationale:* Behavior (paginated emission) is unchanged; only the quantitative parameter moves. Adding a new spec would duplicate the blog contract. `proposal.md` lists both as Modified Capabilities so the change produces delta specs that reconcile on archive.

**Decision: Update docs in same change (`docs/component-dependencies.md:30`, `docs/blog-api.md:60` example).**
- *Rationale:* Those docs currently assert `12` as derivation/example. Leaving them at `12` would contradict the implementation and spec after this change. They are not normative but should stay consistent; the tasks atomize them separately so review is explicit.

## Risks / Trade-offs

- **Page contents shift at same URLs** → URLs keep same scheme but slices move. `count=12` goes from 1 page to 2 (11+1); `/blog/page/2` new content differs from old. Mitigation: `astro build` regenerates all pages; deploy must purge CDN/sitemap. No redirect needed; no data loss.
- **More pages at scale** → 100 posts: 9 pages → 10 per lang (+~11%). Build cost linear, trivial for this dataset (current `count` is small). Tradeoff accepted for cleaner grid.
- **Spec/docs drift if missed** → Any remaining `12` assertion would cause `openspec validate` / doc inconsistency. Mitigation: tasks explicitly grep for `page_size=12`, `count <= 12`, `ceil(count/12)` strings and fixup.
- **Single-item last-page uniform rendering** → Last page with 1 post now occurs more often (e.g. `count=12` → page 2 has 1 card, rendered uniform per `>1` guard). This is the correct existing behavior but slightly more visible. No fix needed; matches user expectation for featured guard.

## Migration Plan

1. Merge change, run `pnpm build` (requires `API_BASE_URL`/`API_TOKEN` and reachable blog API; build fetches all posts). Verify emitted paths: e.g. `12` posts → `/blog` (11) + `/blog/page/2` (1) per language.
2. Deploy static output; purge CDN; regenerate sitemap/robots if they enumerate blog pages.
3. Rollback: revert `pageSize` to `12` and rebuild; no data migration.

## Open Questions

- None blocking. `docs/blog-api.md:60` example is aligned to `11` in this change for consistency (non-normative but tracked via tasks.md:2.2).
- `blog-pagination` spec keeps `page 1→base` unchanged — page-1 semantics are unrelated to page size.
