import type { Format, ListParams, Paginated } from "@/lib/api/types"
import { apiFetch } from "@/lib/api/client"

export function list(params: ListParams = {}): Promise<Paginated<Format>> {
  const search = new URLSearchParams()
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) search.set("page_size", String(params.page_size))
  const qs = search.toString()
  return apiFetch<Paginated<Format>>(`/apis/artworks/formats/${qs ? `?${qs}` : ""}`)
}

export function detail(id: number): Promise<Format> {
  return apiFetch<Format>(`/apis/artworks/formats/${id}/`)
}
