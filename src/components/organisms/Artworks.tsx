import * as React from "react"
import { cn } from "@/lib/utils"
import { matchesArtwork, useCatalogStore } from "@/store/catalog"

export interface ArtworksProps {
  children: React.ReactNode
  loadingLabel?: string
  className?: string
}

export function Artworks({ children, loadingLabel = "Cargando…", className }: ArtworksProps) {
  const gridRef = React.useRef<HTMLDivElement>(null)
  const selections = useCatalogStore((state) => state.selections)
  const isLoading = useCatalogStore((state) => state.isLoading)

  React.useEffect(() => {
    if (isLoading) return
    const grid = gridRef.current
    if (!grid) return
    const cards = grid.querySelectorAll<HTMLElement>("[data-artist]")
    for (const card of cards) {
      card.hidden = !matchesArtwork(card.dataset, selections)
    }
  }, [selections, isLoading])

  return (
    <div className="relative">
      <div
        ref={gridRef}
        className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[3px]", className)}
      >
        {children}
      </div>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-paper/80">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-crimson border-t-transparent" />
            <span className="text-[10px] tracking-[0.06em] uppercase text-muted">{loadingLabel}</span>
          </div>
        </div>
      )}
    </div>
  )
}
