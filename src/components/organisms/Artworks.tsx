import * as React from "react"
import { cn } from "@/lib/utils"
import { matchesArtwork, useCatalogStore, type ArtworkFacets, type GroupKey } from "@/store/catalog"

const GROUP_KEYS: GroupKey[] = ["artist", "discipline", "technique", "theme", "format", "scale"]

export interface ArtworksProps {
  children: React.ReactNode
  loadingLabel?: string
  emptyLabel?: string
  resetLabel?: string
  gridClassName?: string
  className?: string
}

export function Artworks({
  children,
  loadingLabel = "Cargando…",
  emptyLabel = "Ninguna obra corresponde a su búsqueda. Le invitamos a afinar su selección.",
  resetLabel = "Empezar de nuevo",
  gridClassName,
  className,
}: ArtworksProps) {
  const gridRef = React.useRef<HTMLDivElement>(null)
  const selections = useCatalogStore((state) => state.selections)
  const isLoading = useCatalogStore((state) => state.isLoading)
  const reset = useCatalogStore((state) => state.reset)
  const [hasVisibleCards, setHasVisibleCards] = React.useState(true)

  React.useEffect(() => {
    if (isLoading) return
    const grid = gridRef.current
    if (!grid) return
    const cards = grid.querySelectorAll<HTMLElement>("[data-artist]")
    let visible = 0
    for (const card of cards) {
      const facets = {} as ArtworkFacets
      for (const key of GROUP_KEYS) {
        facets[key] = (card.dataset[key] ?? "").split(" ").filter(Boolean)
      }
      const matches = matchesArtwork(facets, selections)
      card.hidden = !matches
      if (matches) visible += 1
    }
    setHasVisibleCards(visible > 0)
  }, [selections, isLoading])

  return (
    <div className="relative">
      <div
        ref={gridRef}
        className={cn("grid gap-[3px]", gridClassName ?? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", className)}
      >
        {children}
      </div>
      {!hasVisibleCards && !isLoading && (
        <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
          <span className="text-[10px] tracking-[0.06em] uppercase text-muted">{emptyLabel}</span>
          <button
            type="button"
            onClick={reset}
            className="text-[10px] tracking-[0.06em] uppercase px-[18px] py-[9px] cursor-pointer transition-all duration-200 font-sans border shrink-0 border-border-theme text-muted bg-transparent hover:border-crimson hover:text-ink hover:bg-white"
          >
            {resetLabel}
          </button>
        </div>
      )}
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
