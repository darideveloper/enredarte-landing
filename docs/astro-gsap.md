---
created: 2026-08-09
updated: 2026-08-09
tags:
  - astro
  - animation
  - gsap
  - react
  - documentation
type: resource
status: active
---

# GSAP Animation Architecture & Integration

Comprehensive guide for integrating and configuring GreenSock Animation Platform (GSAP) across Astro components (`.astro`) and React 19 Islands (`.tsx`).

## Core Architecture

GSAP animations run exclusively on the client side. To prevent Node.js build-time reference errors during Astro's static site generation (SSG) / server-side rendering (SSR), all GSAP plugins are registered inside a guarded module entrypoint at `src/lib/gsap.ts`.

```
                       ┌─────────────────────────┐
                       │    src/lib/gsap.ts      │
                       │  (Central Module Entry) │
                       └────────────┬────────────┘
                                    │
               ┌────────────────────┴────────────────────┐
               ▼                                         ▼
   ┌───────────────────────┐                 ┌───────────────────────┐
   │    Astro Components   │                 │     React Islands     │
   │      (`.astro`)       │                 │      (`.tsx`)         │
   │  <script> ES module   │                 │   @gsap/react Hook    │
   └───────────────────────┘                 └───────────────────────┘
```

## Installation & Setup

```bash
# Core GSAP library and React integration hook
npm install gsap @gsap/react
```

## Centralized GSAP Entrypoint (`src/lib/gsap.ts`)

Instead of calling `gsap.registerPlugin(...)` in individual files, import pre-registered instances directly from `src/lib/gsap.ts`:

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register plugins safely on the client side (SSR-safe)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

export { gsap, ScrollTrigger, TextPlugin };
```

## Usage Patterns

### 1. Astro Component Client Scripts (`.astro`)

Astro processes `<script>` tags as client-side ES modules. Import GSAP directly inside the component script tag:

```astro
---
// Component Frontmatter
---

<div class="artwork-card">
  <h2>Featured Artwork</h2>
</div>

<script>
  import { gsap, ScrollTrigger } from "../../lib/gsap";

  gsap.from(".artwork-card", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".artwork-card",
      start: "top 85%",
    },
  });
</script>
```

#### Astro View Transitions
If View Transitions are enabled, wrap animation triggers inside the `astro:page-load` lifecycle event listener to ensure animations re-initialize when navigating between pages:

```html
<script>
  import { gsap } from "../../lib/gsap";

  document.addEventListener("astro:page-load", () => {
    gsap.from(".hero-title", { opacity: 0, y: 20, duration: 1 });
  });
</script>
```

---

### 2. React 19 Islands (`.tsx`)

For React Island components (`client:load`, `client:visible`), use the official `@gsap/react` `useGSAP` hook. It automatically handles component unmount cleanup (`ctx.revert()`) to prevent memory leaks.

```tsx
import { useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useGSAP } from "@gsap/react";

export function AnimatedGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".gallery-item", {
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} class="gallery-grid">
      <div class="gallery-item">Item 1</div>
      <div class="gallery-item">Item 2</div>
    </div>
  );
}
```

---

## Best Practices

| Category | Guideline |
|---|---|
| **Performance** | Animate transform properties (`x`, `y`, `scale`, `rotation`) and `opacity` for 60fps GPU acceleration. Avoid animating `top`, `left`, `width`, or `margin`. |
| **Memory Cleanup** | Always scope React animations inside `useGSAP({ scope: ref })` so tweens and ScrollTriggers automatically clean up on component unmount. |
| **SSR Safety** | Do not invoke GSAP directly in Astro component frontmatter (between `---` fences). Frontmatter executes during Node SSG build time where `window` is undefined. |

---

## Connection to Other Patterns

- Client-side React component hydration rules → see [[astro-react-islands]]
- Atomic design component structure → see [[astro-atomic-components]]
- Living dependency mapping → see [[component-dependencies]]
