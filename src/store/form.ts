import { create } from "zustand"
import { persist } from "zustand/middleware"
import { z } from "zod"

function buildFieldSchemaMap(schemas: z.ZodObject<any>[]): Map<string, z.ZodTypeAny> {
  const map = new Map<string, z.ZodTypeAny>()
  for (const schema of schemas) {
    for (const [field, fieldSchema] of Object.entries(schema.shape)) {
      if (map.has(field)) throw new Error(`Field "${field}" appears in multiple schemas`)
      map.set(field, fieldSchema as z.ZodTypeAny)
    }
  }
  return map
}

const exampleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
})

export type FormValues = z.infer<typeof exampleSchema>
export const fieldSchemaMap = buildFieldSchemaMap([exampleSchema])

const initialState = {
  name: "",
  email: "",
}

interface FormStore extends FormValues {
  errors: Record<string, string>
  isLoading: boolean
  setField: (field: string, value: unknown) => void
  validateAll: () => boolean
  reset: () => void
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      errors: {},
      isLoading: false,

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
          return { ...state, [field]: value, errors: newErrors } as FormStore
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

      reset: () => set({ ...initialState, errors: {} } as FormStore),
    }),
    {
      name: "enredarte-form-storage",
      partialize: (state) => {
        const { errors, isLoading, ...rest } = state
        return rest
      },
    }
  )
)
