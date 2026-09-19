import { FetchError } from "@/lib/api/client"
import type { Artwork } from "@/lib/api/types"

export type SalesCurrency = "mxn" | "usd"

export interface BuyRequest {
  currency: SalesCurrency
  email: string
}

export interface BuyResponse {
  checkout_url: string
}

export type OrderStatus =
  | "pending_payment"
  | "paid_pending_data"
  | "data_complete"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"

export interface OrderSummary {
  slug: string
  status: OrderStatus
  currency: SalesCurrency
  amount: number
  paid_at: string | null
  artwork_title: string
  artwork_image: string | null
  artist_name: string
}

export interface DeliveryPayload {
  receiver_name: string
  receiver_phone: string
  country: string
  state: string
  city: string
  postal_code: string
  neighborhood: string
  street: string
  exterior_number: string
  interior_number: string
  between_street_1: string
  between_street_2: string
  reference: string
  delivery_notes: string
}

export interface SalesFieldErrors {
  [field: string]: string[] | string
}

export class SalesError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: SalesFieldErrors = {},
  ) {
    super(message)
    this.name = "SalesError"
  }
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

async function salesFetch<T>(path: string, init: RequestInit = {}, timeoutMs = 15_000): Promise<T> {
  const signal = init.signal
    ? AbortSignal.any([init.signal, AbortSignal.timeout(timeoutMs)])
    : AbortSignal.timeout(timeoutMs)

  let response: Response
  try {
    response = await fetch(`${baseUrl()}${path}`, { ...init, signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      throw new FetchError("timeout", "Request timed out")
    }
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new FetchError("abort", "Request was cancelled")
    }
    throw new FetchError("network", err instanceof Error ? err.message : "Network error")
  }

  if (!response.ok) {
    let message = `HTTP ${response.status}`
    let fields: SalesFieldErrors = {}
    try {
      const body = (await response.json()) as { message?: unknown; data?: unknown }
      if (typeof body.message === "string" && body.message) message = body.message
      if (body.data && typeof body.data === "object") fields = body.data as SalesFieldErrors
    } catch {
      // Non-JSON error body — keep the HTTP fallback.
    }
    throw new SalesError(response.status, message, fields)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new FetchError("parse", "Failed to parse response as JSON")
  }
}

function jsonInit(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  }
}

export function postBuy(artworkSlug: Artwork["slug"], req: BuyRequest): Promise<BuyResponse> {
  return salesFetch<BuyResponse>(`/api/artworks/artworks/${artworkSlug}/buy/`, jsonInit(req))
}

export function getOrderSummary(orderSlug: string): Promise<OrderSummary> {
  return salesFetch<OrderSummary>(`/api/artworks/orders/${orderSlug}/`, {
    headers: { Accept: "application/json" },
  })
}

export function postDelivery(orderSlug: string, payload: DeliveryPayload): Promise<OrderSummary> {
  return salesFetch<OrderSummary>(`/api/artworks/orders/${orderSlug}/delivery/`, jsonInit(payload))
}
