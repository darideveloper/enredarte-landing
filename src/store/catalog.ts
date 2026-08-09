import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { GroupKey } from "@/data/catalog"

const EMPTY_SELECTIONS: Record<GroupKey, string[]> = {
  artist: [],
  discipline: [],
  technique: [],
  theme: [],
  format: [],
  scale: [],
}

export type ArtworkFacets = Record<string, string | undefined>

export interface CatalogStore {
  selections: Record<GroupKey, string[]>
  isLoading: boolean
  isExpanded: boolean
  toggle: (group: GroupKey, value: string) => void
  toggleExpanded: () => void
}

export const useCatalogStore = create<CatalogStore>()(
  persist(
    (set) => ({
      selections: EMPTY_SELECTIONS,
      isLoading: false,
      isExpanded: false,

      toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),

      toggle: (group, value) => {
        set((state) => {
          const current = state.selections[group]
          const has = current.includes(value)
          const next = has
            ? current.filter((v) => v !== value)
            : [...current, value]
          return {
            selections: { ...state.selections, [group]: next },
            isLoading: true,
          }
        })
        setTimeout(() => set({ isLoading: false }), 400)
      },
    }),
    {
      name: "enredarte-catalog-storage",
      partialize: (state) => ({
        selections: state.selections,
        isExpanded: state.isExpanded,
      }),
    }
  )
)

export function useCatalog() {
  const selections = useCatalogStore((state) => state.selections)
  const isLoading = useCatalogStore((state) => state.isLoading)
  const isExpanded = useCatalogStore((state) => state.isExpanded)
  const toggle = useCatalogStore((state) => state.toggle)
  const toggleExpanded = useCatalogStore((state) => state.toggleExpanded)
  return { selections, isLoading, isExpanded, toggle, toggleExpanded }
}

export function matchesArtwork(
  facets: ArtworkFacets,
  selections: Record<GroupKey, string[]>
): boolean {
  return (Object.keys(selections) as GroupKey[]).every((group) => {
    const selected = selections[group]
    if (selected.length === 0) return true
    const value = facets[group]
    return value != null && selected.includes(value)
  })
}
