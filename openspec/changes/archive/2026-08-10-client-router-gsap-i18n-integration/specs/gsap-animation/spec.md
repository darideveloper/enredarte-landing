## MODIFIED Requirements

### Requirement: Comprehensive GSAP architectural documentation
The system documentation SHALL include a dedicated resource guide at `docs/gsap-scrolltrigger/` that keeps the installed GSAP skills (`.agents/skills/gsap-*`) as the single source of truth for GSAP API knowledge and documents only Astro-specific integration details, SHALL include a View Transitions + GSAP section covering the full lifecycle pattern (`mm.revert()` on `astro:after-swap`, re-init on `astro:page-load`, `transition:animate="none"`, Hero entrance guard via `sessionStorage`, `ScrollTrigger.refresh()` on navigation), and SHALL be reachable from the documentation index and component dependency map.

#### Scenario: Developer consults GSAP documentation
- **WHEN** a developer views `docs/gsap-scrolltrigger/`
- **THEN** they find Astro-specific guidance (shared `src/lib/gsap.ts` module, `astro:page-load` lifecycle, bundling/SSR-safety, SEO/LCP tips, View Transitions + GSAP integration pattern, and the dual SEO-safe reveal approaches: `fromTo` + `clearProps` vs the `.js-reveal`/`.no-js` CSS fallback) with duplicated GSAP API explanations replaced by `→ gsap-<skill>` pointers, and a **prerequisite notice** that the installed `.agents/skills/gsap-*` skills are required for the pointers to resolve.

#### Scenario: Navigating to the GSAP documentation
- **WHEN** a developer follows the GSAP reference from `docs/component-dependencies.md` or the main documentation index
- **THEN** the link resolves to `docs/gsap-scrolltrigger/` (no dangling `[[astro-gsap]]` reference).
