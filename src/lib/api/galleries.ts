import type { Gallery, ListParams, Paginated } from "@/lib/api/types"
import { apiFetch } from "@/lib/api/client"

export function list(params: ListParams = {}): Promise<Paginated<Gallery>> {
  const search = new URLSearchParams()
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) search.set("page_size", String(params.page_size))
  const qs = search.toString()
  return apiFetch<Paginated<Gallery>>(`/apis/artworks/galleries/${qs ? `?${qs}` : ""}`)
}

export function detail(id: number): Promise<Gallery> {
  return apiFetch<Gallery>(`/apis/artworks/galleries/${id}/`)
}
