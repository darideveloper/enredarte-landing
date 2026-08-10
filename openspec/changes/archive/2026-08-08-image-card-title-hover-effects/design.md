## Context

See `proposal.md` for motivation and background.

Currently `CardInfo.astro` renders subtitle as:
`<p class="text-[10px] uppercase text-crimson tracking-[0.18em] mb-2.5">{subtitle}</p>`
And the `<h2>` title element has no vertical accent line animation when the parent card is hovered.

## Goals / Non-Goals

**Goals:**
- Add a smooth vertical crimson line accent bar next to the `<h2>` title in `CardInfo.astro` that slides, scales, and fades in on hover (`group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-y-100`).
- Shift title wrapper smoothly on hover (`group-hover:pl-3.5 transition-all duration-300`).
- Update subtitle styling in `CardInfo.astro` to `font-bold text-crimson tracking-[0.2em] mb-2.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]` so red text is legible in all states.

**Non-Goals:**
- Modifying general card layout bounds or image aspects.

## Decisions

### Decision 1: Absolute vertical accent line inside relative title container vs pseudo-element
- **Approach**: Wrap `<h2>` in a `relative group/title` container with an absolute vertical span `<span class="absolute left-0 top-0 bottom-0 w-[3px] bg-crimson rounded-full opacity-0 -translate-x-2 scale-y-75 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-y-100 transition-all duration-300 ease-out" />`.
- **Rationale**: An explicit element provides clean Tailwind class control and hardware-accelerated transform/opacity transitions without relying on complex `before:` CSS overrides.

### Decision 2: Red subtitle drop shadow + bold typography
- **Approach**: Combine `font-bold`, `tracking-[0.2em]`, and `drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]`.
- **Rationale**: Provides high contrast over dark artwork images without introducing heavy solid background pills that might obscure visual artwork content.

## Risks / Trade-offs

- **[Risk]**: Title text shifting causing multiline layout reflow.
- **[Mitigation]**: Use `padding-left` transition on title wrapper with `transition-all duration-300` so text smoothly animates without jumping.
