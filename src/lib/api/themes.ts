import type { ListParams, Paginated, Theme } from "@/lib/api/types"
import { apiFetch } from "@/lib/api/client"

export function list(params: ListParams = {}): Promise<Paginated<Theme>> {
  const search = new URLSearchParams()
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) search.set("page_size", String(params.page_size))
  const qs = search.toString()
  return apiFetch<Paginated<Theme>>(`/apis/artworks/themes/${qs ? `?${qs}` : ""}`)
}

export function detail(id: number): Promise<Theme> {
  return apiFetch<Theme>(`/apis/artworks/themes/${id}/`)
}
