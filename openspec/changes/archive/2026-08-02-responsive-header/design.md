# Design: Responsive Header

## CSS-Driven Responsiveness
We will use Tailwind's responsive prefixes to style the `Menu` molecule to act as a fixed drawer on mobile and an inline row on desktop.

- **Mobile First (`Menu.astro`)**: `fixed inset-0 top-[73px] flex-col bg-paper px-6 py-8 translate-x-full transition-transform duration-300 z-40`
- **Desktop Override (`Menu.astro`)**: `md:static md:flex-row md:translate-x-0 md:bg-transparent md:p-0 md:items-center md:gap-8`

## JavaScript Toggling
A vanilla JS `<script>` inside `Header.astro` will handle toggling the menu drawer on mobile.
- `mobile-menu-btn` (the hamburger) will listen for click events.
- When clicked, it will toggle a state class (e.g., `is-open`) or directly toggle `translate-x-full` / `translate-x-0` on the `Menu` container to slide it in and out.
- It will also toggle classes on the hamburger `span` elements to animate them into an "X".

## CTA Relocation
The CTA "Solicitar Acceso" button will be modified in `Header.astro`. Because of the `flex justify-between` layout, placing a single button inside the `Menu` slot on desktop forced the button into the center of the header rather than the far right.

To keep the layout robust and avoid complex DOM positioning hacks:
- We will logically duplicate the button.
- **Desktop Button**: Lives in the right-side container (next to the language switcher) and is visible only on desktop (`hidden md:block`).
- **Mobile Button**: Lives inside the `Menu` slot and is visible only on mobile (`md:hidden`), appearing at the bottom of the off-screen drawer.
