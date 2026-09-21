import * as React from "react"
import { BuyWidget, type BuyCopy } from "@/components/organisms/BuyWidget"
import { getArtworkLiveStatus } from "@/lib/api/artwork-status"
import type { ArtworkStatus, Lang } from "@/lib/api/types"
import { currencyForLang, formatPrice, pickPrice } from "@/lib/format/price"

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
  const currency = currencyForLang(lang)
  const price = formatPrice(
    pickPrice(live?.priceMxn ?? bakedPriceMxn, live?.priceUsd ?? bakedPriceUsd, currency),
    currency,
  )

  return (
    <>
      <div className="flex flex-col gap-2">
        {price && <p className="text-sm text-ink font-sans font-medium">{price}</p>}
        <p className="text-[11px] uppercase tracking-[0.14em] font-sans text-muted">
          {statusLabels[status]}
        </p>
      </div>
      {status === "available" ? (
        <BuyWidget artworkSlug={artworkSlug} lang={lang} copy={buyCopy} />
      ) : (
        <p className="self-start border border-border-theme px-[18px] py-[9px] text-[10px] uppercase tracking-[0.06em] font-sans text-muted">
          {badgeFor(status, badgeCopy)}
        </p>
      )}
    </>
  )
}
