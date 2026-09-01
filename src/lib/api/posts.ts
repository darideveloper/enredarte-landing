import type { Lang, ListParams, Paginated, Post, PostSummary } from "@/lib/api/types"
import { apiFetch } from "@/lib/api/client"

export function list(params: ListParams = {}): Promise<Paginated<PostSummary>> {
  const search = new URLSearchParams()
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) search.set("page_size", String(params.page_size))
  const qs = search.toString()
  return apiFetch<Paginated<PostSummary>>(`/api/blog/posts/${qs ? `?${qs}` : ""}`)
}

export function detail(slug: string): Promise<Post> {
  return apiFetch<Post>(`/api/blog/posts/${slug}/`)
}

export function pickPostField(post: Post | PostSummary, lang: Lang, key: string): string {
  return (post as unknown as Record<string, string>)[`${key}_${lang}`] ?? ""
}
