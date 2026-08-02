## Context

The mockup `.designs/enredarte_mockup_A_salas_DESCARGAR.html` defines the editorial navigation layout (`<nav>`), logo placement, uppercase tracking for links, language selector, and ghost CTA button.

## Goals / Non-Goals

**Goals:**
- Refactor `src/components/organisms/Header.astro` to use our global theme tokens (`paper`, `ink`, `crimson`, `muted`, `border-theme`).
- Use `<Logo variant="default" />` for the brand logo.
- Use `<Btn variant="ghost" size="sm">` for the CTA button.
- Add CSS pseudo-element animation (`after:w-0 hover:after:w-full after:bg-crimson`) for link hover underlines.

**Non-Goals:**
- Complex mobile drawer menu (focusing on responsive header layout).

## Decisions

**1. CSS Underline Hover Transition**
- **Decision:** Use Tailwind arbitrary pseudo-element classes:
  `relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-crimson hover:after:w-full after:transition-all after:duration-300`
- **Rationale:** Replicates the exact CSS hover animation from `.designs/enredarte_mockup_A_salas_DESCARGAR.html` (lines 19-22).
