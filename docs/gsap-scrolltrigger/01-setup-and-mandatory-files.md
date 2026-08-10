# 01 · Setup & Mandatory Files

> **Prerequisite:** The installed `.agents/skills/gsap-*` skills (pinned by `skills-lock.json`) are the canonical source of truth for GSAP API knowledge. This guide uses `→ gsap-<skill> skill §<section>` pointers — load the referenced skill before working on the corresponding topic. See the [Skill map in the README](./README.md) for which skills each section depends on.

Everything you need to bootstrap the animation system in an **Astro project**.

---

## 1. Install the dependency

The system is built on **GSAP 3** (including the optional **ScrollTrigger** plugin,
which ships inside the `gsap` package — no extra dependency).

```bash
npm install gsap
```

If you also want the Swiper-powered horizontal scroller:

```bash
npm install swiper
```

Versions used: `gsap@^3.12.7`, `swiper@^12.1.3`, `astro@^7`.

---

## 2. Shared module — `src/lib/gsap.ts`

The single file every component imports from. It registers plugins **SSR-safe**
(guarded with `typeof window !== "undefined"`), configures `ScrollTrigger` global
options, sets tween defaults, and wires a `load`-event `ScrollTrigger.refresh()`.

**Create `src/lib/gsap.ts`. Copy verbatim:**

```ts
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// SSR-safe plugin registration
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ScrollTrigger performance tuning
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
})

// Global tween defaults
gsap.defaults({
  ease: "power4.out",
  duration: 1.2,
})

// Re-measure triggers when images, fonts, and lazy content settle
window.addEventListener("load", () => ScrollTrigger.refresh())

export { gsap, ScrollTrigger }
```

### What each line does

> For the general GSAP API behind these settings, load:
> `→ gsap-core skill` for `registerPlugin` / `gsap.defaults` / `ease`,
> `→ gsap-scrolltrigger skill` for `ScrollTrigger.config` and `refresh()`.

| Setting | Effect |
| :--- | :--- |
| `typeof window !== "undefined"` guard | Prevents `registerPlugin` from running during Astro's server-side render — GSAP is browser-only |
| `ScrollTrigger.config({ limitCallbacks: true })` | Fire callbacks only near the threshold — reduces work during fast scrolls |
| `ScrollTrigger.config({ ignoreMobileResize: true })` | Skip refresh on mobile URL bar show/hide |
| `gsap.defaults({ ease, duration })` | Every tween inherits these unless it overrides `ease`/`duration` |
| `window.addEventListener("load", ...)` | Re-measures trigger positions after images/fonts/lazy content settle |

> **Per-section `registerPlugin` calls are harmless** and can be kept or removed — the shared module's registration is sufficient.

---

## 3. Wiring it into your components

Import `@/lib/gsap` in each component's `<script>` block — **not** in the Layout's
`<head>`. Astro bundles the import into a shared chunk that every page caches, and
tree-shakes subpath imports (`gsap/ScrollTrigger`). Never use `is:inline` for GSAP.

```astro
---
// MyComponent.astro
---
<section class="js-my-section">
  <!-- markup -->
</section>

<script>
  import { gsap, ScrollTrigger } from "@/lib/gsap"

  const initAnimations = () => {
    // animations here
  }

  document.addEventListener("astro:page-load", initAnimations)
</script>
```

### Why `astro:page-load`?

`astro:page-load` fires on initial page load and after every View Transition
navigation. Use it as the single entry point — never call `init()` directly
alongside the listener, or the animation initializes twice.

### For projects with View Transitions

When you enable `<ClientRouter />`, add cleanup so stale tweens and ScrollTriggers
don't leak across navigations. `→ gsap-frameworks skill §ScrollTrigger Cleanup`
and `→ gsap-core skill §gsap.context()`:

```ts
let ctx: ReturnType<typeof gsap.context>

const init = () => {
  ctx?.revert()
  ctx = gsap.context(() => {
    // tweens and ScrollTriggers go here
  }, section)
}

document.addEventListener("astro:page-load", init)
document.addEventListener("astro:after-swap", () => ctx?.revert())
```

> **Two cleanup approaches, pick per component.** This `gsap.context()` snippet is
> the minimal VT cleanup for simple tweens. The **canonical pattern in this guide** is
> §5 below: `gsap.context()` internally (via `gsap.matchMedia()`) plus an explicit
> `mm?.revert()` on `astro:after-swap`, a section-presence guard, and a first-paint
> `init()` call. Use the §5 pattern for anything that uses `gsap.matchMedia()` (the
> recommended structure for reduced-motion support); the bare `gsap.context()`
> snippet here is only for tiny components with no `matchMedia` branches. Never nest
> `gsap.context()` inside `gsap.matchMedia()` — matchMedia creates a context
> internally; use `mm.revert()` only (see §5).

### Bundling & performance notes

- Astro processes `<script>` blocks (no attributes) as bundled modules. Shared
  dependencies like `gsap` go into a single cacheable chunk; each page only loads
  the chunk once the browser caches it.
- `gsap/ScrollTrigger` is tree-shaken per page — only pages whose components import
  it pay the cost.
- `<script>` modules are automatically deferred (non-render-blocking) — they don't
  delay First Contentful Paint.

---

## 4. SEO-safe reveal strategies

Two equivalent approaches. Both are indexable by crawlers and degrade gracefully
without JS. Pick whichever fits your project.

### A. `fromTo` + `clearProps` (used by `enredarte-landing`)

