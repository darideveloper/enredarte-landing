// Consent-gated GA4 (vanilla, no deps). Strict opt-in: nothing fires until granted.
export const CONSENT_KEY = "enredarte-consent"
export const CONSENT_OPEN_EVENT = "enredarte:open-consent"

export interface ConsentChoice {
  analytics: boolean
  ts: number
}

export function getConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>
    if (typeof parsed.analytics !== "boolean") return null
    return { analytics: parsed.analytics, ts: typeof parsed.ts === "number" ? parsed.ts : 0 }
  } catch {
    return null // private mode / corrupt value: treat as undecided
  }
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics === true
}

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

function push(...args: unknown[]): void {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(args)
}

function measurementId(): string {
  return (import.meta.env.PUBLIC_GA_MEASUREMENT_ID as string | undefined) || ""
}

let gaInjected = false

/** Inject gtag.js once. Returns false when disabled (no consent / no ID). Silent no-op. */
export function ensureGaLoaded(): boolean {
  if (!hasAnalyticsConsent() || gaInjected) return gaInjected
  const id = measurementId()
  if (!id) return false
  gaInjected = true
  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)
  push("js", new Date())
  push("config", id)
  return true
}

/** Persist choice, push live consent update, load GA when granted. */
export function setConsent(analytics: boolean): void {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics, ts: Date.now() }))
  } catch {
    // private mode: consent applies to this page view only
  }
  push("consent", "update", { analytics_storage: analytics ? "granted" : "denied" })
  if (analytics) ensureGaLoaded()
}

/** Honor a stored grant on page load (defaults in <head> already deny). */
export function applyStoredConsent(): void {
  if (hasAnalyticsConsent()) {
    push("consent", "update", { analytics_storage: "granted" })
    ensureGaLoaded()
  }
}

const TRACK_SKIP = ["/compra-exitosa", "/compra-cancelada", "/en/compra-exitosa", "/en/compra-cancelada"]

export function trackPageview(path: string = window.location.pathname): void {
  if (!hasAnalyticsConsent()) return
  if (TRACK_SKIP.some((p) => path === p || path.endsWith(p))) return
  if (!ensureGaLoaded()) return
  push("event", "page_view", { page_path: path })
}

export function trackBeginCheckout(opts: { value?: number; currency?: string }): void {
  if (!hasAnalyticsConsent() || !ensureGaLoaded()) return
  push("event", "begin_checkout", {
    ...(opts.currency ? { currency: opts.currency } : {}),
    ...(typeof opts.value === "number" ? { value: opts.value } : {}),
  })
}

export function trackPurchase(opts: { value: number; currency: string }): void {
  if (!hasAnalyticsConsent() || !ensureGaLoaded()) return
  push("event", "purchase", { currency: opts.currency, value: opts.value })
}
