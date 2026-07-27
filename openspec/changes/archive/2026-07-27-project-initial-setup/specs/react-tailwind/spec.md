## ADDED Requirements

### Requirement: React integration via @astrojs/react
The project SHALL integrate React 19 via the `@astrojs/react` integration. React components SHALL use the `client:*` directive pattern for hydration (island architecture).

#### Scenario: React island hydrates on page load
- **WHEN** an Astro page renders a React component with `client:load`
- **THEN** the component SHALL hydrate and become interactive on page load

#### Scenario: React island hydrates when visible
- **WHEN** an Astro page renders a React component with `client:visible`
- **THEN** the component SHALL hydrate only when it scrolls into the viewport

### Requirement: Tailwind CSS v4 via Vite plugin
The project SHALL use Tailwind CSS v4 configured through the `@tailwindcss/vite` Vite plugin. No PostCSS configuration file SHALL be used. The global CSS file SHALL import Tailwind via `@import "tailwindcss"`.

#### Scenario: Tailwind utilities are available in Astro components
- **WHEN** an Astro component uses Tailwind utility classes (e.g., `class="text-lg font-bold"`)
- **THEN** the styles SHALL be applied correctly in both dev and build

#### Scenario: Tailwind utilities are available in React components
- **WHEN** a React component uses Tailwind utility classes via `className`
- **THEN** the styles SHALL be applied correctly in both dev and build

### Requirement: Custom theme tokens
The project SHALL define custom design tokens using Tailwind v4's `@theme inline` directive in `src/styles/global.css`.

#### Scenario: Custom color token is available
- **WHEN** a component uses a custom theme color (e.g., `class="text-brand-500"`)
- **THEN** the custom color value SHALL resolve correctly

### Requirement: React component conventions
React components in this project SHALL follow these conventions:
- Use `export function ComponentName(...)` syntax (no arrow functions, no `React.FC`)
- Use `import * as React from "react"` namespace import
- Use double quotes for string literals
- No semicolons
- Use `@/` path aliases for cross-directory imports

#### Scenario: Component follows conventions
- **WHEN** a new React component is created in `src/components/atoms/`
- **THEN** it SHALL use the declared conventions for exports, imports, and formatting

### Requirement: TypeScript path aliases
The project SHALL configure `@/*` as a path alias mapping to `./src/*` in `tsconfig.json`. React JSX config SHALL be set to `react-jsx` with `jsxImportSource: "react"`.

#### Scenario: Path alias resolves imports
- **WHEN** a file imports from `@/components/atoms/Button`
- **THEN** the import SHALL resolve to `src/components/atoms/Button`
