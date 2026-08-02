## Why

The current header is a basic placeholder and does not reflect the editorial visual design specified in `.designs/enredarte_mockup_A_salas_DESCARGAR.html`. Creating a dedicated `Header.astro` organism component brings together our new `Logo` atom (using default variant), navigation links with crimson underline hover animations, a language toggle, and our `Btn` atom CTA ("Solicitar Acceso").

## What Changes

- Update `src/components/organisms/Header.astro` to match the editorial mockup design.
- Integrate the default `<Logo variant="default" />` atom component.
- Add navigation links (`Salas`, `Artistas`, `Curadores`, `Gaceta`, `Eventos`, `Trade`) with animated hover states.
- Include the `Btn` atom (`variant="ghost"`, `size="sm"`) for the "Solicitar Acceso" CTA.
- Showcase the `Header.astro` organism on `/design-system` under the "3. Organisms" section.

## Capabilities

### New Capabilities
- `header-organism`: Editorial sticky navigation header organism integrating Logo, nav links, language toggle, and ghost CTA button.

### Modified Capabilities
- (None)

## Impact

- **Organism Component**: `src/components/organisms/Header.astro`
- **Design System Page**: `src/pages/design-system.astro` updated under Organisms section.
