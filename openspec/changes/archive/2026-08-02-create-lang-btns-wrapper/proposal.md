## Why

The current language toggle is a single button that switches text and URL depending on the active language. For better UX and clearer navigation context, it should be a dual-button wrapper (`LangBtns`) where both languages are visible (ES and EN), and the button corresponding to the active language is visually disabled, while the other serves as a functional localized link.

## What Changes

- Add a new `outlineMuted` variant to `Btn.tsx` to handle the specific styling required for these language buttons (transparent background, thin border, uppercase).
- Add support for a `disabled` prop in `Btn.tsx` that styles the button as inactive and disables pointer events.
- Create a new `LangBtns.astro` molecule that replaces `LanguageSwitcher.astro`. It will render two `Btn` atoms (one for "ES" and one for "EN").
- The molecule will route the inactive language button using `getLocalizedPath` and disable the button for the active language.
- Update `Header.astro` and `design-system.astro` to use `LangBtns.astro`.

## Capabilities

### New Capabilities
- `lang-btns-molecule`: A dual-button wrapper that renders available languages, highlighting the active one and linking to the localized paths of inactive ones.

### Modified Capabilities

## Impact

- `src/components/atoms/Btn.tsx`
- `src/components/molecules/LangBtns.astro` (New)
- `src/components/molecules/LanguageSwitcher.astro` (Deleted/Replaced)
- `src/components/organisms/Header.astro`
- `src/pages/design-system.astro`
