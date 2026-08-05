import * as React from "react"
import { cn } from "@/lib/utils"
import { useField as defaultUseField } from "@/store/useField"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field: string
  useField?: (field: string) => {
    value: unknown
    error?: string
    setValue: (v: unknown) => void
    mounted: boolean
  }
  label?: string
}

export function Input({ field, useField = defaultUseField, label, className, ...props }: InputProps) {
  const { value, error, setValue, mounted } = useField(field)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className={cn("text-sm font-medium", error ? "text-red-500" : "text-gray-700")}>
          {label}
        </label>
      )}
      <input
        className={cn(
          "h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none",
          "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className,
        )}
        {...props}
        value={mounted ? (value as string) || "" : ""}
        onChange={(e) => setValue(e.target.value)}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
