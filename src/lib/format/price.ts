export type Currency = "MXN" | "USD"

const LOCALES: Record<Currency, string> = {
  MXN: "es-MX",
  USD: "en-US",
}

export function currencyForLang(lang: "es" | "en"): Currency {
  return lang === "es" ? "MXN" : "USD"
}

export function formatPrice(
  amount: number | undefined,
  currency: Currency,
  locale?: string,
): string {
  if (amount == null || amount <= 0) return ""
  const loc = locale ?? LOCALES[currency]
  return new Intl.NumberFormat(loc, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function pickPrice(
  mxn: number | undefined,
  usd: number | undefined,
  currency: Currency,
): number | undefined {
  const value = currency === "MXN" ? mxn : usd
  return value != null && value > 0 ? value : undefined
}
