---
created: 2026-07-26
updated: 2026-07-26
tags:
  - astro
  - react
  - architecture
  - components
  - atomic-design
  - documentation
type: resource
status: active
---

# Atomic Component Hierarchy

Organise components in a 4-tier atomic hierarchy. Each tier has strict import rules that prevent circular dependencies and keep the architecture predictable.

The hierarchy works whether you use **vanilla components** (plain Astro/React + Tailwind) or a **UI library** (shadcn, Radix, etc.).

## The Hierarchy

```
src/components/
  ui/          (optional) Raw UI library primitives — only present when using shadcn, Radix, etc.
  atoms/       Smallest standalone components — either self-contained vanilla or wrappers around ui/
  molecules/   Combinations of atoms
  organisms/   Complex sections (maps to screen regions)
```

**Without UI library (vanilla only):**

```
┌──────────────────────────────────────────────────┐
│                    Organisms                       │
│  ┌────────────────────────────────────────────┐  │
│  │              Molecules                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │  Atom    │ │  Atom    │ │  Atom    │   │  │
│  │  │(vanilla) │ │(vanilla) │ │(vanilla) │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘   │  │
│  │   All atoms = self-contained components    │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**With UI library (e.g. shadcn):**

```
┌──────────────────────────────────────────────────┐
│                    Organisms                       │
│  ┌────────────────────────────────────────────┐  │
│  │              Molecules                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │  Atom    │ │  Atom    │ │  Atom    │   │  │
│  │  │(stateful)│ │(wrapper) │ │(stateful)│   │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘   │  │
│  │       │            │            │          │  │
│  │       └────────────┼────────────┘          │  │
│  │               ui/ (shadcn)                  │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## Import Rules

**Vanilla only (no `ui/`):**

| Tier | Can import from |
|---|---|
| `atoms/*` | `store/*`, `lib/*` |
| `molecules/*` | `atoms/*`, `store/*`, `lib/*` |
| `organisms/*` | `molecules/*`, `atoms/*`, `store/*`, `lib/*` |

Atoms are self-contained — they import from store/lib directly and build their own markup with Tailwind.

**With UI library (`ui/` present):**

| Tier | Can import from |
|---|---|
| `ui/*` | Nothing from `components/` (raw primitives only) |
| `atoms/*` | `ui/*`, `store/*`, `lib/*` |
| `molecules/*` | `atoms/*`, `store/*`, `lib/*` |
| `organisms/*` | `molecules/*`, `atoms/*`, `store/*`, `lib/*` |

**Golden rule:** `atoms/*` is the only tier that imports from `ui/*`. Molecules and organisms import from atoms, never from ui.

## 1. `ui/` — Raw UI Library Primitives (Optional)

Only exists when using a third-party component library. Never import from `ui/` outside of `atoms/`.

### shadcn

```bash
pnpx shadcn init
pnpx shadcn add button checkbox input label radio-group select textarea
```

Generated files live in `src/components/ui/`. Do not edit directly — reinstall from shadcn if you need updates.

Contains: `button.tsx`, `checkbox.tsx`, `input.tsx`, `label.tsx`, `radio-group.tsx`, `select.tsx`, `textarea.tsx`.

### Other libraries

Same pattern — put their re-exported/adapted primitives in `ui/`:
- Radix UI primitives
- Headless UI
- Ark UI
- Custom primitive library

## 2. `atoms/` — Two Approaches

### Vanilla Atoms (no UI library)

Self-contained components that use Tailwind directly. No wrapper layer needed — the atom IS the primitive.

```tsx
// src/components/atoms/Input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2 p-2">
      {label && (
        <label className={cn("text-sm font-medium", error ? "text-red-500" : "text-foreground")}>
          {label}
        </label>
      )}
      <input
        className={cn(
          "h-8 w-full rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-base transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
          error ? "border-red-500" : "",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium italic">{error}</span>}
    </div>
  )
}
```

```tsx
// src/components/atoms/ValidatedInput.tsx (vanilla)
import * as React from "react"
import { Input } from "@/components/atoms/Input"  // the vanilla Input above
import { useField } from "@/store/useField"

interface ValidatedInputProps {
  field: string
  label: string
}

export function ValidatedInput({ field, label }: ValidatedInputProps) {
  const { value, error, setValue, mounted } = useField(field)
  return (
    <Input
      label={label}
      value={mounted ? (value as string) || "" : ""}
      error={error}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
```

### UI Library Atoms (with `ui/`)

Two sub-tiers: **presentation wrappers** (thin re-exports from `ui/`) and **stateful atoms** (bind wrappers + store).

**Presentation wrapper** — creates a stable import path so molecules never touch `ui/` directly:

```tsx
// src/components/atoms/Input.tsx
export { Input } from "@/components/ui/input"
```

One-liners. Every `ui/` component gets a matching wrapper in `atoms/`.

**Stateful atom** — wraps a presentation wrapper + Zustand binding:

