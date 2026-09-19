import * as React from "react"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { postBuy, SalesError, type SalesCurrency } from "@/lib/api/sales"
import type { Lang } from "@/lib/api/types"

export interface BuyCopy {
  currencyLabel: string
  emailLabel: string
  emailPlaceholder: string
  submit: string
  buying: string
  emailInvalid: string
  unavailable: string
  inProgress: string
  retryLater: string
  tooMany: string
}

export interface BuyWidgetProps {
  artworkSlug: string
  lang: Lang
  copy: BuyCopy
}

type TerminalKind = "unavailable" | "inProgress" | "retryLater" | "tooMany"

const LAST_ARTWORK_KEY = "enredarte-last-artwork"

export function BuyWidget({ artworkSlug, lang, copy }: BuyWidgetProps) {
  const [currency, setCurrency] = React.useState<SalesCurrency>(lang === "en" ? "usd" : "mxn")
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [emailError, setEmailError] = React.useState<string | null>(null)
  const [terminal, setTerminal] = React.useState<TerminalKind | null>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)

  const failEmail = (message: string) => {
    setEmailError(message)
    setTerminal(null)
    emailRef.current?.focus()
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    const parsed = z.email(copy.emailInvalid).safeParse(email.trim())
    if (!parsed.success) {
      failEmail(parsed.error.issues[0]?.message ?? copy.emailInvalid)
      return
    }
    setEmailError(null)
    setTerminal(null)
    setLoading(true)
    try {
      const { checkout_url } = await postBuy(artworkSlug, { currency, email: email.trim() })
      try {
        sessionStorage.setItem(LAST_ARTWORK_KEY, artworkSlug)
      } catch {
        // Private mode — the cancel page falls back to the catalog link.
      }
      window.location.assign(checkout_url)
    } catch (err) {
      if (err instanceof SalesError) {
        const fieldMsg = err.fields.email ?? err.fields.currency
        if (err.status === 400 && fieldMsg) {
          failEmail(Array.isArray(fieldMsg) ? (fieldMsg[0] ?? copy.emailInvalid) : fieldMsg)
        } else if (err.status === 404) {
          setTerminal("unavailable")
        } else if (err.status === 409) {
          setTerminal("inProgress")
        } else if (err.status === 429) {
          setTerminal("tooMany")
        } else {
          setTerminal("retryLater")
        }
      } else {
        setTerminal("retryLater")
      }
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <label className="flex flex-col gap-2 font-sans">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted">{copy.currencyLabel}</span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as SalesCurrency)}
          disabled={loading}
          className="border border-border-theme bg-transparent px-4 py-3 text-sm text-ink disabled:opacity-50"
        >
          <option value="mxn">MXN</option>
          <option value="usd">USD</option>
        </select>
      </label>
      <label className="flex flex-col gap-2 font-sans">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted">{copy.emailLabel}</span>
        <input
          ref={emailRef}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setEmailError(null)
          }}
          placeholder={copy.emailPlaceholder}
          disabled={loading}
          autoComplete="email"
          aria-invalid={emailError !== null}
          aria-describedby={emailError ? "buy-email-error" : undefined}
          className={cn(
            "border bg-transparent px-4 py-3 text-sm text-ink placeholder:text-muted/60 disabled:opacity-50",
            emailError ? "border-crimson" : "border-border-theme",
          )}
        />
        {emailError && (
          <span id="buy-email-error" role="alert" className="text-xs text-crimson">
            {emailError}
          </span>
        )}
      </label>
      {terminal && <p className="text-sm text-ink" role="alert">{copy[terminal]}</p>}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center border uppercase tracking-[0.1em] font-sans font-medium transition-all duration-300 ease-in-out cursor-pointer select-none bg-crimson text-paper border-crimson hover:bg-transparent hover:text-crimson hover:border-crimson text-[11px] py-[15px] px-[32px] self-start disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? copy.buying : copy.submit}
      </button>
    </form>
  )
}
