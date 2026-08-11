## Context

Each "Colección completa" filter row (`FilterRow` in `src/components/molecules/Filters.tsx`) renders its chips in a `flex` container with `overflow-x-auto` and hidden scrollbars, plus paper-gradient edge fades computed from the scroll position. Wheel input currently assigns `el.scrollLeft = clamped` on every `wheel` event, producing harsh, discrete jumps. The project already depends on GSAP (`gsap@^3.12.7` installed, `3.15.0` in the lockfile) and uses it as the standard animation layer; but its shared module `src/lib/gsap.ts` touches `window`/`document` at module top and is only safe for Astro `<script>` blocks, not for an SSR'd React island, so the smoothing imports `gsap` core directly.

The drag-to-scroll pointer handler (`Filters.tsx:76-133`) is intentionally direct manipulation and stays untouched.

## Goals / Non-Goals

**Goals:**
- Smooth (eased) horizontal scroll for wheel and trackpad input on overflowing filter rows.
- Identical visible UI: hidden scrollbar, chip row, edge fades — no visual or layout changes.
- Reduced-motion users scroll directly, with no animation loop.
- No new dependencies, no new files, no changes to the store or to drag behavior.

**Non-Goals:**
- Momentum/inertia after a drag release or wheel flick (out of scope; input delta accumulates and its own inertia emerges from the lerp).
- Programmatic/button-controlled scrolling (no ScrollToPlugin; nothing programmatically scrolls the rows).
- Changing the drag gesture, chip styling, focus behavior, or the scrollbar hiding CSS.
- A GSAP shared-module refactor to make `@/lib/gsap.ts` island-safe.

## Decisions

### D1. GSAP `ticker` lerp instead of direct scroll assignment
Replace the wheel handler's direct `scrollLeft` write with an accumulating target + a `gsap.ticker` frame loop. Each tick eases the row toward the target with `gsap.utils.interpolate(current, target, 0.18)`; when the distance is below `0.5px` the row snaps to the target and the ticker callback removes itself.

- **Why:** Wheel deltas are per-event and discrete (a clicky wheel sends ~100px), which is exactly the harshness reported. Lerping between a target and the current position produces the classic smooth "glide" feel, handles both wheel and trackpad input uniformly, and the exponential easing curve (`0.18` per 60fps frame settles a large jump in ~0.8s) reads as an ease rather than inertia.
- **Alternatives considered:**
  - Native `scroll-behavior: smooth` / CSS `scroll-snap` — only affects programmatic scrolls, not wheel input; does not address the reported issue.
  - `gsap.to(el, { scrollLeft })` per wheel event — restarting a tween on every event causes laggy, conflict-ridden scrolling; the persistent loop retargets cleanly.
  - ScrollToPlugin — for programmatic navigation, not continuous input; unnecessary weight.
  - Custom `requestAnimationFrame` loop — equivalent to the ticker but reimplements a sync loop GSAP already provides (and the user asked for GSAP).
- **Tuning:** `0.18` is the starting interpolation factor; it lives in one constant for easy adjustment.

### D2. Import `gsap` direct from the package, not from `@/lib/gsap`
The wheel effect imports `{ gsap } from "gsap"` (core only, no plugin registration). The shared `@/lib/gsap.ts` is not imported in this island.

- **Why:** `Filters.tsx` is a React island (`client:load`) that also server-renders. `@/lib/gsap.ts` calls `ScrollTrigger.config`, `window.addEventListener`, and `document.addEventListener` at module top — the last two would throw during SSR. GSAP core is SSR-safe.
- **Alternatives considered:**
  - Guarding the shared module's top-level calls — a refactor touching every GSAP consumer for one island; rejected as broader than the change needs.
  - Using `dynamically imported` island — unnecessary; core `gsap` is already safe.

### D3. Reduced-motion via media query check, not `gsap.matchMedia`
The wheel effect reads `window.matchMedia("(prefers-reduced-motion: reduce)").matches` once on mount. When true, wheel input writes `scrollLeft` directly and never starts the ticker.

- **Why:** Simpler than `gsap.matchMedia`'s add/revert lifecycle for a single always-on flag, and identical behavior for this use case.
- **Alternative considered:** `gsap.matchMedia()` conditional handler — heavier API for a stateless boolean; skipped.

### D4. Keep the drag gesture as direct manipulation
The existing pointer drag handler stays exactly as-is.

- **Why:** Direct manipulation feels right: a drag should track the cursor 1:1; smoothing or inertia would fight the user. Only wheel/trackpad gliding is addressed by this change.

## Risks / Trade-offs

- **[Smoothness factor feels wrong on first impression]** → The interpolation constant is isolated and documented; tune `0.15–0.25` for feel.
- **[Wheel trap at row boundaries]** → Existing guard (`scrollWidth <= clientWidth` returns early; target clamped to `0..max`) is preserved, so non-overflowing rows never intercept the wheel and the page scrolls normally, matching the existing spec behavior.
- **[Ticker leak if unmount races the loop]** → The effect cleanup removes both the wheel listener and the ticker callback; ticker callbacks only exist while active, so cleanup always succeeds.
- **[SSR import accident]** → Decision D2 is called out: the change must import from `"gsap"`, never `"@/lib/gsap"`.

## Migration Plan

Single-component change, no data or API migration. Rollback is reverting the one effect; the direct-assignment code path remains documented in git history.

## Open Questions

None.