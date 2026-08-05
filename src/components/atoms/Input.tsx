// DUMMY COMPONENT
// Placeholder mirroring docs/astro-atomic-components.md (vanilla atom example).
// Not used by any page or feature. Recreate the real Input only when a form is built.
import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
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
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
