## Why

Adding GreenSock Animation Platform (GSAP) to the project unlocks high-performance animations, scroll-driven interactive behaviors (via ScrollTrigger), and timeline transitions across Astro client scripts (`.astro`) and React 19 Islands (`.tsx`). Centralizing GSAP configuration in a utility module (`src/lib/gsap.ts`) and creating comprehensive developer documentation (`docs/astro-gsap.md`) ensures clean lifecycle cleanup, avoids memory leaks, and provides a clear integration standard for the team.

## What Changes

- Install `gsap` and `@gsap/react` dependencies via `pnpm add gsap @gsap/react`.
- Create centralized GSAP utility module (`src/lib/gsap.ts`) that registers plugins (e.g. `ScrollTrigger`) once and exports configured instances.
- Create detailed developer documentation in `docs/astro-gsap.md` covering Astro client scripts, React 19 island lifecycle hooks (`useGSAP`), View Transitions handling, and cleanup patterns.
- Update living dependency map `docs/component-dependencies.md` to reference `src/lib/gsap.ts`.

## Capabilities

### New Capabilities
- `gsap-animation`: Centralized GSAP utility module (`src/lib/gsap.ts`) and comprehensive architecture documentation (`docs/astro-gsap.md`) for animating Astro and React components.

## Impact

- **Dependencies**: Adds `gsap` and `@gsap/react` to `package.json`.
- **Source Files**: Creates `src/lib/gsap.ts`, `docs/astro-gsap.md`.
- **Documentation**: Updates `docs/component-dependencies.md`.
