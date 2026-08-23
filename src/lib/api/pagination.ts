import type { ListParams, Paginated } from "@/lib/api/types"

export interface FetchAllOptions {
  page_size?: number
}

export async function fetchAll<T>(
  list: (params?: ListParams) => Promise<Paginated<T>>,
  { page_size = 100 }: FetchAllOptions = {},
): Promise<T[]> {
  const results: T[] = []
  let page = 1
  let totalPages = 1
  do {
    const data = await list({ page, page_size })
    results.push(...data.results)
    totalPages = data.total_pages
    page += 1
  } while (page <= totalPages)
  return results
}
