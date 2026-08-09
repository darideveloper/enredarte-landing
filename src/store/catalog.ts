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
  toggle: (group: GroupKey, value: string) => void
}

export const useCatalogStore = create<CatalogStore>()(
  persist(
    (set) => ({
      selections: EMPTY_SELECTIONS,
      isLoading: false,

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
      partialize: (state) => ({ selections: state.selections }),
    }
  )
)

export function useCatalog() {
  const selections = useCatalogStore((state) => state.selections)
  const isLoading = useCatalogStore((state) => state.isLoading)
  const toggle = useCatalogStore((state) => state.toggle)
  return { selections, isLoading, toggle }
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
