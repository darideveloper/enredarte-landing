# 01 · Setup & Mandatory Files

Everything you need to bootstrap the animation system in a **fresh Astro project**.

---

## 1. Install the dependency

The system is built on **GSAP 3** (including the optional **ScrollTrigger** plugin,
which ships inside the `gsap` package — no extra dependency).

```bash
npm install gsap
```

If you also want the Swiper-powered horizontal scroller shown in one of the examples:

```bash
npm install swiper
```

Versions used in the reference implementation: `gsap@^3.14.2`, `swiper@^12.1.3`, `astro@^5`.

---

## 2. Project structure

These are the **only** files the animation system needs. Create them exactly as-is,
then wire them up (step 3):

```
src/
├── scripts/
│   ├── gsap-init.ts            # global config + plugin registration (MANDATORY)
│   ├── animation-manager.ts    # loader/entrance orchestrator (optional, for loader)
│   ├── kinetic-marquee.ts      # reusable infinite marquee factory (optional)
│   ├── animate-counters.ts     # stat counter helper (optional, guide-provided)
│   └── reveal-helper.ts        # DRY section-reveal helper (optional, guide-provided)
├── layouts/
│   └── Layout.astro            # your layout — import gsap-init in <head>
└── styles/
    └── global.css              # your global CSS — add the fallback utilities
```

- `gsap-init.ts` is the only **strictly mandatory** file.
- `animation-manager.ts` is required only if you use the preloader pattern
  ([02-loader-and-entrance-orchestration.md](./02-loader-and-entrance-orchestration.md)).
- `kinetic-marquee.ts` is required only for the kinetic marquee
  ([04-scroll-effects-marquee-and-counters.md](./04-scroll-effects-marquee-and-counters.md)).
- `animate-counters.ts` and `reveal-helper.ts` are optional convenience helpers
  **provided by this guide** (not part of the reference implementation). Create
  them only if you want the DRY shortcuts in sections
  [03](./03-section-reveal-pattern.md) and [04](./04-scroll-effects-marquee-and-counters.md).

> **Note:** the reference implementation uses `newsletter-marquee.ts` as the
> filename. This guide ships the generic `kinetic-marquee.ts`; both names map
> to the same code.

> **Directory convention:** these are pure browser-runtime modules (no server-side
> usage), so they live in their own `src/scripts/` instead of `src/lib/` (API/fetch
> utilities, see [[astro-fetch-wrapper]]) or `src/store/` (state, see
> [[astro-zustand-zod]]). All imports use the `@/scripts/...` alias from the shared
> `tsconfig.json` (`@/*` → `./src/*`, see [[astro-react-islands]]).

---

## 3. Wiring it into your layout

Astro bundles a non-`is:inline` `<script>` in the layout at build time. Import the
config **once** — it runs before/independent of any component script:

```astro
---
import "@/styles/global.css"
// import your own SEO, fonts, metadata here
---
<!doctype html>
<html lang="en" class="no-js">
  <head>
    <!-- your <title>, <meta>, link tags -->

    <!-- SEO slot — pages inject <PageSEO slot="seo" /> here (see astro-seo) -->
    <slot name="seo" />

    <!-- swap no-js → js as early as possible -->
    <script is:inline>
      document.documentElement.classList.remove("no-js")
      document.documentElement.classList.add("js")
    </script>

    <!-- GSAP global config — processed & bundled by Astro -->
    <script>
      import "@/scripts/gsap-init"
    </script>
  </head>
  <body>
    <!-- <Loader /> only if using the preloader pattern (02) -->
    <slot />
  </body>
</html>
```