```tsx
// src/components/atoms/ValidatedInput.tsx (with shadcn)
import * as React from "react"
import { Label } from "@/components/atoms/Label"
import { Input } from "@/components/atoms/Input"
import { useField } from "@/store/useField"
import { cn } from "@/lib/utils"

export function ValidatedInput({ field, label, className, ...props }: ValidatedInputProps) {
  const { value, error, setValue, mounted } = useField(field)
  return (
    <div className="flex flex-col gap-2 p-2">
      <Label htmlFor={field} className={cn(error ? "text-red-500" : "")}>{label}</Label>
      <Input
        id={field}
        value={mounted ? (value as string) || "" : ""}
        onChange={(e) => setValue(e.target.value)}
        className={cn(error ? "border-red-500" : "", className)}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium italic">{error}</span>}
    </div>
  )
}
```

Common stateful atoms: `ValidatedInput`, `ValidatedRadioGroup`, `ValidatedSelect`, `ValidatedTextarea`, `ValidatedCheckboxGroup`, `ContinueButton`, `ProgressBar`, `DisclaimerCheckbox`.

### Which approach to pick?

| Vanilla atoms | UI library atoms |
|---|---|
| No extra dependency | Richer primitives (accessible by default) |
| Full control over markup | Faster to build complex UIs |
| More boilerplate per component | Swap themes via library config |
| Best for small projects or custom design | Best for large projects with design systems |

You can also **mix** — use shadcn for complex inputs (select, radio, checkbox) and vanilla for simple ones.

## 3. `molecules/` — Combinations of Atoms

Combine multiple atoms (vanilla or library-based) into a reusable unit. They never import from `ui/` — only from `atoms/`.

```tsx
// src/components/molecules/DynamicLabelRadioGroup.tsx
import * as React from "react"
import { ValidatedRadioGroup } from "@/components/atoms/ValidatedRadioGroup"
import { useFormStore } from "@/store/form"
import type { FormValues } from "@/store/form"

interface Option {
  value: string
  label: string
}

interface DynamicLabelRadioGroupProps {
  field: keyof FormValues | string
  options: Option[]
  labelTemplate: string
  labelFields: (keyof FormValues)[]
  fallbackLabel: string
}

export function DynamicLabelRadioGroup({
  field,
  options,
  labelTemplate,
  labelFields,
  fallbackLabel,
}: DynamicLabelRadioGroupProps) {
  const fieldValues = useFormStore((state) => {
    const subset: Record<string, unknown> = {}
    for (const f of labelFields) subset[f as string] = state[f]
    return subset
  })

  const label = React.useMemo(() => {
    const allPresent = labelFields.every(f => fieldValues[f as string])
    if (!allPresent) return fallbackLabel
    let result = labelTemplate
    for (const f of labelFields) result = result.replace(`{${String(f)}}`, String(fieldValues[f as string]))
    return result
  }, [fieldValues, labelTemplate, labelFields, fallbackLabel])

  return <ValidatedRadioGroup field={field} label={label} options={options} />
}
```

Common molecules: `AuthGuard`, `DynamicLabelRadioGroup`, `SupportCircleRepeater`, `GlobalLoader`, `LoadingOverlay`, `GenerationProgressBar`.

## 4. `organisms/` — Complex Sections

Used for screen regions that compose multiple molecules. Only when a page needs more structure than a single molecule provides.

```tsx
// src/components/organisms/Step3Form.tsx
import * as React from "react"
import { ValidatedRadioGroup } from "@/components/atoms/ValidatedRadioGroup"
import { ValidatedCheckboxGroup } from "@/components/atoms/ValidatedCheckboxGroup"
import { ValidatedInput } from "@/components/atoms/ValidatedInput"
import { useFormStore } from "@/store/form"

export function Step3Form() {
  const ourlensCompleted = useFormStore(state => state.ourlens_completed)

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      <ValidatedRadioGroup field="home_type" label="Home type?" options={homeTypeOptions} />
      <ValidatedRadioGroup field="ourlens_completed" label="Completed safety scan?" options={ourlensOptions} />
      {ourlensCompleted === "yes" && (
        <ValidatedCheckboxGroup field="hazard_flags" label="Hazards found?" options={hazardOptions} />
      )}
      <ValidatedInput field="hobbies_social" label="Hobbies?" placeholder="e.g., gardening, church" />
    </div>
  )
}
```

## 5. New Project Setup

### Vanilla only

```bash
mkdir -p src/components/{atoms,molecules,organisms}
```

Each atom is a self-contained component with Tailwind styles. No `ui/` directory needed.

### With shadcn

```bash
mkdir -p src/components/{ui,atoms,molecules,organisms}
pnpx shadcn init
pnpx shadcn add button checkbox input label radio-group select textarea
```

For each shadcn component, create a matching presentation wrapper in `atoms/`.

## 6. Consistency Rules

- Atoms in `atoms/*` MAY import from `store/*` and `lib/*`
- Molecules MUST NOT import from `ui/*` — only from `atoms/*`
- Organisms MUST NOT import from `ui/*` — only from `molecules/*` and `atoms/*`
- `ui/*` imports nothing from `components/` — it's the bottom of the dependency tree
- If you remove the UI library, only `atoms/*` needs changes — everything above stays the same

## 7. Connection to Other Patterns

- Atoms use `useField()` from Zustand store → see [[astro-zustand-zod]]
- Astro pages host organisms → see [[astro-react-islands]]
