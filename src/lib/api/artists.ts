import type { Artist, ListParams, Paginated } from "@/lib/api/types"
import { apiFetch } from "@/lib/api/client"

export function list(params: ListParams = {}): Promise<Paginated<Artist>> {
  const search = new URLSearchParams()
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) search.set("page_size", String(params.page_size))
  const qs = search.toString()
  return apiFetch<Paginated<Artist>>(`/apis/artworks/artists/${qs ? `?${qs}` : ""}`)
}

export function detail(id: number): Promise<Artist> {
  return apiFetch<Artist>(`/apis/artworks/artists/${id}/`)
}
