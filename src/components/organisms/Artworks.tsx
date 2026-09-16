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
  limit?: number
}

/**
 * Pure filter-then-cap-tail pass over raw `data-*` attribute values (DOM order).
 * Returns per-card hidden flags plus whether any card matched (drives the empty state;
 * the cap itself never empties the grid). Exported for verification.
 */
export function computeVisibility(
  rawFacets: Record<GroupKey, string>[],
  selections: Record<GroupKey, string[]>,
  limit?: number,
): { hidden: boolean[]; hasVisible: boolean } {
  const matching = rawFacets.map((raw) => {
    const facets = {} as ArtworkFacets
    for (const key of GROUP_KEYS) {
      facets[key] = (raw[key] ?? "").split(" ").filter(Boolean)
    }
    return matchesArtwork(facets, selections)
  })
  const visibleIndexes = new Set(
    (limit != null
      ? matching
          .map((matches, index) => (matches ? index : -1))
          .filter((index) => index >= 0)
          .slice(-limit)
      : matching
          .map((matches, index) => (matches ? index : -1))
          .filter((index) => index >= 0)),
  )
  return {
    hidden: matching.map((_, index) => !visibleIndexes.has(index)),
    hasVisible: matching.some(Boolean),
  }
}

export function Artworks({
  children,
  loadingLabel = "Cargando…",
  emptyLabel = "Ninguna obra corresponde a su búsqueda. Le invitamos a afinar su selección.",
  resetLabel = "Empezar de nuevo",
  gridClassName,
  className,
  limit,
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
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-artist]"))
    const rawFacets = cards.map((card) => {
      const raw = {} as Record<GroupKey, string>
      for (const key of GROUP_KEYS) {
        raw[key] = card.dataset[key] ?? ""
      }
      return raw
    })
    const { hidden, hasVisible } = computeVisibility(rawFacets, selections, limit)
    cards.forEach((card, index) => {
      card.hidden = hidden[index]
    })
    setHasVisibleCards(hasVisible)
  }, [selections, isLoading, limit])

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
