## Context

See `proposal.md` for motivation. The curator page orchestrates `CuratorHero` and `CuratorSalas` using Astro components, Tailwind CSS v4, and i18n translation dictionaries. The recent audit showed WCAG AA contrast failures, hardcoded Spanish copy in an English route, invalid heading nesting, and small mobile tap targets.

## Goals / Non-Goals

**Goals:**
- Attain WCAG 2.1/2.2 AA compliance across the curator profile view.
- Enforce strict bilingual parity with no untranslated strings.
- Correct the semantic document heading tree (`h1` curator name -> `h2` section title -> `h3` exhibition cards).
- Provide accessible touch targets (>= 44px) for all interactive links.
- Eliminate raw hex color leaks in card molecules.

**Non-Goals:**
- Redesigning the visual layout or moving sections.
- Refactoring the entire site's headings (changes to `CardInfo` will be backward-compatible).
- Adding complex client-side scripts (page remains 0 KB client JS).

## Decisions

### 1. Typography & Contrast Remediation
- **Choice**: Switch curator bio copy in `CuratorHero.astro` to `text-ink/85` (>10:1 contrast) and adjust `--color-muted` in `src/styles/global.css` from `#8A8478` to `#6E685C` (4.66:1 contrast against `#F2EDE4`).
- **Rationale**: Bio copy is narrative reading text requiring high legibility. Darkening `--color-muted` ensures that secondary headlines (`Headline color="muted"`) and empty states meet the 4.5:1 AA contrast minimum without losing their warm muted character.
- **Alternatives considered**: Setting all muted text to pure black `#1A1A1A` (rejected: destroys subtle editorial hierarchy); lightening the paper background (rejected: alters brand canvas).

### 2. Configurable Heading Level in Card Molecules
- **Choice**: Add `headingTag?: "h2" | "h3" | "h4"` (defaulting to `"h2"`) to `CardInfo.astro` and forward it through `ImageCard.astro`. `CuratorSalas.astro` will pass `headingTag="h3"`.
- **Rationale**: Backward-compatible with other pages while ensuring that cards under the `<h2>` section heading in `CuratorSalas` render valid `<h3>` tags.
- **Alternatives considered**: Globally changing `CardInfo` to `<h3>` (rejected: could break heading outlines on pages where the card is a primary section).

### 3. Translation Key Namespace
- **Choice**: Add `"explore": "Explora"` (es) and `"explore": "Explore"` (en) under `global.curator` in `src/messages/{es,en}.json`.
- **Rationale**: Maintains strict parity verified by `validate-i18n.ts` and keeps curator-specific strings localized together.

### 4. Interactive Link Ergonomics & Screen Reader Context
- **Choice**: Apply `min-h-[44px] py-2.5 inline-flex items-center` to email and website links in `CuratorHero.astro`, accompanied by `<span class="sr-only">({lang === "es" ? "se abre en una nueva pestaña" : "opens in a new tab"})</span>` for external links.
- **Rationale**: Solves mobile touch target failure (<24px) and satisfies WCAG 2.5.8 and WCAG 2.4.4.

### 5. Design Token Normalization in Cards
- **Choice**: Replace `#CCC` with `text-paper/80`, `#999` with `text-paper/60`, and `#0D0D0D` with `bg-ink`.
- **Rationale**: Replaces hardcoded values with semantic tokens tied to the gallery palette.

## Risks / Trade-offs

- **[Risk] Muted color shift affects existing elements across the site** → *Mitigation*: `#6E685C` is calibrated specifically within the same hue family as `#8A8478`, maintaining visual harmony while satisfying the mathematical 4.5:1 contrast requirement.
- **[Risk] Translation key mismatch breaks build** → *Mitigation*: `scripts/validate-i18n.ts` runs in the build pipeline to catch parity discrepancies immediately.
