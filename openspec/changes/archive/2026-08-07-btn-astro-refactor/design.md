## Context

See proposal.md for motivation. We are creating `Btn.astro` to replace `Btn.tsx` and refactoring `Hero.astro`, `Header.astro`, and `LangBtns.astro`.

## Goals / Non-Goals

**Goals:**
- Implement `Btn.astro` supporting `variant` (`primary`, `ghost`, `outline`), `size` (`sm`, `md`, `lg`), `href`, `type`, `disabled`, and `class`.
- Polymorphic rendering (`<a>` vs `<button>`).
- Delete `Btn.tsx`.
- Update `Hero.astro` to use `<Btn variant="primary">` and `<Btn variant="outline">`.
- Update `Header.astro` to use `<Btn.astro>`.
- Refactor `LangBtns.astro` to loop over `languages` array using semantic `<a>` tags with `/` divider.

**Non-Goals:**
- No React state / Zustand bindings for buttons in this phase.

## Decisions

**1. Polymorphic Element Selection**
- `const Component = href && !disabled ? "a" : "button";`
- Ensures semantic HTML depending on whether a navigation link or action button is specified.

**2. LangBtns Optimization**
- `LangBtns` does not require the full `Btn` button styling. Instead, a clean loop mapping `{ code, label }` onto `<a>` tags with `text-muted` / `text-ink` active states matches the compact header design mockup.

## Risks / Trade-offs

None. Simplifies the component layer by moving from React to native Astro.
