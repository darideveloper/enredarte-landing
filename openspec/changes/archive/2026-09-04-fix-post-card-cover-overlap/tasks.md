## 1. PostCard featured — cover + overlap (Option A)

- [x] 1.1 In `src/components/pages/blog/PostCard.astro:46` change featured wrapper from `relative overflow-hidden bg-card-dark shrink-0 aspect-[16/10]` to `relative overflow-hidden bg-card-dark flex-1 min-h-0 w-full aspect-[16/10]` (regular `aspect-[4/3] shrink-0` unchanged); keep `img absolute inset-0 w-full h-full object-cover` + `gradient absolute inset-0`
- [x] 1.2 In `src/components/pages/blog/PostCard.astro:63` change featured overlay from `absolute inset-0 flex flex-col justify-end p-6 md:p-8` to `absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 md:p-8 pt-12` (date `absolute top-3 left-3` unchanged)
- [x] 1.3 Verify no change to `bannerSrc==null` placeholder branch (`PostCard.astro:76`) or regular branch — untouched

## 2. Verification

- [x] 2.1 `pnpm build` succeeds and `dist/blog/index.html` shows featured first card with `lg:col-span-2` and `inset-x-0 bottom-0 pt-12`
- [x] 2.2 Visual QA: `lg` 3-col — 11-item page (featured 2-col + 10 regular = 12 units = 4 rows) has no `bg-card-dark` gap when regular row is taller; `320px` narrow featured with 2-3 line title + `line-clamp-2` desc shows date badge clear of overlay
- [x] 2.3 Run `openspec validate --change fix-post-card-cover-overlap --strict` with no errors
