## Context

See `proposal.md` for motivation and background.

Currently the project uses `@tailwindcss/vite` and Tailwind CSS utility transitions. Integrating GSAP introduces a powerful programmatic animation engine for complex timelines, scroll triggers, and SVG morphing across both Astro static templates and React 19 interactive Islands.

## Goals / Non-Goals

**Goals:**
- Install `gsap` and `@gsap/react` as project dependencies.
- Create `src/lib/gsap.ts` to centralize GSAP plugin registration (e.g. `ScrollTrigger`) once to prevent duplicate registration or SSR evaluation errors.
- Author `docs/astro-gsap.md` following standard project metadata schema (`type: resource`, `status: active`, tags).
- Update `docs/component-dependencies.md` to reference `src/lib/gsap.ts`.

**Non-Goals:**
- Refactoring existing CSS transitions or existing components to force GSAP usage where CSS transitions suffice.

## Decisions

### Decision 1: Centralized `src/lib/gsap.ts` helper module
- **Approach**: Register plugins (`ScrollTrigger`, etc.) inside `if (typeof window !== "undefined")` in `src/lib/gsap.ts` and re-export `gsap` and plugins.
- **Rationale**: Astro performs server-side rendering (SSR). Guarding plugin registration prevents Node build-time reference errors while avoiding repetitive `gsap.registerPlugin` calls in individual components.

### Decision 2: Documentation structure in `docs/astro-gsap.md`
- **Approach**: Create `docs/astro-gsap.md` with standard YAML frontmatter tags (`astro`, `animation`, `gsap`, `react`, `documentation`), code blocks for `.astro` and `.tsx` islands, and links to `[[astro-atomic-components]]` and `[[astro-react-islands]]`.
- **Rationale**: Maintains exact metadata and cross-referencing consistency with existing documentation suite files (`docs/astro-portless.md`, `docs/astro-atomic-components.md`).

## Risks / Trade-offs

- **[Risk]**: GSAP animations not re-running after Astro View Transitions page navigation.
- **[Mitigation]**: Document `document.addEventListener("astro:page-load", ...)` integration pattern in `docs/astro-gsap.md`.
