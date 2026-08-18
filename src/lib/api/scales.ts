import type { ListParams, Paginated, Scale } from "@/lib/api/types"
import { apiFetch } from "@/lib/api/client"

export function list(params: ListParams = {}): Promise<Paginated<Scale>> {
  const search = new URLSearchParams()
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) search.set("page_size", String(params.page_size))
  const qs = search.toString()
  return apiFetch<Paginated<Scale>>(`/apis/artworks/scales/${qs ? `?${qs}` : ""}`)
}

export function detail(id: number): Promise<Scale> {
  return apiFetch<Scale>(`/apis/artworks/scales/${id}/`)
}
