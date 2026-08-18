import type { Discipline, ListParams, Paginated } from "@/lib/api/types"
import { apiFetch } from "@/lib/api/client"

export function list(params: ListParams = {}): Promise<Paginated<Discipline>> {
  const search = new URLSearchParams()
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) search.set("page_size", String(params.page_size))
  const qs = search.toString()
  return apiFetch<Paginated<Discipline>>(`/apis/artworks/disciplines/${qs ? `?${qs}` : ""}`)
}

export function detail(id: number): Promise<Discipline> {
  return apiFetch<Discipline>(`/apis/artworks/disciplines/${id}/`)
}
