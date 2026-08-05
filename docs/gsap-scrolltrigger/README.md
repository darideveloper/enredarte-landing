# GSAP + ScrollTrigger Animation System (Reusable Astro Guide)

A complete, copy-paste-ready guide for adding **GSAP + ScrollTrigger** animations to
**any Astro project**, based on a production reference implementation.

The system is framework-agnostic (works with Astro's `.astro` files, React/Preact
islands, vanilla JS — anywhere GSAP runs). Everything here is plain TypeScript +
Astro `<script>` blocks, so it ports to any Astro project with zero React required.

---

## What you get

Three reusable, independent animation capabilities:

| Capability | What it does | Where to read |
| :--- | :--- | :--- |
| **Loader-gated entrance** | A branded preloader that coordinates the page's hero/content entrance so it never plays behind the loader | [02-loader-and-entrance-orchestration.md](./02-loader-and-entrance-orchestration.md) |
| **Scroll-triggered section reveals** | The workhorse pattern: sections fade/slide their content in as they enter the viewport, with automatic `prefers-reduced-motion` fallback | [03-section-reveal-pattern.md](./03-section-reveal-pattern.md) |
| **Scroll effects + kinetic marquee + counters** | Parallax, scrubbed scroll fades, infinite background marquees, animated stat counters | [04-scroll-effects-marquee-and-counters.md](./04-scroll-effects-marquee-and-counters.md) |

Plus the two things every project needs so these degrade gracefully:

- **Accessibility & CSS fallbacks** (reduced-motion + no-JS progressive enhancement): [05-accessibility-and-pitfalls.md](./05-accessibility-and-pitfalls.md)

---

## Architecture at a glance

The system is built in three layers, each fully optional:

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3 · Per-component <script> blocks                    │
│  (Loader, Hero, every section)                              │
│  ─ each self-contained: imports gsap + ScrollTrigger,       │
│    scopes selectors to its own section, builds tweens       │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2 · Global runtime scripts  (src/scripts/)           │
│  ─ gsap-init.ts        : global config + plugin registration│
│  ─ animation-manager.ts: loader/entrance orchestrator       │
│  ─ kinetic-marquee.ts  : reusable infinite marquee factory  │
├─────────────────────────────────────────────────────────────┤
│  LAYER 1 · CSS fallbacks (global.css)                       │
│  ─ .js-reveal utility: hide before JS runs                  │
│  ─ .no-js .js-reveal  : show for no-JS users                │
└─────────────────────────────────────────────────────────────┘
```

Key rules that keep it maintainable:

1. **Each component scopes its selectors** to its own root element (`.js-my-section`)
   so tweens never leak across the page.
2. **`prefers-reduced-motion` is handled in two places:** the orchestrator jumps
   hero entrances straight to their end state; every section registers a
   fade-only fallback via `gsap.matchMedia()`.
3. **The "unhide then `.from()`" trick** is load-bearing: `gsap.set(el, { autoAlpha: 1 })`
   *before* a `.from()` tween, otherwise GSAP can't measure the element's natural
   position and the animation looks wrong.

> **Where animations live:** this system runs entirely in plain Astro `<script>`
> blocks and vanilla TS — it does **not** use React islands. Scroll animation is
> page-level behavior, not a self-contained interactive widget. If a component needs
> *both* GSAP motion and React interactivity (state, form fields), keep the GSAP
> logic in the Astro component's `<script>` block and mount the React island inside
> it — islands hydrate independently (see [[astro-react-islands]]).

---

## Quick start (TL;DR)

1. Install the dependency:
   ```bash
   npm install gsap
   ```

2. Copy the required files from [01-setup-and-mandatory-files.md](./01-setup-and-mandatory-files.md):
   - `src/scripts/gsap-init.ts` **(always required)**
   - `src/scripts/animation-manager.ts` (only if using the preloader)
   - `src/scripts/kinetic-marquee.ts` (only if using infinite marquees)

3. Import `gsap-init` once in your layout's `<head>`:
   ```astro
   <script>
     import "@/scripts/gsap-init"
   </script>
   ```

4. Add the CSS fallback utilities to your global CSS (see
   [01-setup-and-mandatory-files.md](./01-setup-and-mandatory-files.md#css-fallbacks)).

5. Pick a pattern and paste it into your components:
   - [02-loader-and-entrance-orchestration.md](./02-loader-and-entrance-orchestration.md) — preloader + gated hero entrance
   - [03-section-reveal-pattern.md](./03-section-reveal-pattern.md) — scroll reveals
   - [04-scroll-effects-marquee-and-counters.md](./04-scroll-effects-marquee-and-counters.md) — parallax, marquee, counters

---

## File map

| File in this repo | Purpose in the docs |
| :--- | :--- |
| `docs/gsap-scrolltrigger/README.md` | This index + architecture + quick start |
| `docs/gsap-scrolltrigger/01-setup-and-mandatory-files.md` | Install, config, the 3 core scripts, CSS fallbacks |
| `docs/gsap-scrolltrigger/02-loader-and-entrance-orchestration.md` | Preloader + `animation-manager` + hero entrance |
| `docs/gsap-scrolltrigger/03-section-reveal-pattern.md` | The reusable section template + 6 real variations |
| `docs/gsap-scrolltrigger/04-scroll-effects-marquee-and-counters.md` | Parallax, scrubbed fades, kinetic marquee, stat counters |
| `docs/gsap-scrolltrigger/05-accessibility-and-pitfalls.md` | Reduced motion, no-JS, troubleshooting checklist |
| `docs/gsap-scrolltrigger/06-optional-swiper-scroller.md` | Appendix: Swiper horizontal scroller (optional companion) |

---

## What this guide does NOT cover

- **Swiper horizontal scroller** — see the optional [06-optional-swiper-scroller.md](./06-optional-swiper-scroller.md) appendix.
- **GSAP SplitText, ScrollSmoother, Flip, Draggable** — outside scope; they follow the same per-component pattern.
- **View Transitions / SPA routing integration** — the `animation-manager` has a hook for it (see 01), but full MPA→SPA migration is its own topic.
- **CSS-only animations** — this guide is for GSAP timelines and ScrollTrigger specifically.

---

## When NOT to use this

- **SSG content that must be visible without JS:** the `.no-js` CSS fallback covers
  static visibility, but animated entrance effects obviously need JS. If your site
  targets no-JS users heavily, keep reveals subtle or skip the loader.
- **Pure CSS needs:** a simple `transition` on hover/scroll is cheaper than GSAP.
  Reach for GSAP when you need sequencing (timelines), scroll scrubbing, staggering
  across many elements, or integration with a loader.

Continue to [01-setup-and-mandatory-files.md](./01-setup-and-mandatory-files.md).
