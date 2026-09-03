## MODIFIED Requirements

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

