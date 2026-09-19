import * as React from "react"
import { getOrderSummary, SalesError, type OrderSummary } from "@/lib/api/sales"
import { OrderSummaryCard } from "@/components/organisms/OrderSummaryCard"
import { DeliveryForm, type ConfirmationCopy, type DeliveryCopy } from "@/components/organisms/DeliveryForm"

export interface OrderFlowCopy {
  polling: string
  timeoutTitle: string
  timeoutDescription: string
  retry: string
  missingTitle: string
  missingDescription: string
  backToObras: string
}

export interface OrderFlowProps {
  obrasHref: string
  copy: OrderFlowCopy
  delivery: DeliveryCopy
  confirmation: ConfirmationCopy
}

const POLL_MS = 3000
const MAX_ATTEMPTS = 20

type Phase =
  | { kind: "missing" }
  | { kind: "polling"; attempts: number }
  | { kind: "paused" }
  | { kind: "timeout" }
  | { kind: "ready"; summary: OrderSummary }
  | { kind: "complete"; summary: OrderSummary }

export function OrderFlow({ obrasHref, copy, delivery, confirmation }: OrderFlowProps) {
  const [orderSlug] = React.useState<string | null>(() => {
    try {
      return new URLSearchParams(window.location.search).get("order")
    } catch {
      return null
    }
  })
  const [phase, setPhase] = React.useState<Phase>(() =>
    orderSlug ? { kind: "polling", attempts: 0 } : { kind: "missing" },
  )
  const timer = React.useRef<number | null>(null)
  const started = React.useRef(false)

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  React.useEffect(() => clearTimer, [])

  const poll = React.useCallback(
    async (slug: string, attempts: number, errorStreak: number) => {
      try {
        const summary = await getOrderSummary(slug)
        setPhase(
          summary.status === "paid_pending_data"
            ? { kind: "ready", summary }
            : { kind: "complete", summary },
        )
      } catch (err) {
        if (err instanceof SalesError && err.status === 404) {
          if (attempts + 1 >= MAX_ATTEMPTS) {
            setPhase({ kind: "timeout" })
          } else {
            setPhase({ kind: "polling", attempts: attempts + 1 })
            timer.current = window.setTimeout(() => poll(slug, attempts + 1, 0), POLL_MS)
          }
        } else if (err instanceof SalesError && err.status === 429) {
          setPhase({ kind: "paused" })
        } else if (errorStreak + 1 >= 2) {
          setPhase({ kind: "paused" })
        } else {
          setPhase({ kind: "polling", attempts })
          timer.current = window.setTimeout(() => poll(slug, attempts, errorStreak + 1), POLL_MS)
        }
      }
    },
    [],
  )

  React.useEffect(() => {
    if (orderSlug && !started.current) {
      started.current = true
      poll(orderSlug, 0, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderSlug])

  const resume = () => {
    if (!orderSlug) return
    setPhase({ kind: "polling", attempts: 0 })
    poll(orderSlug, 0, 0)
  }

  if (phase.kind === "missing") {
    return (
      <div className="flex flex-col gap-4 font-sans">
        <h1 className="font-serif text-3xl text-ink">{copy.missingTitle}</h1>
        <p className="text-sm text-muted">{copy.missingDescription}</p>
        <a href={obrasHref} className="w-fit text-sm text-crimson underline underline-offset-4">
          {copy.backToObras}
        </a>
      </div>
    )
  }

  if (phase.kind === "polling") {
    return <p className="font-sans text-sm text-muted">{copy.polling}</p>
  }

  if (phase.kind === "paused" || phase.kind === "timeout") {
    return (
      <div className="flex flex-col gap-4 font-sans">
        <h1 className="font-serif text-3xl text-ink">{copy.timeoutTitle}</h1>
        <p className="text-sm text-muted">{copy.timeoutDescription}</p>
        <button
          type="button"
          onClick={resume}
          className="inline-flex w-fit items-center justify-center border uppercase tracking-[0.1em] font-sans font-medium transition-all duration-300 cursor-pointer bg-crimson text-paper border-crimson hover:bg-transparent hover:text-crimson hover:border-crimson text-[11px] py-[15px] px-[32px]"
        >
          {copy.retry}
        </button>
      </div>
    )
  }

  if (phase.kind === "ready") {
    return (
      <div className="flex flex-col gap-8">
        <OrderSummaryCard summary={phase.summary} />
        {orderSlug && <DeliveryForm orderSlug={orderSlug} copy={delivery} confirmation={confirmation} />}
      </div>
    )
  }

  const note =
    phase.summary.status === "shipped"
      ? confirmation.shipped
      : phase.summary.status === "delivered"
        ? confirmation.delivered
        : confirmation.receiptNote
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl text-ink">{confirmation.title}</h1>
      <OrderSummaryCard summary={phase.summary} note={note} />
    </div>
  )
}
