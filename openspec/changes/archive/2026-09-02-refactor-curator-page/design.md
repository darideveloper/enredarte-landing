## Context

See `proposal.md` for motivation.

`src/components/pages/curador/CuratorPage.astro` is currently 136 lines long because it directly includes all HTML structures, layout styles, and markup for both the curator profile header and the curated galleries grid. In contrast, standard pages in the repository (e.g. `ArtworkPage.astro` at 50 lines) delegate their UI sections to organisms and molecules.

## Goals / Non-Goals

**Goals:**
- Extract the profile hero section into `src/components/organisms/CuratorHero.astro`.
- Extract the curated galleries section into `src/components/organisms/CuratorSalas.astro`.
- Refactor `src/components/pages/curador/CuratorPage.astro` to ~35-40 lines as a pure orchestrator.
- Use project design tokens (`text-muted`, `bg-paper`, `text-ink`, `text-crimson`, `border-border-theme`) consistently.
- Ensure 100% visual and behavioral parity.

**Non-Goals:**
- Adding new routes or changing existing URLs (`/curadores/<slug>` and `/en/curadores/<slug>`).
- Modifying backend API data or view transformation helpers in `src/data/api.ts`.

## Decisions

### Decision 1: Create `src/components/organisms/CuratorHero.astro`
- **Props**:
  - `curator: ArtCurator`
  - `lang: Lang`
  - `bio?: string`
  - `class?: string`
- **Responsibilities**: Renders portrait with `aspect-[4/5]`, initials monogram fallback, `Headline`, curator name `h1`, bio paragraph, email mailto, and website external link.

### Decision 2: Create `src/components/organisms/CuratorSalas.astro`
- **Props**:
  - `salas: SalaView[]`
  - `lang: Lang`
  - `class?: string`
- **Responsibilities**: Renders section container, `"Explora / Salas Curadas"` `Title` + `Headline`, responsive 3-column grid of `ImageCard`s, and localized empty state when `salas.length === 0`.

### Decision 3: CuratorPage Orchestrator
- **Responsibilities**: Look up curator by slug, compute `bio`, `salas`, `alternateUrls`, render `<PageSEO>`, `<CuratorHero>`, and `<CuratorSalas>`.

## Risks / Trade-offs

- **[Risk] Visual discrepancy after extraction** →
  - *Mitigation*: Directly preserve exact classes and responsive breakpoints (`md:grid-cols-[300px_1fr] lg:grid-cols-[360px_1fr]`, `gap-10 md:gap-16`, etc.), replace hardcoded hex colors with semantic tokens.
