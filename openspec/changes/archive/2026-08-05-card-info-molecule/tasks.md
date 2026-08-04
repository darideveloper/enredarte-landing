## 1. Molecule Implementation

- [x] 1.1 Create `CardInfo.astro` file in `src/components/molecules/`.
- [x] 1.2 Define `Props` interface with required `title` and `href`, and optional `subtitle`, `meta`, `curator`, and `class` strings.
- [x] 1.3 Implement the root `<a>` tag utilizing the `href` and passing standard overlay classes (`absolute inset-0 flex flex-col justify-end p-7 z-10`).
- [x] 1.4 Render the optional `subtitle` as an eyebrow (e.g. `text-[10px] uppercase text-crimson tracking-[0.18em] mb-2.5`).
- [x] 1.5 Render the required `title` in an `<h2>` element (e.g. `font-serif text-paper leading-[1.15] mb-2`).
- [x] 1.6 Render the optional `meta` info conditionally below the title (e.g. `text-[10px] text-[#CCC] tracking-[0.06em] uppercase`).
- [x] 1.7 Render the optional `curator` conditionally below the meta (e.g. `text-[10px] text-[#999] italic mt-1.5`).
