## 1. Refactor Menu Molecule

- [x] 1.1 Update `src/components/molecules/Menu.astro` to add `<slot />` at the end of the `<nav>` container.
- [x] 1.2 Update the `nav` container classes in `Menu.astro` to: `fixed inset-0 top-[73px] flex-col bg-paper px-6 py-8 translate-x-full transition-transform duration-300 z-40 md:static md:flex-row md:translate-x-0 md:bg-transparent md:p-0 md:items-center md:gap-8`.
- [x] 1.3 Add an `id` prop (defaulting to `"main-menu"`) to the `<nav>` container so it can be targeted by JS.

## 2. Refactor Header Organism

- [x] 2.1 Update `src/components/organisms/Header.astro` to move the `Btn` (Solicitar Acceso) from the right `flex` container into the `<Menu>` component as a child (slot).
- [x] 2.2 Add a hamburger `<button id="mobile-menu-btn" class="md:hidden flex flex-col justify-center gap-1.5 w-6 h-6 z-50">` to the right container in `Header.astro`. Add the 3 animated spans inside it.
- [x] 2.3 Add a `<script>` block to `Header.astro` that attaches a click event listener to `mobile-menu-btn` which toggles the `translate-x-full` / `translate-x-0` classes on the menu, and animates the hamburger lines into an "X".
