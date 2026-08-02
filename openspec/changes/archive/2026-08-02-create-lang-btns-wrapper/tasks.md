## 1. Update Btn Atom

- [x] 1.1 Update `src/components/atoms/Btn.tsx` to add an `outlineMuted` variant (`bg-transparent text-muted border-border-theme hover:text-ink hover:border-ink`).
- [x] 1.2 Update `src/components/atoms/Btn.tsx` to add an `xs` size variant (`text-[10px] py-1.5 px-2`).
- [x] 1.3 Add a `disabled` prop support to `Btn.tsx`. When `disabled` is true, the button should have `pointer-events-none`, render with a distinctive active style (e.g., solid `border-ink` and `text-ink`), and omit the `href` attribute.

## 2. Create LangBtns Molecule

- [x] 2.1 Delete `src/components/molecules/LanguageSwitcher.astro` (if it exists) or replace it completely.
- [x] 2.2 Create `src/components/molecules/LangBtns.astro` which accepts `lang` and `pageKey` props.
- [x] 2.3 Implement the logic in `LangBtns.astro` to generate `esUrl` and `enUrl` using `getLocalizedPath`.
- [x] 2.4 Render two `<Btn>` components within a flex container (`gap-2`): one for "ES" and one for "EN".
- [x] 2.5 Pass `disabled={lang === 'es'}` to the ES button and `disabled={lang === 'en'}` to the EN button. Pass the respective localized URLs to the `href` prop when not disabled.

## 3. Integration and Verification

- [x] 3.1 Update `src/components/organisms/Header.astro` to import and use `<LangBtns />` instead of `<LanguageSwitcher />`.
- [x] 3.2 Update `src/pages/design-system.astro` to showcase `<LangBtns />` instead of `<LanguageSwitcher />` in the Molecules section, demonstrating both English and Spanish active states.
