function baseUrl(): string {
  const url = import.meta.env.PUBLIC_API_BASE_URL as string | undefined
  if (!url) {
    throw new Error(
      "Missing build-time env var: PUBLIC_API_BASE_URL\n" +
        "Supply it as a Docker build arg: --build-arg PUBLIC_API_BASE_URL=<value>",
    )
  }
  return url.replace(/\/$/, "")
}

export async function recordArtworkVisit(slug: string): Promise<void> {
  const response = await fetch(
    `${baseUrl()}/api/artworks/artworks/${encodeURIComponent(slug)}/visit/`,
    {
      method: "POST",
      keepalive: true,
      signal: AbortSignal.timeout(5_000),
    },
  )
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
}