**Why the `no-js`/`js` class swap matters:** your CSS uses it to decide whether
`.js-reveal` elements stay hidden (JS available → hidden until animated) or visible
(no JS → static content). See [05-accessibility-and-pitfalls.md](./05-accessibility-and-pitfalls.md#no-js-fallback).

> **Important:** do **not** add `is:inline` to the `gsap-init` import. Astro must
> bundle it so the `gsap` import resolves. `is:inline` is only correct for the tiny
> class-swap script above.

---

## 4. Mandatory file 1 — `src/scripts/gsap-init.ts`

Sets global defaults so every component gets consistent easing/duration, registers
ScrollTrigger, and applies performance tweaks. **Copy verbatim:**

```ts
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register Plugins
gsap.registerPlugin(ScrollTrigger)

// Configure ScrollTrigger Performance
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true
})

// Set Global Defaults
gsap.defaults({
  ease: "power4.out",
  duration: 1.2
})

// Configure Performance Defaults
gsap.config({
  force3D: true
})

// Re-measure triggers once images, fonts, and lazy content settle
window.addEventListener("load", () => ScrollTrigger.refresh())
```

### What each line does

| Setting | Effect |
| :--- | :--- |
| `gsap.registerPlugin(ScrollTrigger)` | Makes `scrollTrigger: {...}` work in any tween/timeline without per-file registration |
| `ScrollTrigger.config({ limitCallbacks: true })` | Fire callbacks only when scrolling stops near the threshold — reduces work during fast scrolls |
| `ScrollTrigger.config({ ignoreMobileResize: true })` | Don't refresh on mobile browser-chrome (URL bar) resize jumps |
| `gsap.defaults({ ease: "power4.out", duration: 1.2 })` | Every tween inherits this unless it overrides `ease`/`duration` |
| `gsap.config({ force3D: true })` | Forces `transform: translate3d(...)` for GPU-composited motion |
| `window.addEventListener("load", () => ScrollTrigger.refresh())` | Re-measures all trigger positions once images/fonts/lazy content settle — prevents reveals firing at wrong scroll offsets |

> **Tip:** components may still call `gsap.registerPlugin(ScrollTrigger)` locally
> (the reference implementation does it in several files). It's harmless and idempotent, but
> it's not required once `gsap-init.ts` runs first.

---

## 5. Mandatory file 2 — `src/scripts/animation-manager.ts` (for the loader)

A singleton that **gates entrance animations behind the preloader**. Any entrance
registered before the loader finishes is queued and played automatically when the
loader dispatches its `loader:complete` event. Also respects `prefers-reduced-motion`
(plays at the end state instead of animating).

```ts
import { gsap } from "gsap"

class AnimationManager {
  private isLoaderComplete: boolean = false
  private queue: (gsap.core.Timeline | gsap.core.Tween)[] = []

  constructor() {
    if (typeof window === "undefined") return

    // Initial check: if there is no loader, we are effectively "complete"
    const loader = document.getElementById("loader")
    if (!loader || loader.style.display === "none") {
      this.isLoaderComplete = true
    }

    // Listen for the loader:complete event
    document.addEventListener("loader:complete", () => {
      this.isLoaderComplete = true
      this.processQueue()
    })

    // Handle View Transitions if enabled
    document.addEventListener("astro:after-swap", () => {
      this.resetState()
    })
  }

  private resetState() {
    const loader = document.getElementById("loader")
    this.isLoaderComplete = !loader || loader.style.display === "none"
    this.queue = []
  }

  private processQueue() {
    this.queue.forEach(item => this.playEntrance(item))
    this.queue = []
  }

  private playEntrance(item: gsap.core.Timeline | gsap.core.Tween) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      // For reduced motion, skip movement and just show content
      if ("progress" in item) {
        item.progress(1)
      } else {
        item.play()
      }
    } else {
      item.play()
    }
  }

  /**
   * Registers an entrance animation (timeline or tween).
   * It will play automatically when the loader finishes.
   */
  public registerEntrance(item: gsap.core.Timeline | gsap.core.Tween) {
    if (this.isLoaderComplete) {
      this.playEntrance(item)
    } else {
      this.queue.push(item)
    }
  }
}

// Export as a singleton
export const animationManager = new AnimationManager()
```

**How to use it from any component:**

```ts
import { animationManager } from "@/scripts/animation-manager"

const tl = gsap.timeline({ paused: true })
// ...build tweens...
animationManager.registerEntrance(tl)
```

The timeline must be created **paused**; the manager plays it (or fast-forwards it
to the end for reduced-motion users) when the loader is done.

> The `astro:after-swap` listener only matters if you enable Astro View Transitions
> (`<ClientRouter />`). If you don't use them, it's inert — you can delete it.

---

## 6. Mandatory file 3 — `src/scripts/kinetic-marquee.ts` (for marquees)

A factory that turns a horizontal strip of content into a seamless infinite marquee.
It duplicates its children, then loops a `x` translation with a modulo modifier.

```ts
import { gsap } from "gsap"

export const initKineticMarquee = (container: HTMLElement) => {
  const wordsContainer = container.querySelector(".js-marquee-content") as HTMLElement
  if (!wordsContainer) return

  const ctx = gsap.context(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    // Duplicate content for seamless loop
    const children = Array.from(wordsContainer.children)
    children.forEach((child) => {
      wordsContainer.appendChild(child.cloneNode(true))
    })

    const totalWidth = wordsContainer.scrollWidth / 2

    gsap.to(wordsContainer, {
      x: -totalWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => `${parseFloat(x) % totalWidth}px`,
      },
    })
  }, container)

  return () => ctx.revert()
}
```

Notes:
- `initKineticMarquee(container)` expects an element that contains a
  `.js-marquee-content` child with the repeated content.
- It returns a **cleanup function** (`ctx.revert()`) — call it on unmount for View
  Transitions or component lifecycles.
- `gsap.context(() => {...}, container)` scopes all created animations to the
  container so `revert()` kills exactly this marquee.
- Reduced-motion users get a static row (function returns early).

---

## 7. CSS fallbacks (add to `src/styles/global.css`)

These two rules are the **no-JS progressive enhancement** and the **initial hidden
state** for animated elements. In Tailwind v4 use `@utility`; in plain CSS use a
normal class.

**Tailwind v4 (this project):**

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

**Plain CSS equivalent:**

```css
.js-reveal {
  opacity: 0;
  visibility: hidden;
}

.no-js .js-reveal {
  opacity: 1 !important;
  visibility: visible !important;
}
```

### What it does

- With JS: any element carrying `.js-reveal` starts hidden. GSAP reveals it.
- Without JS: `html.no-js` is still set (the swap script never ran), so the override
  forces the content visible — the page is fully readable with zero JS.

> `visibility: hidden` prevents layout-shift flash and keeps elements from being
> tab-focusable while hidden. GSAP's `autoAlpha` toggles the same two properties.

---

## 8. Verify your setup

1. `npm run dev`, open the page.
2. In DevTools run `gsap` in the console — it should be a defined object.
3. Check `ScrollTrigger` is registered: `gsap.utils.toArray(".js-reveal")` should
   return your hidden elements.
4. Scroll — sections that use the reveal pattern should animate in.

### Bonus: why the auto-refresh is baked in

Images, custom fonts, or lazy-loaded content shift the layout after ScrollTrigger
has measured positions, so reveals fire at wrong offsets. The `load` listener
above is **already part of `gsap-init.ts`** — no extra wiring needed:

```ts
window.addEventListener("load", () => ScrollTrigger.refresh())
```

If your site loads late content in a custom way (e.g. after an API call), call
`ScrollTrigger.refresh()` again at that point.

Ready for the patterns. Next: [02-loader-and-entrance-orchestration.md](./02-loader-and-entrance-orchestration.md).
