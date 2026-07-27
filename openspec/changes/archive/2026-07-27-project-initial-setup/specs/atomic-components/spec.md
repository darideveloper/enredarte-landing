## ADDED Requirements

### Requirement: Four-tier atomic hierarchy
The project SHALL organize components into a 4-tier atomic hierarchy: `atoms/`, `molecules/`, `organisms/`. Each tier SHALL have strict import rules that prevent circular dependencies.

#### Scenario: Directory structure exists
- **WHEN** the project is scaffolded
- **THEN** `src/components/atoms/`, `src/components/molecules/`, and `src/components/organisms/` SHALL exist

### Requirement: Import rules — atoms
Components in `atoms/` SHALL be self-contained. They MAY import from `store/*` and `lib/*`. They SHALL NOT import from `molecules/*` or `organisms/*`.

#### Scenario: Atom imports from store
- **WHEN** an atom component needs state
- **THEN** it SHALL import from `@/store/*` directly

### Requirement: Import rules — molecules
Components in `molecules/` SHALL combine atoms into reusable units. They MAY import from `atoms/*`, `store/*`, and `lib/*`. They SHALL NOT import from `organisms/*`.

#### Scenario: Molecule imports atoms
- **WHEN** a molecule component is created
- **THEN** it SHALL import its constituent parts from `@/components/atoms/*`

### Requirement: Import rules — organisms
Components in `organisms/` SHALL compose molecules and atoms into complex sections. They MAY import from `molecules/*`, `atoms/*`, `store/*`, and `lib/*`.

#### Scenario: Organism imports molecules
- **WHEN** an organism component is created
- **THEN** it SHALL import from `@/components/molecules/*` or `@/components/atoms/*`

### Requirement: Vanilla Tailwind styling (no UI library)
All components SHALL use vanilla Tailwind utility classes directly. No `ui/` directory or shadcn wrappers SHALL exist. There is no UI library abstraction layer — atoms are the primitives.

#### Scenario: Atom uses Tailwind directly
- **WHEN** an atom component needs styling
- **THEN** it SHALL use Tailwind utility classes in `className` attributes

### Requirement: cn() utility
The project SHALL provide a `cn()` utility function in `src/lib/utils.ts` that joins class names, filtering out falsy values. Components SHALL use `cn()` for conditional class composition.

#### Scenario: cn() joins classes
- **WHEN** `cn("text-lg", isActive && "font-bold", undefined)` is called
- **THEN** it SHALL return `"text-lg font-bold"`

### Requirement: React component conventions
React components in this project SHALL follow these conventions:
- Use `export function ComponentName(...)` (no arrow functions, no `React.FC`)
- Use `import * as React from "react"` namespace import
- Use double quotes for string literals
- No semicolons
- Use `@/` path aliases for cross-directory imports

#### Scenario: Component uses namespace import
- **WHEN** a React component imports React
- **THEN** it SHALL use `import * as React from "react"`

#### Scenario: Component uses function declaration
- **WHEN** a React component is defined
- **THEN** it SHALL use `export function ComponentName(...)` syntax
