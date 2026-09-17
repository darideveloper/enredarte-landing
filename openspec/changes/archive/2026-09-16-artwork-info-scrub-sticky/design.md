## Context

`ArtworkPage.astro` renders a two-column immersive section: `ArtworkImageViewer` (left) + `ArtworkInfoPanel` (right). For multi-image artworks on desktop (`≥1024px`, motion allowed), `ArtworkImageViewer` pins the whole `[data-scroll-section]` via GSAP ScrollTrigger (`pin: true`, `start: "top 93px"`, `end: +=(n-1)*100%`) and crossfades `.artwork-image` layers. The panel declares `lg:sticky lg:top-[93px] lg:h-[calc(100svh-93px)] lg:overflow-y-auto`, but the section's `overflow-hidden` vetoes sticky, and the prior `80px` matched neither the real header (`Header.astro`: `sticky top-0`, logo `h-14` + `py-4.5` + border = 93px measured live via `getBoundingClientRect().bottom`) nor a stable token. Single-image artworks skip ScrollTrigger, so they get no stickiness at all. Mobile and reduced-motion stack images (preserved).

## Goals / Non-Goals

**Goals:**
- Info panel reliably visible for the whole pin duration on desktop multi-image scrub.
- Single shared header-height token for panel `top`/height and ScrollTrigger `start`.
- CSS `sticky` no longer vetoed by ancestor overflow; image-bleed clipping preserved.
- No mobile / reduced-motion / SEO / i18n behavior change.

**Non-Goals:**
- Sticky beyond the section (Option B sidebar), `position: fixed` panel, footer-overlap handling.
- Visual redesign of panel content; new dependencies; GSAP trigger/`end`/lifecycle changes.

## Decisions

- **Keep pinning the whole section (Option A) over pinning only the image column.** Rationale: preserves the current cinematic crossfade with the smallest diff; the pin itself guarantees info visibility during scrub. Alternative (pin image-zone only + pure-CSS sidebar) is Option B — explicitly deferred.
- **Move `overflow-hidden` from `section` to `.artwork-image-zone`.** Rationale: absolute image layers still clip, but the panel's `sticky` ancestor chain stays clean. Alternative (leave on section) keeps sticky dead code; rejected because the single-image fallback needs working sticky.
- **Hardcode the measured header px (`93px`) as a Tailwind arbitrary value in two places, not a CSS var plumbing exercise.** Rationale: header height changes rarely; one token in two files is the shortest diff. Alternative (CSS var `--header-h` set from JS/`getBoundingClientRect`) is more robust to logo/padding drift — revisit if header becomes responsive-variable.
- **`100vh` → `100svh`.** Rationale: small-viewport-height units prevent CTA clipping under browser chrome; zero visual change on desktop.
- **Add `lg:self-start` to the panel.** Rationale: required for `sticky` inside a grid column taller than the panel; harmless during pin.

## Risks / Trade-offs

- [Header drift] → Mitigation: measure with `getBoundingClientRect` at implementation time; note the value in tasks for the next header change to update both files.
- [Long panel content → nested `overflow-y-auto` scroll during pin] → Mitigation: accepted for Option A (spec CTA-overflow scenario already requires inner scroll); Option B would revisit with non-scrolling sticky.
- [Pin spacer `(n-1)*100%` long trap for many images] → Mitigation: unchanged behavior; not worsened by this fix.
- [`ClientRouter` transitions leaking triggers] → Mitigation: existing `astro:after-swap` revert / `astro:page-load` init unchanged; verified 0 pin-spacers after 3 client-side navs.
- [Multi-image scrub never executed live] → No artwork in the backend has >1 image (all 30 `data-count="1"` at verification time), so the pin/counter scrub ran 0 times in the browser. Accepted: the scrub-path diff is the single `start` offset string; trigger, `end`, timeline, and lifecycle are byte-identical. Re-run tasks 3.2/4.2 against a multi-image artwork if one appears.

## Open Questions

- None open. Resolved: header token = `93px` (measured live, `header.getBoundingClientRect().bottom === 93` at desktop); `overflow-hidden` moves section → image zone (confirmed); verification via `playwright-cli` skill.
