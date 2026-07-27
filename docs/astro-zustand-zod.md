---
created: 2026-07-26
updated: 2026-07-26
tags:
  - astro
  - zustand
  - zod
  - state-management
  - validation
  - documentation
type: resource
status: active
---

# Zustand + Persist + Zod

Zustand is the **primary state sharing layer** for all React islands in the project. Every component connects directly to Zustand — no prop drilling, no React context, no Redux. Zod handles all validation at the field level. `persist` middleware writes to localStorage so data survives page reloads and across Astro page navigations.

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                    Astro Pages                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Page A  │  │  Page B  │  │  Page C  │             │
│  │ (page)   │  │ (page)   │  │ (page)   │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │              │              │                    │
│  ┌────┴──────────────┴──────────────┴────┐              │
│  │         Zustand Stores (persisted)      │             │
│  │  ┌──────────┐  ┌──────────┐           │             │
│  │  │ FormState│  │ Session  │           │             │
│  │  │ (form.ts)│  │(session.ts)          │             │
│  │  └──────────┘  └──────────┘           │             │
│  └──────────────────┬────────────────────┘             │
│                     │                                    │
│  ┌──────────────────┴────────────────────┐              │
│  │          React Islands                  │             │
│  │   Each atom reads/writes via useField() │             │
│  └─────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────┘
```

## 1. Store Pattern

A single Zustand store holds all form data, errors, and loading state. `persist` middleware writes to localStorage. Every field has a Zod schema — validation runs automatically on each `setField` call.

```ts
// src/store/form.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'

// 1. Define Zod schemas for your data
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "editor", "viewer"]),
})

const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  notifications: z.boolean(),
  tags: z.array(z.string()),
})

// 2. Build union type
export type FormValues = z.infer<typeof userSchema> & z.infer<typeof settingsSchema>

// 3. Auto-build field → schema map (enforces unique field names across all schemas)
export const fieldSchemaMap = buildFieldSchemaMap([userSchema, settingsSchema])

// 4. Create store
export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      errors: {},

      setField: (field: string, value: unknown) => {
        const fieldSchema = fieldSchemaMap.get(field)
        set((state) => {
          const newErrors = { ...state.errors }
          if (fieldSchema) {
            const validation = fieldSchema.safeParse(value)
            if (!validation.success) {
              newErrors[field] = validation.error.issues[0]?.message
            } else {
              delete newErrors[field]
            }
          }
          return { ...state, [field]: value, errors: newErrors }
        })
      },

      validateAll: () => {
        const state = get()
        const allErrors: Record<string, string> = {}
        for (const [fieldName, schema] of fieldSchemaMap) {
          const value = state[fieldName as keyof typeof state]
          const result = schema.safeParse(value)
          if (!result.success) {
            allErrors[fieldName] = result.error.issues[0]?.message
          }
        }
        set({ errors: allErrors })
        return Object.keys(allErrors).length === 0
      },

      reset: () => set({ ...initialState, errors: {} }),
    }),
    {
      name: 'app-form-storage',
      partialize: (state) => {
        const { errors, isLoading, ...rest } = state  // don't persist transient state
        return rest
      },
    }
  )
)
```

### `buildFieldSchemaMap` helper

```ts
export function buildFieldSchemaMap(schemas: z.ZodObject<any>[]): Map<string, z.ZodTypeAny> {
  const map = new Map<string, z.ZodTypeAny>()
  for (const schema of schemas) {
    for (const [field, fieldSchema] of Object.entries(schema.shape)) {
      if (map.has(field)) {
        throw new Error(`Field "${field}" appears in multiple schemas. Field names must be unique.`)
      }
      map.set(field, fieldSchema as z.ZodTypeAny)
    }
  }
  return map
}
```

Field names are **automatically enforced as unique** across all schemas. If `name` appears in two schemas, the function throws at module load.

## 2. The `useField()` Hook

Every validated atom uses this hook to connect to the store. It handles:
- Reading the current value
- Reading validation errors
- Setting new values
- Hydration safety (prevents SSR/CSR mismatches)

```ts
// src/store/useField.ts
import * as React from "react"
import { useFormStore, getNestedValue, initialState } from "./form"

