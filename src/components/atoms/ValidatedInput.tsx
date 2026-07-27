import * as React from "react"
import { Input } from "@/components/atoms/Input"
import { useField } from "@/store/useField"

interface ValidatedInputProps {
  field: string
  label: string
  placeholder?: string
  type?: string
}

export function ValidatedInput({ field, label, placeholder, type }: ValidatedInputProps) {
  const { value, error, setValue, mounted } = useField(field)

  return (
    <Input
      label={label}
      type={type}
      placeholder={placeholder}
      value={mounted ? (value as string) || "" : ""}
      error={error}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
