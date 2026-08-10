## 1. Update CardInfo Subtitle Legibility

- [x] 1.1 Update `CardInfo.astro` subtitle paragraph styling to `font-bold text-crimson tracking-[0.2em] mb-2.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]`.

## 2. Update CardInfo Title Vertical Line Hover Effect

- [x] 2.1 Wrap `<h2>` title in `CardInfo.astro` with vertical line accent bar `<span class="absolute left-0 top-0 bottom-0 w-[3px] bg-crimson rounded-full opacity-0 -translate-x-2 scale-y-75 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-y-100 transition-all duration-300 ease-out" />` and title padding transition (`group-hover:pl-3.5`).

## 3. Verification

- [x] 3.1 Verify build completes with `npx astro build` and test vertical line hover effect in `/design-system` showcase.
