# stateful-atom-by-default Specification

## Purpose

Codifies that in a vanilla-only project (no `ui/` directory), atomic components SHALL be self-contained and bind directly to the Zustand store, with the store hook and field key injectable via props. The two-tier `Input` + `ValidatedInput` wrapper pattern is the exception reserved for UI-library projects, not the default.

## Requirements

### Requirement: Vanilla atoms are store-bound by default
A vanilla atom that represents interactive state (e.g. an input) SHALL manage its own Zustand data directly rather than delegating to a separate stateful wrapper component.

#### Scenario: Atom manages its own state
- **WHEN** an atom component needs to read or write store state
- **THEN** it SHALL import the store machinery directly (e.g. via `useField`) and SHALL NOT require a separate `Validated*` wrapper to function

#### Scenario: No Validated wrapper needed
- **WHEN** a consumer renders a form field in a vanilla project
- **THEN** it SHALL use the atom directly (e.g. `<Input field="email" ... />`) without wrapping it in a `ValidatedInput`-style component

### Requirement: Injectable store hook
The atom SHALL accept the store-binding hook and field/store key via props so it can connect to whichever store the consumer selects (Option 1: dynamic store from props).

#### Scenario: Custom hook injected
- **WHEN** a consumer passes a custom `useField` hook (or store selector) and a `field` key to the atom
- **THEN** the atom SHALL bind to that store for the given field, returning value, error, and setter from it

#### Scenario: Default hook used
- **WHEN** a consumer omits the hook prop
- **THEN** the atom SHALL fall back to the project default `useField()` hook

### Requirement: UI-library projects use wrappers
The two-tier wrapper pattern (presentational atom + stateful wrapper) SHALL be documented as the approach for projects using generated local UI-library primitives (shadcn, Radix), where primitives are reinstalled and must not be edited directly.

#### Scenario: Wrapper pattern documented for UI libraries
- **WHEN** the docs describe projects with a `ui/` directory
- **THEN** they SHALL prescribe the wrapper tier (presentational re-export + stateful atom) instead of self-bound atoms

#### Scenario: Vanilla projects exclude the wrapper tier
- **WHEN** the docs describe vanilla-only projects (no `ui/`)
- **THEN** they SHALL prescribe self-bound atoms and SHALL NOT present the wrapper tier as the default

### Requirement: Store machinery unchanged
The shared store (`src/store/form.ts`), the `useField` hook (`src/store/useField.ts`), and their dependencies (`zustand`, `zod`) SHALL remain the single source of store state and validation. Each distinct store SHALL expose one shared `useField`-style hook; atoms SHALL NOT define their own per-component stores or duplicated state.

#### Scenario: Store remains shared
- **WHEN** multiple atoms bind to the same store
- **THEN** they SHALL all read/write that store via the same shared hook, with no duplicated store definitions

#### Scenario: Second store is allowed
- **WHEN** a consumer binds an atom to a different store (e.g. a prefs/filters store) via the injectable hook prop
- **THEN** that store SHALL follow the same pattern (single shared hook, persisted state) and SHALL NOT require per-component store definitions
