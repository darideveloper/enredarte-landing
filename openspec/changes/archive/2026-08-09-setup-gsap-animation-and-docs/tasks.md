## 1. Install GSAP Dependencies

- [x] 1.1 Add `gsap` and `@gsap/react` to `package.json` dependencies.

## 2. Create GSAP Central Utility Module

- [x] 2.1 Create `src/lib/gsap.ts` with SSR-safe plugin registration (`ScrollTrigger`, `TextPlugin`) and exports.

## 3. Create GSAP Architecture Documentation

- [x] 3.1 Create `docs/astro-gsap.md` guide covering Astro client scripts, React 19 `useGSAP` lifecycle hooks, View Transitions, and performance rules.
- [x] 3.2 Update `docs/component-dependencies.md` to map `src/lib/gsap.ts` and `docs/astro-gsap.md`.

## 4. Verification

- [x] 4.1 Run `npx astro build` to verify type safety and static build completion.
