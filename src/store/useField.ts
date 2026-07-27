import * as React from "react"
import { useFormStore } from "./form"

export function useField(field: string) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const value = useFormStore((state) => state[field as keyof typeof state])
  const error = useFormStore((state) => state.errors[field])
  const setField = useFormStore((state) => state.setField)

  const setValue = React.useCallback((v: unknown) => setField(field, v), [field, setField])

  return { value, error, setValue, mounted }
}
