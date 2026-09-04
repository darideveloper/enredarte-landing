# Proposal: reduce-blog-page-size-11

## Why

The blog index grid (`BlogIndex.astro:77`) is a 3-column mosaic (`lg:grid-cols-3`) where the first card on every page with `>1` post is featured and spans 2 columns (`lg:col-span-2`, `src/components/pages/blog/BlogIndex.astro:30`). With `page_size=12` (`src/pages/[...path].astro:71`) the featured + 11 regular cards occupy 13 grid units (2+11), leaving a ragged orphan row (`13 % 3 == 1`). At `page_size=11` the featured + 10 regulars occupy exactly 12 units (2+10), producing 4 clean rows (`12 % 3 == 0`). The change improves visual rhythm with zero functional cost.

## What Changes

- Change `pageSize` in `src/pages/[...path].astro:71` from `12` to `11` (affects `total_pages = ceil(count/pageSize)` at line 72 and slicing at line 78).
- Update normative spec examples and thresholds that encode `12` as `page_size` and `count <= 12` guards (no other runtime code hardcodes `12`; `BlogIndex.astro` and `PaginationNav.astro` are generic over `pagination`).
- Update `docs/component-dependencies.md:30-31` derivation note from `ceil(count/12)` / `12-item slices` to `11`.
- No new routes, components, or API contracts. No breaking API change — `fetchAll(listPosts)` still fetches with `page_size=100` internally (`src/lib/api/pagination.ts:9`) and slices locally; backend `?page_size` is unaffected. Existing URLs keep same shape (`/blog`, `/blog/page/N`, `/en/blog/page/N`); page contents shift (e.g. `count=12` goes from 1 page to 2 pages: 11+1).

## Capabilities

### New Capabilities
<!-- none — this is a parameter tweak, not a new capability -->

### Modified Capabilities

- `blog`: Paginated emission threshold and `page_size` in "Generate static blog index and detail routes" and "Render the blog index grid" (scenarios for `count` vs `total_pages`, `12-item slices` → `11-item slices`, `count=20/13` examples).
- `blog-pagination`: Page-math note in "Static numbered pagination nav" requirement (`page_size=12` → `11`, `page 1→base` unchanged).

## Impact

- **Code**: `src/pages/[...path].astro:71-78` — single constant change. No component API change; `BlogIndex.astro`, `PostCard.astro`, `PaginationNav.astro` unchanged.
- **Specs**: `openspec/specs/blog/spec.md`, `openspec/specs/blog-pagination/spec.md` (and their archived change copies stay historical).
- **Docs**: `docs/component-dependencies.md:30-31` and `docs/blog-api.md:60` example aligned from `12` → `11` for consistency (non-normative but tracked).
- **Build**: ~9% more static blog pages at scale (100 posts: 9 → 10 pages per language). Negligible linear cost.
- **SEO / caching**: Page number contents shift; `/blog/page/2` will contain different posts after rebuild. Requires CDN/sitemap regeneration on deploy, no redirect needed (same URL scheme).
- **Risks**:
  - Page contents shift at same URLs → mitigate by purging CDN/sitemap on deploy; `astro build` regenerates.
  - More pages at scale (+~11%) → negligible, linear build cost.
  - Spec/docs drift if missed → mitigated by tasks grepping `page_size=12|count <= 12|ceil(count/12)`.
  - Single-item last page more frequent (`count=12` → 11+1) → renders uniform per `hasFeatured>1` guard, correct behavior, slightly more visible.
