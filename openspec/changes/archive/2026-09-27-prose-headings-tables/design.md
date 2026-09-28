## Context

All long-form surfaces share one markdown pipeline: `src/lib/markdown.ts` (marked GFM renderer) + `Markdown.astro` prose string + `.markdown-prose`/`.blog-prose` rules in `global.css`. `BlogPost.astro` additionally inlines a duplicate of the full `prose-*` string instead of consuming the atom. Legal pages (`LegalPage` + `src/content/legal/*.md`, ES+EN) use only `##` sections; the cookie policy carries the only production table (4 cols × 5 rows, code keys). DESIGN.md pins Georgia serif display + system sans body, sharp corners (`rounded-none`), and the Crimson Rule (≤10% crimson per screen).

Current failures: headings share ink color with body at a weak size step (h2 26→30px serif vs 15px sans body at 1.85 leading; h4 12px uppercase muted identical to `Headline` eyebrows); the h2 marker is a 28×1px hairline; `table {display:block}` defeats `border-collapse`/`w-full`; `on-dark`/`compact` variants ignore tables; Spanish heading slugs mangle diacritics (`/[^\w]+/g`).

Mechanism correction (found during implementation via live computed styles): the repo ships no `@tailwindcss/typography` plugin, so ALL `prose-*` utility classes generate zero CSS — in dev and in build. The `prose-*` strings in the atom/BlogPost were dead weight; Tailwind preflight resets left every markdown element (h2, p, a, ul…) visually identical. All element styling MUST therefore live in plain CSS under the existing `.blog-prose, .markdown-prose` selector pattern (which already carries markers, figures, code blocks, and now the full port).

## Goals / Non-Goals

**Goals:**
- Establish a scannable `h1(36/blog 32–44) > h2(~32–34) > h3(~22–24) > body(15)` ladder with color/weight/marker signals, not size alone.
- Give tables a framed, keyboard-scrollable wrapper with zebra rows, mono key column, and intact `border-collapse` layout; scroll-in-frame on mobile.
- Single source of truth: BlogPost consumes the atom; slugs work in Spanish; `on-dark`/`compact` cover tables.

**Non-Goals:**
- No legal/blog copy changes; no route, i18n-key, or footer-link changes.
- No legal-only section numbering/counters; no design-system prose specimen; no stacked-card mobile tables (explore decisions).
- No font-family changes (Georgia + system stack stay).

## Decisions

1. **Atom owns prose; BlogPost consumes it.** BlogPost drops its inline `prose-*` duplication and renders via the shared atom/classes (keeping its `.blog-prose` alias + surrounding layout/meta intact). Alternative (patch both in lockstep) rejected — it re-splits the system that caused this bug.
2. **Heading signal = scale + marker + body recession.** h2 grows to ~32–34px with a 40–48×2px crimson anchor bar (stays under the Crimson Rule); h3 ~22–24px; h4 switches to ink with a left-border signal; body leading 1.85 → ~1.75 with a slightly softer reading ink while headings stay pure ink. Alternative (enlarge only) rejected — size alone failed at this scale.
3. **Table wrapper in the renderer, not CSS hacks.** `markdown.ts` wraps `<table>` in a framed scroll container (keeps `border-collapse` on the table itself); CSS adds outer border, zebra (`odd` rows), row hover, `min-w` for wide tables, sticky `th`, mono+nowrap first/key column. Alternative (keep `display:block` + tweaks) rejected — block layout fundamentally breaks table rendering.
4. **Slug normalization for Spanish.** Normalize diacritics (NFD strip) before slugifying so `Política`, `Términos` produce stable ASCII anchors; uniqueness suffix on collision. Alternative (Unicode slugs) rejected — fragment links and existing `/en/...` patterns favor ASCII.
5. **Complete the variants.** `on-dark` gets table/link/hr/code overrides (light header treatment on dark); `compact` tightens heading margins. Alternative (headings-only) rejected — bios on dark cards with tables would stay broken.
6. **Accessible wrapper contract.** Wrapper gets keyboard scroll (`tabindex=0`, visible focus) with `scope="col"` on header cells; caption optional via table title where present. Chosen over visual-only framing per user decision.
7. **Plain CSS, not utilities, carries all element styling.** Every heading/body/link/list/blockquote/code/table declaration lives as a real rule in `global.css`; the atom string keeps working utilities only. Alternative (install `@tailwindcss/typography`) rejected — upholds the prior deliberate rejection, adds no dependency, and keeps the `.blog-prose`/`.markdown-prose` single-pattern convention. Alternative (keep dead `prose-*` classes as documentation) rejected — they already caused one false "implemented" verification.

## Risks / Trade-offs

- [Risk] Global prose change shifts blog + bio aesthetics, not just legal → Mitigation: deltas limited to scale/color/spacing; verify with screenshots of aviso + cookies-table + one blog post (desktop + 390px, ES).
- [Risk] Screenshot-only verification misses inert styles → Mitigation: verify via live computed styles per element (font-size/family/color), not eyeballing captures; headless screenshots additionally freeze GSAP reveals mid-tween, so capture with reduced-motion or settled state.
- [Risk] More crimson pixels from stronger h2 markers → Mitigation: markers capped at ~48px; audit one full legal page against the ≤10% rule.
- [Risk] BlogPost consolidation touches the highest-traffic template → Mitigation: keep `.blog-prose` alias, layout, meta, and GSAP reveal selectors unchanged; visual diff only on typography.
- [Risk] Slug change breaks existing `#fragment` bookmarks → Mitigation: ASCII-normalized slugs are a strict improvement over mangled ones; no in-repo links depend on old fragments (verify via grep).

## Migration Plan

No data migration. Ship as one visual change; rollback = revert the four files. Verify via `pnpm build` (LegalPage throws on missing entries) + screenshot pass before merge.

## Open Questions

- None — all explore gaps resolved (consolidate, fix slugs, complete variants, full a11y wrapper, scroll-in-frame, no specimen, no legal numbering).
