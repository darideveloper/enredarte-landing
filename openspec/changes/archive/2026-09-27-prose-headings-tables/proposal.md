## Why

Long-form prose (legal pages, blog posts, bios) renders headings nearly identical to body text and tables without structure. Root cause found during implementation: the repo ships no `@tailwindcss/typography` plugin (deliberately rejected in an earlier change), so every `prose-*` utility class generates zero CSS — verified via computed styles on the live page (h2 and p both resolve to 16px system-ui). Visible prose styling can only come from plain CSS in `global.css`.

## What Changes

- **Heading ladder in plain CSS** (`.markdown-prose` / `.blog-prose` selectors in `global.css`, the file's established pattern): `h2` 32px (34px md) serif ink with the 44×2px crimson marker, `h3` 22–24px serif ink, `h4` 12px uppercase ink with crimson left border; body 1.75 leading in the reading token while headings stay pure ink.
- **Full prose element port**: links (crimson + underline), strong/em, lists (disc/decimal + markers), blockquote, code/pre, hr, img, and table elements (ink header, zebra, mono first column, min-w) — all previously dead `prose-*` utilities, now real rules. This also restores missing link affordances and list bullets.
- **Dead utilities stripped**: the `Markdown` atom's `prose-*` string is reduced to working utilities only (`hyphens-auto`), with a comment pointing at `global.css` as the style source, so the trap doesn't recur.
- **Table system**: renderer emits a framed keyboard-scrollable wrapper (`scope="col"` headers); CSS keeps `border-collapse` intact.
- **Blog consolidation**: `BlogPost.astro` consumes the shared atom (single source of truth).
- **Spanish slugs**: heading slug generation normalizes diacritics with uniqueness handling.
- **Variants completed**: `on-dark` gains table/link/hr/code overrides; `compact` tightens headings.
- **Table accessibility**: keyboard-scrollable wrapper with a scope contract for header cells (caption optional).
- **No legal-only numbering** and **no design-system specimen** per explore decisions; scroll-in-frame (not stacked cards) for mobile tables.
- Explicit non-goal: installing `@tailwindcss/typography` (upholds the prior rejection; plain CSS covers it).

## Capabilities

### New Capabilities
- None — this change revises rendering behavior of an existing pipeline, no brand-new capability.

### Modified Capabilities
- `markdown-rendering`: heading hierarchy, full prose element styling via plain CSS (no typography plugin), table presentation (frame/wrapper, zebra, key column, mobile scroll-in-frame), Spanish slug handling, `on-dark`/`compact` completion, BlogPost consolidation onto the atom, accessible table wrapper contract, dead-utility removal.

## Impact

- Affected code: `src/styles/global.css` (plain-CSS prose element rules — the actual style source), `src/components/atoms/Markdown.astro` (dead `prose-*` string stripped), `src/lib/markdown.ts` (slug + table wrapper renderer), `src/components/pages/blog/BlogPost.astro` (drop duplicate, consume atom).
- No copy, route, i18n-key, or footer-link changes; legal/blog content files untouched.
- Visual change across all prose surfaces (legal, blog, bios, descriptions) — desktop + mobile screenshots required for `aviso-de-privacidad`, `politica-de-cookies` (table), and one blog post.