No CSS pre-hiding. Content is visible by default. GSAP's `immediateRender` applies
the hidden from-state only when JS runs; `clearProps` restores the natural CSS
state after completion. Crawlers see the raw HTML text; no-JS users see everything.

```ts
import { gsap, ScrollTrigger } from "@/lib/gsap"

document.addEventListener("astro:page-load", () => {
  gsap.fromTo(".my-el",
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power2.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: ".my-section",
        start: "top 85%",
      },
    }
  )
})
```

### B. CSS `js-reveal` fallback (progressive enhancement)

Elements start hidden via a CSS class; the `.no-js` override on `<html>` makes
them visible if JS never runs.

**CSS** (add to `src/styles/global.css`):

```css
@utility js-reveal {
  opacity: 0;
  visibility: hidden;
}

.no-js .js-reveal {
  opacity: 1 !important;
  visibility: visible !important;
}
```

**Layout markup**:

```astro
<html lang="en" class="no-js">
  <head>
    <script is:inline>
      document.documentElement.classList.remove("no-js")
      document.documentElement.classList.add("js")
    </script>
  </head>
</html>
```

With this approach, unhide elements in JS before building `.from()` tweens so
GSAP can measure their natural positions:

```ts
gsap.set(section.querySelectorAll(".js-my-reveal"), { autoAlpha: 1 })
// ...then build .from() tweens
```

> Never hide elements with Tailwind's `opacity-0` alone — the `.no-js` override
> only targets `.js-reveal`. See [05-accessibility-and-pitfalls.md](./05-accessibility-and-pitfalls.md#no-js-fallback).

---

## 5. View Transitions + GSAP (Client Router)

> Cross-reference: `docs/astro-client-side-page-transitions.md` §5.4 for the Client Router side of this pattern.

When `<ClientRouter />` is enabled, GSAP components need a lifecycle that handles
VT navigations correctly: cleanup stale triggers from the previous page, re-init
on the new page, and prevent the VT cross-fade from competing with GSAP fromTo
reveals.

### The triple-entry + guard pattern

> `→ gsap-core skill`: "Do not nest `gsap.context()` inside matchMedia — matchMedia
> creates a context internally; use `mm.revert()` only."

```js
import { gsap, ScrollTrigger } from "@/lib/gsap"

let mm

const init = () => {
  // Guard: bail if this component isn't on the current page
  if (!document.querySelector(".js-my-section")) return

  // Kill stale tweens/triggers from the previous page
  mm?.revert()
  mm = gsap.matchMedia()

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // fromTo + ScrollTrigger tweens here
  })
  mm.add("(prefers-reduced-motion: reduce)", () => {
    // fade-only or no-op fallback
  })
}

// Cleanup early — kills old triggers before the new page's init runs
document.addEventListener("astro:after-swap", () => mm?.revert())
// Re-init after every client-side navigation
document.addEventListener("astro:page-load", init)
// First paint — works even without ClientRouter
init()
```

### `transition:animate="none"` on animated sections

Add `transition:animate="none"` to every section root that has GSAP fromTo
entrances. Without it, the VT cross-fade shows the new page at natural state
before GSAP's `immediateRender` hides content and animates it — a visible flash.

```astro
<section class="js-hero-section" transition:animate="none">
<div id="salas-gallery" transition:animate="none">
```

### ScrollTrigger refresh on navigation

After a VT navigation, the new page's images and fonts load asynchronously and
shift layout. `window.load` only fires once; add `astro:page-load` refresh to
`src/lib/gsap.ts`:

```ts
document.addEventListener("astro:page-load", () => ScrollTrigger.refresh())
```

### Hero entrance guard

Above-fold entrances replay on every VT navigation back to the home page.
Guard with `sessionStorage` so the animation plays only once per session:

```js
if (sessionStorage.getItem("hero-entered")) {
  // jump to final visible state, no animation
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set(".hero-banner, ...", { clearProps: "transform,opacity" })
  })
  return
}
sessionStorage.setItem("hero-entered", "1")
// full entrance timeline
```

---

## 6. Optional helpers

These are provided by the guide as convenience code. Create them only if your
project needs them.

### `animation-manager.ts` (for the preloader → [02](./02-loader-and-entrance-orchestration.md))

A singleton that gates hero entrances behind a GSAP preloader. If no loader is
present, entrances play immediately. Copy from [02-loader-and-entrance-orchestration.md](./02-loader-and-entrance-orchestration.md).

### `kinetic-marquee.ts` (for infinite marquees → [04](./04-scroll-effects-marquee-and-counters.md))

A factory that turns a horizontal content strip into a seamless looping marquee.
Copy from [04-scroll-effects-marquee-and-counters.md](./04-scroll-effects-marquee-and-counters.md).

### `animate-counters.ts` + `reveal-helper.ts`

Convenience shortcuts for stat counters and DRY section reveals.
Copy from [04](./04-scroll-effects-marquee-and-counters.md#3-animated-stat-counters)
and [03](./03-section-reveal-pattern.md#reducing-the-copy-paste).

---

## 7. Verify your setup

1. `pnpm run dev`, open the page.
2. In DevTools, import at the console: `const { gsap, ScrollTrigger } = await import("./node_modules/gsap/index.js")` → `ScrollTrigger` should be defined.
3. Scroll — sections using the reveal pattern should animate in.
4. DevTools → "Disable JavaScript" → all content should still be visible (approach A) or the `.no-js` override reveals `.js-reveal` elements (approach B).

Ready for the patterns. Next: [02-loader-and-entrance-orchestration.md](./02-loader-and-entrance-orchestration.md).
