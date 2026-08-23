import { create } from "zustand"
import { persist } from "zustand/middleware"

export type GroupKey =
  | "artist"
  | "discipline"
  | "technique"
  | "theme"
  | "format"
  | "scale"

const EMPTY_SELECTIONS: Record<GroupKey, string[]> = {
  artist: [],
  discipline: [],
  technique: [],
  theme: [],
  format: [],
  scale: [],
}

export type ArtworkFacets = Record<GroupKey, string[]>

export interface CatalogStore {
  selections: Record<GroupKey, string[]>
  isLoading: boolean
  isExpanded: boolean
  toggle: (group: GroupKey, value: string) => void
  toggleExpanded: () => void
  reset: () => void
}

export const useCatalogStore = create<CatalogStore>()(
  persist(
    (set) => ({
      selections: EMPTY_SELECTIONS,
      isLoading: false,
      isExpanded: false,

      toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),

      reset: () => {
        set({ selections: EMPTY_SELECTIONS, isLoading: true })
        setTimeout(() => set({ isLoading: false }), 400)
      },

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
  const reset = useCatalogStore((state) => state.reset)
  return { selections, isLoading, isExpanded, toggle, toggleExpanded, reset }
}

export function matchesArtwork(
  facets: ArtworkFacets,
  selections: Record<GroupKey, string[]>
): boolean {
  return (Object.keys(selections) as GroupKey[]).every((group) => {
    const selected = selections[group]
    if (selected.length === 0) return true
    const values = facets[group]
    return values != null && values.some((value) => selected.includes(value))
  })
}

export interface ViableGroup {
  key: GroupKey
  options: { value: string }[]
}

export function computeViableOptions(
  groups: ViableGroup[],
  facets: ArtworkFacets[],
  selections: Record<GroupKey, string[]>
): Map<GroupKey, Set<string>> {
  const viable = new Map<GroupKey, Set<string>>()
  for (const group of groups) {
    const values = new Set<string>()
    for (const option of group.options) {
      const candidate = { ...selections, [group.key]: [option.value] }
      if (facets.some((artwork) => matchesArtwork(artwork, candidate))) {
        values.add(option.value)
      }
    }
    viable.set(group.key, values)
  }
  return viable
}
