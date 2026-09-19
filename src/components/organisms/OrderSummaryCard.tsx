import { formatPrice } from "@/lib/format/price"
import type { OrderSummary } from "@/lib/api/sales"

export interface OrderSummaryCardProps {
  summary: OrderSummary
  note?: string
}

export function OrderSummaryCard({ summary, note }: OrderSummaryCardProps) {
  const currency = summary.currency === "usd" ? "USD" : "MXN"
  return (
    <div className="flex flex-col gap-4 border border-border-theme bg-white/40 p-6 font-sans">
      {summary.artwork_image && (
        <img src={summary.artwork_image} alt={summary.artwork_title} className="w-full max-w-sm" loading="lazy" />
      )}
      <div>
        <p className="font-serif text-2xl text-ink">{summary.artwork_title}</p>
        <p className="mt-1 text-sm text-muted">{summary.artist_name}</p>
      </div>
      <p className="text-sm font-medium text-ink">{formatPrice(summary.amount, currency)}</p>
      {note && <p className="text-sm text-ink">{note}</p>}
    </div>
  )
}
