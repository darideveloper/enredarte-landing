import type { ListParams, Paginated, Technique } from "@/lib/api/types"
import { apiFetch } from "@/lib/api/client"

export function list(params: ListParams = {}): Promise<Paginated<Technique>> {
  const search = new URLSearchParams()
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) search.set("page_size", String(params.page_size))
  const qs = search.toString()
  return apiFetch<Paginated<Technique>>(`/apis/artworks/techniques/${qs ? `?${qs}` : ""}`)
}

export function detail(id: number): Promise<Technique> {
  return apiFetch<Technique>(`/apis/artworks/techniques/${id}/`)
}
