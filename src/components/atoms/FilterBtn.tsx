import * as React from "react"
import { cn } from "@/lib/utils"
import { useCatalogStore, type GroupKey } from "@/store/catalog"

export interface FilterBtnProps {
  group: GroupKey
  value: string
  label: string
  disabled?: boolean
  className?: string
}

export function FilterBtn({ group, value, label, disabled = false, className }: FilterBtnProps) {
  const active = useCatalogStore((state) => state.selections[group].includes(value))
  const toggle = useCatalogStore((state) => state.toggle)
  const isDisabled = disabled && !active

  return (
    <button
      type="button"
      data-value={value}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      onClick={() => toggle(group, value)}
      className={cn(
        "text-[10px] tracking-[0.06em] uppercase px-[18px] py-[9px] transition-all duration-200 font-sans border shrink-0",
        isDisabled
          ? "border-border-theme text-muted bg-transparent opacity-40 cursor-not-allowed"
          : active
            ? "border-crimson text-ink bg-white cursor-pointer"
            : "border-border-theme text-muted bg-transparent cursor-pointer hover:border-crimson hover:text-ink hover:bg-white",
        className
      )}
    >
      {label}
    </button>
  )
}
