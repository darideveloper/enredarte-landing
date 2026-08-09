import * as React from "react"
import { cn } from "@/lib/utils"
import { useCatalogStore } from "@/store/catalog"
import type { GroupKey } from "@/data/catalog"

export interface FilterBtnProps {
  group: GroupKey
  value: string
  label: string
  className?: string
}

export function FilterBtn({ group, value, label, className }: FilterBtnProps) {
  const active = useCatalogStore((state) => state.selections[group].includes(value))
  const toggle = useCatalogStore((state) => state.toggle)

  return (
    <button
      type="button"
      data-value={value}
      onClick={() => toggle(group, value)}
      className={cn(
        "text-[10px] tracking-[0.06em] uppercase px-[18px] py-[9px] cursor-pointer transition-all duration-200 font-sans border shrink-0",
        active
          ? "border-crimson text-ink bg-white"
          : "border-border-theme text-muted bg-transparent hover:border-crimson hover:text-ink hover:bg-white",
        className
      )}
    >
      {label}
    </button>
  )
}
