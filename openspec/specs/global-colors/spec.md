# global-colors Specification

## Purpose
Establishes global design system color tokens in Tailwind CSS to eliminate hardcoded hex values and ensure color consistency across all components. Salon extension includes `card-dark` and browser-surface theming.

## Requirements
### Requirement: Theme Color Tokens
The system SHALL expose the Salon token set in `src/styles/global.css` `@theme inline` as `--color-paper #F2EDE4`, `--color-ink #1A1A1A`, `--color-crimson #C41E3A`, `--color-muted #8A8478`, `--color-border-theme #E0DDD8`, `--color-banner-text #5C5748`, `--color-banner-bg #EAE4D8`, `--color-description #7A7568`, `--color-card-dark #0D0D0D`, and `--color-brand-500 oklch(0.62 0.18 20)`, and SHALL theme browser surfaces `::selection bg-crimson/paper`, `caret-color brand-500`, `scrollbar-color muted/paper (thin)`, `focus-visible 2px brand-500 offset 2px`, and `a underline-offset 3px thickness 1px`, in addition to the previously-required `bg-paper` body base and `description` token behavior.

#### Scenario: Card-dark token exists
- **WHEN** a component applies `bg-card-dark` or `border-card-dark`
- **THEN** it evaluates to `#0D0D0D` (Deep Charcoal, image letterbox canvas) — used by `PostCard` and blog hero

#### Scenario: Selection and caret are crimson
- **WHEN** a user selects text on any blog page
- **THEN** `::selection` is `bg-crimson #C41E3A` `text-paper #F2EDE4` and `caret-color` is `brand-500 oklch(0.62 0.18 20)`, not browser-default blue/black

#### Scenario: Focus is brand ring
- **WHEN** a `PostCard` or `PaginationNav` link receives keyboard focus
- **THEN** `focus-visible` shows `outline 2px brand-500 offset 2px` (via `ring-brand-500` utilities) with sufficient contrast on `paper`

#### Scenario: Pre-existing tokens still hold
- **WHEN** existing components apply `bg-paper`, `text-crimson`, `text-muted`, `text-description`
- **THEN** they continue to evaluate to `#F2EDE4`, `#C41E3A`, `#8A8478`, `#7A7568` respectively, with no hex leakage

#### Scenario: Using paper background token
- **WHEN** a component applies `bg-paper`
- **THEN** the background color evaluates to `#F2EDE4`

#### Scenario: Using crimson brand token
- **WHEN** a component applies `bg-crimson` or `text-crimson`
- **THEN** the color evaluates to `#C41E3A`

#### Scenario: Using ink text token
- **WHEN** a component applies `text-ink` or `border-ink`
- **THEN** the color evaluates to `#1A1A1A`

### Requirement: Description color token
The system SHALL expose a `description` color token in the global Tailwind theme (`--color-description`) for long-form descriptive text, usable as `text-description` and other utility variants. Components SHALL reference this token instead of hardcoded hex values for description body copy.

#### Scenario: Using description text token
- **WHEN** a component applies `text-description`
- **THEN** the color evaluates to `#7A7568`

#### Scenario: Description text uses the token
- **WHEN** the artwork info panel, hero section, or gallery page renders descriptive body copy
- **THEN** the description text applies the `text-description` utility rather than a hardcoded hex value

### Requirement: Base page background
The global layout SHALL apply the paper color (`#F2EDE4`) as the base background on the `<body>` element so any viewport seam exposed by pinned elements, page canvas, or overscroll renders in the paper tone rather than the browser-default white.

#### Scenario: Body uses paper background
- **WHEN** any page under the shared layout renders
- **THEN** the `<body>` element carries `bg-paper`, so areas not covered by a section's own background render in paper

#### Scenario: Pinned artwork section shows no white seam
- **WHEN** the artwork detail page's pinned ScrollTrigger section shifts to `position: fixed`
- **THEN** no white seam is visible between the sticky header and the pinned section, because the body base is paper

### Requirement: Component Refactoring to Color Tokens
All core components and design system pages SHALL use semantic color token utility classes instead of arbitrary hex values.

#### Scenario: Btn atom rendering
- **WHEN** the `Btn` atom is rendered
- **THEN** its background, text, border, and hover state classes reference theme tokens (`bg-crimson`, `text-paper`, etc.) without inline hex values
