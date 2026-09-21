import type { Artwork, ArtworkStatus } from "@/lib/api/types"

export interface ArtworkLiveStatus {
  slug: Artwork["slug"]
  status: ArtworkStatus
  priceMxn?: number
  priceUsd?: number
}

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

function toNumber(value: unknown): number | undefined {
  const n = typeof value === "string" || typeof value === "number" ? Number(value) : NaN
  return Number.isFinite(n) && n > 0 ? n : undefined
}

function isStatus(value: unknown): value is ArtworkStatus {
  return (
    value === "available" ||
    value === "reserved" ||
    value === "sold" ||
    value === "on_loan" ||
    value === "not_available"
  )
}

// Public live status check for the artwork purchase zone (cf. GET
// .../artworks/:slug/status/ Bruno doc): fire-and-forget, never throws —
// any failure resolves null so the caller keeps the baked HTML.
export async function getArtworkLiveStatus(slug: string): Promise<ArtworkLiveStatus | null> {
  let response: Response
  try {
    response = await fetch(`${baseUrl()}/api/artworks/artworks/${encodeURIComponent(slug)}/status/`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    })
  } catch {
    return null
  }
  if (!response.ok) return null
  try {
    const body = (await response.json()) as { slug?: unknown; status?: unknown; price_mxn?: unknown; price_usd?: unknown }
    if (typeof body.slug !== "string" || !isStatus(body.status)) return null
    return {
      slug: body.slug,
      status: body.status,
      priceMxn: toNumber(body.price_mxn),
      priceUsd: toNumber(body.price_usd),
    }
  } catch {
    return null
  }
}
