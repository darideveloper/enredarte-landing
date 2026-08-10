## Purpose

Defines the centralized GSAP animation capability, utility module integration (`src/lib/gsap.ts`), and architectural documentation (`docs/astro-gsap.md`) for Astro and React components.

## ADDED Requirements

### Requirement: Centralized GSAP module initialization
The project SHALL export a centralized GSAP module from `src/lib/gsap.ts` that registers core plugins (e.g. `ScrollTrigger`) safely on the client side.

#### Scenario: Importing GSAP in client components
- **WHEN** an Astro client script or React component imports `gsap` or `ScrollTrigger` from `src/lib/gsap.ts`
- **THEN** it receives a pre-registered, SSR-safe GSAP instance ready for DOM animation execution.

### Requirement: Comprehensive GSAP architectural documentation
The system documentation SHALL include a dedicated resource guide at `docs/astro-gsap.md` with complete frontmatter, installation instructions, Astro client script patterns, React 19 `useGSAP` lifecycle patterns, and performance cleanup rules.

#### Scenario: Developer consults GSAP documentation
- **WHEN** a developer views `docs/astro-gsap.md`
- **THEN** they can read installation commands, code samples for `.astro` and `.tsx` integration, View Transitions handling rules, and cross-references to other project documentation.