export function useField(field: string) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const isDotted = field.includes(".")  // e.g. "tags.0"
  const setField = useFormStore((state) => state.setField)

  const value = useFormStore((state) =>
    isDotted ? getNestedValue(state, field) : state[field as keyof typeof state]
  )
  const error = useFormStore((state) => state.errors[field])

  const setValue = React.useCallback((v: unknown) => setField(field, v), [field, setField])

  // Return initial/default before hydration to avoid undefined flashes
  let safeValue: unknown
  if (mounted) {
    safeValue = value
  } else if (isDotted) {
    safeValue = getNestedValue(initialState, field) ?? ""
  } else {
    safeValue = initialState[field as keyof typeof initialState]
  }

  return { value: safeValue, error, setValue, mounted }
}
```

## 3. Using in Components

**Stateful atom:**
```tsx
export function ValidatedInput({ field, label }: { field: string; label: string }) {
  const { value, error, setValue, mounted } = useField(field)

  return (
    <div>
      <Label>{label}</Label>
      <Input value={mounted ? (value as string) || "" : ""} onChange={e => setValue(e.target.value)} />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
}
```

**Non-validated component** (reads store directly):
```tsx
export function Sidebar() {
  const theme = useFormStore((state) => state.theme)
  return <div className={`theme-${theme}`}>...</div>
}
```

## 4. Full Validation (on Submit)

Use `validateAll()` when the user submits the form — runs all schemas at once and returns true/false:

```tsx
async function handleSubmit() {
  const store = useFormStore.getState()
  if (!store.validateAll()) return  // errors already set in store, components will show them

  const { errors, isLoading, validateAll, reset, setField, ...formData } = store
  await myApi.submit(formData)
}
```

## 5. Nested Data (Arrays of Objects)

For fields like `tags: string[]` or repeated sub-objects, use dotted paths:

```ts
setField("tags", ["gardening", "music"])                    // set entire array
setField("tags.0", "cooking")                                // update single index
```

For arrays of objects, nest deeper:

```ts
setField("members.0.name", "John")
setField("members.0.role", "admin")
```

The `getNestedValue()` and `setNestedValue()` utilities in `form.ts` handle dotted path resolution. The `useField()` hook works transparently with them.

## 6. Validation Flow

```
User types → setField(field, value) → fieldSchema.safeParse(value)
  → success: clear error for this field
  → failure: set error message from Zod issue

User clicks Submit → validateAll() → all schemas parsed at once
  → success: submit data, clear errors
  → failure: set errors for all invalid fields
```

Per-field validation is immediate (on every keystroke). Full validation is on-demand (when the user tries to proceed).

## 7. New Project Setup

```bash
pnpm add zustand zod
```

```bash
mkdir -p src/store
```

Define separate stores for separate concerns:

| Store | Purpose | Persisted? |
|---|---|---|
| `form.ts` | Form data, errors | Yes |
| `session.ts` | Auth tokens, session state | Yes (partial) |
| UI stores | Theme, modals, toasts | Optional |

## 8. Key Rules

- Components read store directly — no prop drilling, no React context wrappers
- Use `useField()` for validated form fields; `useFormStore()` directly for non-validated reads
- Never re-implement hydration safety — `useField()` handles it
- `partialize` in persist config strips transient state (errors, loading flags) from localStorage
- Multiple stores for separate concerns, but keep form data in one store for coherence
- Every `PUBLIC_*` field gets a Zod schema — validation is built into the store, not scattered across components

## 9. Connection to Other Patterns

- Validated atoms use `useField()` → see [[astro-atomic-components]]
- Fetch data in store actions using `safeFetch` → see [[astro-fetch-wrapper]]
- Astro pages host React islands that read from this store → see [[astro-react-islands]]
