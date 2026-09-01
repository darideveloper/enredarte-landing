import { cn } from "@/lib/utils"
import { useCatalogStore } from "@/store/catalog"

export interface FilterToggleProps {
  label: string
  className?: string
}

export function FilterToggle({ label, className }: FilterToggleProps) {
  const isExpanded = useCatalogStore((state) => state.isExpanded)
  const toggleExpanded = useCatalogStore((state) => state.toggleExpanded)

  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      aria-controls="catalog-filters"
      onClick={() => toggleExpanded()}
      className={cn(
        "text-[10px] tracking-[0.06em] uppercase px-[18px] py-[9px] cursor-pointer transition-all duration-200 font-sans border shrink-0",
        "border-border-theme text-muted bg-transparent hover:border-crimson hover:text-ink hover:bg-white",
        className
      )}
    >
      {label}
    </button>
  )
}
