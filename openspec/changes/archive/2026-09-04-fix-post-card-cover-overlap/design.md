## Context

`PostCard.astro` has two branches: `bannerSrc ?` image letterbox vs placeholder. Featured (`featured=true`, `lg:col-span-2` on `BlogIndex` `lg:grid-cols-3 auto-rows-fr`) uses `relative shrink-0 aspect-[16/10]` wrapper with `img absolute inset-0 w-full h-full object-cover` + `gradient absolute inset-0` + `date absolute top-3 left-3` + `overlay absolute inset-0 flex flex-col justify-end`. The overlay covering `inset-0` means the title block can grow upward until it hits the badge. The wrapper being `shrink-0` means it never stretches when the grid cell is taller (neighbor regular cards stretch via `flex-1` paper info), leaving a `bg-card-dark` gap. Regular cards (`aspect-[4/3] shrink-0 + bg-paper flex-1`) are unaffected.

Constraints: keep `BlogIndex` grid `auto-rows-fr`, keep `page_size=11` tiling (featured 2-col + 10 regular = 12 units = 4 rows), keep tokens (`bg-card-dark`, `from-black/75`, `brightness`, `scale-[1.05]`), keep `pickPostField`/`banner_image` absolute-URL contract, keep `hasFeatured = posts.length>1`.

## Goals / Non-Goals

**Goals:**
- Featured image actually `cover`s the whole grid cell on `lg` (no gap when row taller).
- Featured date badge never collides with title/desc/cta on 320-375px narrow.
- Two-class minimal diff, regular cards visually identical.

**Non-Goals:**
- New grid system, new `page_size`, new i18n keys, new component/props, or restyling regular cards.
- Flow rewrite (Option B) or responsive split (Option C) — explicitly deferred.

## Decisions

**D1 — Cover: `flex-1 min-h-0 w-full` on featured wrapper (Option A / 1a).**
- Change `["relative overflow-hidden bg-card-dark shrink-0", featured ? "aspect-[16/10]" : "aspect-[4/3]"]` to featured branch `relative overflow-hidden bg-card-dark flex-1 min-h-0 w-full aspect-[16/10]`. Outer `<a>` stays `flex flex-col h-full`, so the wrapper now stretches to fill the cell; `aspect-[16/10]` becomes intrinsic min-height (row height when no stretch needed) while `object-cover` guarantees crop when stretched. Regular stays `shrink-0 aspect-[4/3]`.
- *Alternatives:* 1b change grid to `auto-rows-auto` (loses equal row heights, regular baselines drift); 1c full-bleed `absolute inset-0` on wrapper + `min-h-[320px]` on card (loses aspect control, heavier). Rejected for minimality.

**D2 — Overlap: overlay `inset-x-0 bottom-0` + `pt-12` reservation (Option A / 2a).**
- Change overlay `absolute inset-0 flex flex-col justify-end p-6 md:p-8` to `absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 md:p-8 pt-12`. Date stays `absolute top-3 left-3`. Gradient stays `absolute inset-0`. The `pt-12` (48px) reserves the badge row (≈ badge 9px + padding + tracking ≈ 28px + 12px gap). Content can still scroll/clamp (`line-clamp-2`) but never reaches badge.
- *Alternatives:* 2b flow column (`flex flex-col justify-between` with badge relative) — collision-proof but moves badge off true `top-3` and changes layering; 2c responsive split (mobile paper, desktop overlay) — adds branch/duplication. Rejected for minimality; 2a is reversible in one class.

**D3 — Scope to featured banner branch only.**
- Edits only the `bannerSrc ?` featured path in `PostCard.astro:45-74`. The `bannerSrc==null` placeholder (`min-h-[320px] p-8`) already has no overlap (title and badge share same flex), so no change. Regular branch untouched.

## Risks / Trade-offs

- [Risk] Stretching featured wrapper changes crop on tall rows (more vertical crop via `object-cover`) → Mitigation: `object-cover` + `object-center` preserved; crop is centered, editorial still balanced; visual QA on `count=11` full page.
- [Risk] `pt-12` may waste space on very short titles (extra top padding on narrow) → Mitigation: `pt-12` only on overlay (bottom-anchored), so it just pushes content down; empty space is still over gradient, not paper; acceptable vs collision.
- [Risk] Regular cards still `shrink-0` but row now filled by featured stretch — regular row heights unchanged → No action needed.
- [Trade-off] Collision still theoretically possible on 3-line title + 2-line desc + narrowest 320px if content exceeds `pt-12` buffer → Mitigation: `line-clamp-2` on desc + `text-balance` already limits; if QA shows overflow, future iteration can switch to 2b without breaking contract.

## Migration Plan

- CSS-only deploy; no migration. Build `pnpm build` renders 73 pages; visual check `/blog` and `/blog/page/2` at `lg` (featured 2-col row) and `320px` narrow. Rollback: revert two class strings.

## Open Questions

- None blocking. If QA wants zero-risk guarantee on overlap, follow-up can adopt 2b flow column — additive, not breaking.
