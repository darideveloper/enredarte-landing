## ADDED Requirements

### Requirement: Cross-directory imports use @/ aliases
Every import in `src/` that targets a module outside the importing file's own directory SHALL use the `@/` path alias instead of a relative `../` path. This applies to all `.astro`, `.ts`, and `.tsx` source files.

- Imports reaching into `lib/`, `store/`, `data/`, `consts`, `layouts/`, `pages/`, `messages/`, and other component tiers (atoms/molecules/organisms/seo) are all cross-directory imports and MUST use `@/`.
- The alias MUST resolve from `src/` as configured in `tsconfig.json` (`"@/*": ["./src/*"]`).
- No `../` relative import targeting `src/` internals SHALL remain after this change.

#### Scenario: Component imports shared utility
- **WHEN** an atom imports `lib/utils`
- **THEN** the import uses `@/lib/utils`, not `../../lib/utils`

#### Scenario: Organism imports sibling-tier component
- **WHEN** an organism imports a molecule or atom
- **THEN** the import uses `@/components/molecules/...` or `@/components/atoms/...`

#### Scenario: Page imports layout and components
- **WHEN** a page imports `Layout.astro` or a component
- **THEN** the import uses `@/layouts/Layout.astro` or `@/components/...`

#### Scenario: Deep nested component imports shared data
- **WHEN** `src/components/seo/base/BaseSEO.astro` imports `data/site-config`, `consts`, or `lib/i18n/utils`
- **THEN** the imports use `@/data/site-config`, `@/consts`, `@/lib/i18n/utils` instead of `../../../...`

### Requirement: Same-directory imports use relative paths
Imports that target a module in the importing file's own directory SHALL remain relative (`./`). This is the documented pattern for siblings and MUST NOT be converted to aliases.

#### Scenario: Sibling module import
- **WHEN** `src/lib/i18n/utils.ts` imports `ui.ts` or `routes.ts`
- **THEN** the imports remain `./ui` and `./routes`

#### Scenario: Sibling component import
- **WHEN** `src/components/atoms/LangBtns.astro` imports `Btn`
- **THEN** the import remains `./Btn`

#### Scenario: Same-folder SEO component import
- **WHEN** `src/components/seo/PageSEO.astro` imports `BaseSEO`
- **THEN** the import remains `./base/BaseSEO.astro`

### Requirement: External package imports unchanged
Imports of external packages (e.g. `astro`, `react`, `react-dom`, `zustand`, `zod`, `@astrojs/*`, `@tailwindcss/*`) SHALL remain unchanged and MUST NOT be rewritten.

#### Scenario: Framework import preserved
- **WHEN** a file imports a package like `astro` or `zustand`
- **THEN** the import string is left exactly as it was

### Requirement: Import convention is enforced
The import convention MUST be enforced by an automated check so future code cannot regress to relative cross-directory imports. The check SHALL fail the build or CI when a `../` import targeting `src/` internals is found.

#### Scenario: Regression is detected
- **WHEN** a source file introduces a cross-directory relative import
- **THEN** the automated check reports a violation and the build/validation fails

#### Scenario: Convention-compliant code passes
- **WHEN** all source files use `@/` for cross-directory and `./` for same-directory imports
- **THEN** the automated check passes

### Requirement: Documentation examples use the alias convention
Code examples in `docs/` that show cross-directory imports SHALL use the `@/` alias convention so the documentation matches the enforced rule.

#### Scenario: Docs reference updated
- **WHEN** a doc file shows a cross-directory import example (e.g. `../../../lib/i18n/utils`)
- **THEN** the example uses the `@/` form (e.g. `@/lib/i18n/utils`)
