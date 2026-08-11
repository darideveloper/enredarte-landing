## Purpose

Defines the centralized GSAP animation capability, utility module integration (`src/lib/gsap.ts`), and architectural documentation (`docs/gsap-scrolltrigger/`) for Astro components. The official `greensock/gsap-skills` installed in `.agents/skills/` are the source of truth for general GSAP API knowledge; local docs cover Astro-specific integration only.

## MODIFIED Requirements

### Requirement: Centralized GSAP module initialization
The project SHALL export a centralized GSAP module from `src/lib/gsap.ts` that registers only the core plugins actually used (e.g. `ScrollTrigger`) safely on the client side, and SHALL apply global ScrollTrigger configuration, GSAP tween defaults, and a refresh-on-load hook.

#### Scenario: Importing GSAP in client components
- **WHEN** an Astro client script imports `gsap` or `ScrollTrigger` from `src/lib/gsap.ts`
- **THEN** it receives a pre-registered, SSR-safe GSAP instance ready for DOM animation execution, with no unused plugins registered.

#### Scenario: Global animation configuration applied
- **WHEN** the module is imported on the client
- **THEN** `ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })` is applied, `gsap.defaults()` defines consistent easing/duration, and a `window "load"` listener calls `ScrollTrigger.refresh()`.

### Requirement: Comprehensive GSAP architectural documentation
The system documentation SHALL include a dedicated resource guide at `docs/gsap-scrolltrigger/` that keeps the installed GSAP skills (`.agents/skills/gsap-*`) as the single source of truth for GSAP API knowledge and documents only Astro-specific integration details, and SHALL be reachable from the documentation index and component dependency map.

#### Scenario: Developer consults GSAP documentation
- **WHEN** a developer views `docs/gsap-scrolltrigger/`
- **THEN** they find Astro-specific guidance (shared `src/lib/gsap.ts` module, `astro:page-load` lifecycle, bundling/SSR-safety, SEO/LCP tips, and the dual SEO-safe reveal approaches: `fromTo` + `clearProps` vs the `.js-reveal`/`.no-js` CSS fallback) with duplicated GSAP API explanations replaced by `→ gsap-<skill>` pointers, and a **prerequisite notice** that the installed `.agents/skills/gsap-*` skills are required for the pointers to resolve.

#### Scenario: Navigating to the GSAP documentation
- **WHEN** a developer follows the GSAP reference from `docs/component-dependencies.md` or the main documentation index
- **THEN** the link resolves to `docs/gsap-scrolltrigger/` (no dangling `[[astro-gsap]]` reference).