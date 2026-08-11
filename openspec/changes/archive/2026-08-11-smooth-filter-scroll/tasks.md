## 1. Smooth wheel scrolling in FilterRow

- [x] 1.1 Add `import { gsap } from "gsap"` to `src/components/molecules/Filters.tsx` (direct package import, not `@/lib/gsap` — that module is not SSR-safe for this React island)
- [x] 1.2 Replace the wheel effect in `FilterRow` (`Filters.tsx` lines importing `el.scrollLeft = clamped`) with a target-accumulating ticker loop: read `prefers-reduced-motion` once, accumulate wheel/trackpad delta into a clamped target, run `gsap.utils.interpolate(el.scrollLeft, target, 0.18)` on the `gsap.ticker` until it settles within `0.5px`, then self-remove from the ticker
- [x] 1.3 Direct-assignment path when reduced motion is active: write `scrollLeft` immediately, never register the ticker, and keep the non-overflow guard (`scrollWidth <= clientWidth`) so fitting rows do not intercept wheel input
- [x] 1.4 Keep the existing drag-to-scroll pointer effect and edge-fade `scroll`/`resize` listeners untouched

## 2. Lifecycle safety

- [x] 2.1 Clean up in the wheel effect's return function: remove the `wheel` listener and remove the ticker callback, so no listener or ticker callback survives unmount

## 3. Verification

- [x] 3.1 Run the project build (`pnpm build`) to confirm the island compiles and SSR is unaffected by the `gsap` import
- [x] 3.2 Manually verify on the "Colección completa" section: wheel/trackpad now glides smoothly, drag still tracks the cursor directly, edge fades update, page scroll resumes at row boundaries, reduced-motion mode scrolls directly, and the chips/UI are visually unchanged