import type { ArtCurator, ListParams, Paginated } from "@/lib/api/types"
import { apiFetch } from "@/lib/api/client"

export function list(params: ListParams = {}): Promise<Paginated<ArtCurator>> {
  const search = new URLSearchParams()
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) search.set("page_size", String(params.page_size))
  const qs = search.toString()
  return apiFetch<Paginated<ArtCurator>>(`/apis/artworks/art-curators/${qs ? `?${qs}` : ""}`)
}

export function detail(id: number): Promise<ArtCurator> {
  return apiFetch<ArtCurator>(`/apis/artworks/art-curators/${id}/`)
}
