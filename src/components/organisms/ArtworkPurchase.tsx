import * as React from "react"
import { BuyWidget, type BuyCopy } from "@/components/organisms/BuyWidget"
import { getArtworkLiveStatus } from "@/lib/api/artwork-status"
import type { ArtworkStatus, Lang } from "@/lib/api/types"
import { currencyForLang, formatPrice, pickPrice, type Currency } from "@/lib/format/price"

export interface ArtworkPurchaseBadgeCopy {
  inProgress: string
  sold: string
  unavailable: string
}

export interface ArtworkPurchaseProps {
  artworkSlug: string
  lang: Lang
  bakedStatus: ArtworkStatus
  bakedPriceMxn?: number
  bakedPriceUsd?: number
  buyCopy: BuyCopy
  badgeCopy: ArtworkPurchaseBadgeCopy
  statusLabels: Record<ArtworkStatus, string>
}

function badgeFor(status: ArtworkStatus, copy: ArtworkPurchaseBadgeCopy): string {
  if (status === "reserved") return copy.inProgress
  if (status === "sold") return copy.sold
  return copy.unavailable
}

function initialCurrency(lang: Lang, priceMxn?: number, priceUsd?: number): Currency {
  const preferred = currencyForLang(lang)
  if (pickPrice(priceMxn, priceUsd, preferred) !== undefined) return preferred
  return preferred === "MXN" ? "USD" : "MXN"
}

// Purchase zone: renders the baked snapshot identically on first paint,
// then reconciles once against the live status endpoint. Any fetch failure
// keeps the baked HTML — the zone never breaks when the backend is down.
export function ArtworkPurchase({
  artworkSlug,
  lang,
  bakedStatus,
  bakedPriceMxn,
  bakedPriceUsd,
  buyCopy,
  badgeCopy,
  statusLabels,
}: ArtworkPurchaseProps) {
  const [live, setLive] = React.useState<{
    status: ArtworkStatus
    priceMxn?: number
    priceUsd?: number
  } | null>(null)
  const started = React.useRef(false)

  React.useEffect(() => {
    if (started.current) return
    started.current = true
    getArtworkLiveStatus(artworkSlug).then((result) => {
      if (
        result &&
        (result.status !== bakedStatus ||
          result.priceMxn !== bakedPriceMxn ||
          result.priceUsd !== bakedPriceUsd)
      ) {
        setLive({ status: result.status, priceMxn: result.priceMxn, priceUsd: result.priceUsd })
      }
    })
  }, [artworkSlug, bakedStatus, bakedPriceMxn, bakedPriceUsd])

  const status = live?.status ?? bakedStatus
  const priceMxn = live?.priceMxn ?? bakedPriceMxn
  const priceUsd = live?.priceUsd ?? bakedPriceUsd
  const [currency, setCurrency] = React.useState<Currency>(() =>
    initialCurrency(lang, bakedPriceMxn, bakedPriceUsd),
  )

  // Keep the selection valid when live prices arrive: if the selected
  // currency has no price but the other one does, fall over to it.
  React.useEffect(() => {
    if (pickPrice(priceMxn, priceUsd, currency) === undefined) {
      const fallback: Currency = currency === "MXN" ? "USD" : "MXN"
      if (pickPrice(priceMxn, priceUsd, fallback) !== undefined) {
        setCurrency(fallback)
      }
    }
  }, [priceMxn, priceUsd, currency])

  const price = formatPrice(pickPrice(priceMxn, priceUsd, currency), currency)

  return (
    <>
      <div className="flex flex-col gap-2">
        {price && <p className="text-sm text-ink font-sans font-medium">{price}</p>}
        <p className="text-[11px] uppercase tracking-[0.14em] font-sans text-muted">
          {statusLabels[status]}
        </p>
      </div>
      {status === "available" ? (
        <BuyWidget
          artworkSlug={artworkSlug}
          copy={buyCopy}
          currency={currency}
          onCurrencyChange={setCurrency}
          priceMxn={priceMxn}
          priceUsd={priceUsd}
        />
      ) : (
        <p className="self-start border border-border-theme px-[18px] py-[9px] text-[10px] uppercase tracking-[0.06em] font-sans text-muted">
          {badgeFor(status, badgeCopy)}
        </p>
      )}
    </>
  )
}
