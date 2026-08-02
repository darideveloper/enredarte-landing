## 1. Extend Link Atom

- [x] 1.1 Update `src/components/atoms/Link.astro` to accept a `variant` prop (`default` or `nav`), defaulting to `default`.
- [x] 1.2 Move the standard `text-ink hover:text-crimson...` styles to the `default` variant.
- [x] 1.3 Add the `nav` variant styles: `relative pb-1 text-[11px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-crimson hover:after:w-full after:transition-all after:duration-300`.
- [x] 1.4 Update `src/pages/design-system.astro` to showcase both variants in the Link atom section.

## 2. Create Menu Molecule

- [x] 2.1 Create `src/components/molecules/Menu.astro`.
- [x] 2.2 Define props: `links` (Array of `{ label: string, href: string }`) and optional `class` string.
- [x] 2.3 Render a `<nav>` container that maps over `links` and outputs a `<Link variant="nav" href={link.href}>{link.label}</Link>` for each.
- [x] 2.4 Add `Menu` to the Molecules section of `src/pages/design-system.astro` with some dummy links to verify layout and hover effects.

## 3. Refactor Header Organism

- [x] 3.1 Update `src/components/organisms/Header.astro` to import `Menu.astro`.
- [x] 3.2 Remove the hardcoded map loop and replace it with `<Menu links={navLinks} class="hidden md:flex gap-8" />` (ensuring the layout classes like `hidden md:flex items-center gap-8` are preserved, either passed down or wrapped).
