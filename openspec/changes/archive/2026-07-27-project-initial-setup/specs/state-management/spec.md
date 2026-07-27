## ADDED Requirements

### Requirement: Zustand store with Zod validation
The project SHALL use Zustand for state management with Zod schemas for per-field validation. A `buildFieldSchemaMap()` helper SHALL extract individual field schemas from Zod object schemas and enforce unique field names across all schemas.

#### Scenario: Field validation on set
- **WHEN** `setField("email", "invalid")` is called
- **THEN** the store SHALL set `errors.email` to the Zod validation error message

#### Scenario: Valid field clears error
- **WHEN** `setField("email", "valid@example.com")` is called after a previous validation error
- **THEN** `errors.email` SHALL be deleted

#### Scenario: Duplicate field name throws
- **WHEN** `buildFieldSchemaMap` receives two schemas with the same field name
- **THEN** it SHALL throw an error

### Requirement: Persist middleware
The store SHALL use Zustand's `persist` middleware to write form data to localStorage. Transient state (errors, loading flags) SHALL be excluded from persistence via `partialize`.

#### Scenario: Form data survives page reload
- **WHEN** a user fills form fields and reloads the page
- **THEN** the persisted fields SHALL retain their values

### Requirement: useField hook
The project SHALL provide a `useField(field)` hook that abstracts reading/writing a single validated field. It SHALL handle hydration safety by returning initial values before the first `useEffect` runs.

#### Scenario: Hook returns value and error
- **WHEN** `useField("email")` is called in a React component
- **THEN** it SHALL return `{ value, error, setValue, mounted }` where `value` is the current store value and `error` is the validation error string or undefined

#### Scenario: Hydration safety prevents undefined flash
- **WHEN** a React component renders with `useField("email")` before hydration
- **THEN** `mounted` SHALL be `false` and `value` SHALL be the initial/empty value, not `undefined`

### Requirement: validateAll for submission
The store SHALL provide a `validateAll()` method that runs all field schemas and returns `true` if all are valid, `false` otherwise. Errors SHALL be set in the store for all invalid fields.

#### Scenario: validateAll returns false with invalid fields
- **WHEN** `validateAll()` is called and some fields are invalid
- **THEN** it SHALL return `false` and all error messages SHALL be set in the store

#### Scenario: validateAll returns true with valid fields
- **WHEN** `validateAll()` is called and all fields are valid
- **THEN** it SHALL return `true`

### Requirement: Reset
The store SHALL provide a `reset()` method that clears all field values and errors back to initial state.

#### Scenario: Reset clears all data
- **WHEN** `reset()` is called
- **THEN** all field values SHALL return to their initial values and errors SHALL be cleared
