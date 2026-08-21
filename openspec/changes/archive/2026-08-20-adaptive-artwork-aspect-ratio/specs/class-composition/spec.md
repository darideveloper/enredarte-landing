# class-composition Specification

## Purpose
Defines the behavior of the shared `cn` utility, which composes Tailwind utility classes so that later classes reliably override earlier conflicting ones.

## ADDED Requirements

### Requirement: Merge conflicting Tailwind utilities (last-wins)
The `cn` utility SHALL compose its arguments using `clsx` and de-duplicate conflicting Tailwind utility classes with `tailwind-merge`, so that when the same utility group (e.g. `h-*`, `object-*`, `aspect-*`) appears more than once, the later occurrence wins.

#### Scenario: Conflicting height utilities
- **GIVEN** `cn` is called with `"h-full"` then `"h-auto"`
- **THEN** the returned class string contains only `h-auto` (the later utility) and not `h-full`.

#### Scenario: Non-conflicting classes are preserved
- **GIVEN** `cn` is called with `"p-4"` and `"text-ink"`
- **THEN** the returned class string contains both `p-4` and `text-ink`.

#### Scenario: Falsy arguments are ignored
- **GIVEN** `cn` is called with `false`, `undefined`, and `"w-full"`
- **THEN** the returned class string contains only `w-full` and no empty/`false` entries.

### Requirement: Preserve string and boolean argument behavior
The `cn` utility SHALL keep accepting the same argument types it accepts today (strings and booleans) so existing callers continue to work without modification.

#### Scenario: Existing callers unchanged
- **GIVEN** an existing component passes strings and conditional booleans to `cn`
- **THEN** the utility returns a single space-joined string with the truthy classes included.
