import * as React from "react"
import { cn } from "@/lib/utils"
import { getOrderSummary, postDelivery, SalesError, type DeliveryPayload, type OrderSummary } from "@/lib/api/sales"

export interface DeliveryCopy {
  contactTitle: string
  addressTitle: string
  continue: string
  back: string
  submit: string
  sending: string
  receiverName: string
  receiverPhone: string
  country: string
  state: string
  city: string
  postalCode: string
  neighborhood: string
  street: string
  exteriorNumber: string
  interiorNumber: string
  betweenStreet1: string
  betweenStreet2: string
  reference: string
  deliveryNotes: string
  tooMany: string
  notFound: string
}

export interface ConfirmationCopy {
  title: string
  receiptNote: string
  shipped: string
  delivered: string
}

export interface DeliveryFormProps {
  orderSlug: string
  copy: DeliveryCopy
  onComplete: (summary: OrderSummary) => void
  obrasHref: string
  backToObras: string
}

type FieldName = keyof DeliveryPayload

interface FieldDef {
  name: FieldName
  labelKey: keyof Omit<DeliveryCopy, "contactTitle" | "addressTitle" | "continue" | "back" | "submit" | "sending" | "tooMany" | "notFound">
  required: boolean
  max: number
  step: 1 | 2
}

const FIELDS: FieldDef[] = [
  { name: "receiver_name", labelKey: "receiverName", required: true, max: 200, step: 1 },
  { name: "receiver_phone", labelKey: "receiverPhone", required: true, max: 50, step: 1 },
  { name: "country", labelKey: "country", required: true, max: 100, step: 2 },
  { name: "state", labelKey: "state", required: true, max: 100, step: 2 },
  { name: "city", labelKey: "city", required: true, max: 100, step: 2 },
  { name: "postal_code", labelKey: "postalCode", required: true, max: 20, step: 2 },
  { name: "neighborhood", labelKey: "neighborhood", required: true, max: 150, step: 2 },
  { name: "street", labelKey: "street", required: true, max: 200, step: 2 },
  { name: "exterior_number", labelKey: "exteriorNumber", required: true, max: 30, step: 2 },
  { name: "interior_number", labelKey: "interiorNumber", required: false, max: 30, step: 2 },
  { name: "between_street_1", labelKey: "betweenStreet1", required: false, max: 200, step: 2 },
  { name: "between_street_2", labelKey: "betweenStreet2", required: false, max: 200, step: 2 },
  { name: "reference", labelKey: "reference", required: false, max: 500, step: 2 },
  { name: "delivery_notes", labelKey: "deliveryNotes", required: false, max: 500, step: 2 },
]

const EMPTY: DeliveryPayload = {
  receiver_name: "",
  receiver_phone: "",
  country: "",
  state: "",
  city: "",
  postal_code: "",
  neighborhood: "",
  street: "",
  exterior_number: "",
  interior_number: "",
  between_street_1: "",
  between_street_2: "",
  reference: "",
  delivery_notes: "",
}

function firstMessage(value: string | string[] | undefined): string | null {
  if (!value) return null
  return Array.isArray(value) ? (value[0] ?? null) : value
}

export function DeliveryForm({ orderSlug, copy, onComplete, obrasHref, backToObras }: DeliveryFormProps) {
  const [step, setStep] = React.useState<1 | 2>(1)
  const [values, setValues] = React.useState<DeliveryPayload>(EMPTY)
  const [errors, setErrors] = React.useState<Partial<Record<FieldName, string>>>({})
  const [sending, setSending] = React.useState(false)
  const [terminal, setTerminal] = React.useState<"tooMany" | "notFound" | null>(null)

  const set = (name: FieldName, value: string) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => {
      if (!e[name]) return e
      const next = { ...e }
      delete next[name]
      return next
    })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setTerminal(null)
    try {
      const summary = await postDelivery(orderSlug, values)
      onComplete(summary)
    } catch (err) {
      if (err instanceof SalesError && err.status === 409) {
        // Idempotent re-submit — confirm against the fresh summary.
        try {
          onComplete(await getOrderSummary(orderSlug))
        } catch {
          setTerminal("tooMany")
          setSending(false)
        }
        return
      }
      if (err instanceof SalesError && err.status === 404) {
        setTerminal("notFound")
      } else if (err instanceof SalesError && err.status === 429) {
        setTerminal("tooMany")
      } else if (err instanceof SalesError && err.status === 400) {
        const next: Partial<Record<FieldName, string>> = {}
        let targetStep: 1 | 2 | null = null
        for (const def of FIELDS) {
          const msg = firstMessage(err.fields[def.name] as string | string[] | undefined)
          if (msg) {
            next[def.name] = msg
            targetStep ??= def.step
          }
        }
        setErrors(next)
        if (targetStep !== null) setStep(targetStep)
      } else {
        setTerminal("tooMany")
      }
      setSending(false)
    }
  }

  const stepFields = FIELDS.filter((f) => f.step === step)

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <h2 className="font-serif text-2xl text-ink">{step === 1 ? copy.contactTitle : copy.addressTitle}</h2>
      {stepFields.map((def) => (
        <label key={def.name} className="flex flex-col gap-2 font-sans">
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted">{copy[def.labelKey]}</span>
          <input
            type="text"
            value={values[def.name]}
            onChange={(e) => set(def.name, e.target.value)}
            required={def.required}
            maxLength={def.max}
            disabled={sending}
            className={cn(
              "border bg-transparent px-4 py-3 text-sm text-ink disabled:opacity-50",
              errors[def.name] ? "border-crimson" : "border-border-theme",
            )}
          />
          {errors[def.name] && <span className="text-xs text-crimson">{errors[def.name]}</span>}
        </label>
      ))}
      {terminal && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-ink" role="alert">
            {terminal === "tooMany" ? copy.tooMany : copy.notFound}
          </p>
          {terminal === "notFound" && (
            <a href={obrasHref} className="w-fit text-sm text-crimson underline underline-offset-4">
              {backToObras}
            </a>
          )}
        </div>
      )}
      <div className="flex gap-3">
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={sending}
            className="inline-flex items-center justify-center border uppercase tracking-[0.1em] font-sans font-medium transition-all duration-300 cursor-pointer bg-transparent text-ink border-ink hover:bg-crimson hover:border-crimson hover:text-paper text-[11px] py-[15px] px-[32px] disabled:opacity-50 disabled:pointer-events-none"
          >
            {copy.back}
          </button>
        )}
        {step === 1 ? (
          <button
            type="button"
            onClick={() => setStep(2)}
            className="inline-flex items-center justify-center border uppercase tracking-[0.1em] font-sans font-medium transition-all duration-300 cursor-pointer bg-crimson text-paper border-crimson hover:bg-transparent hover:text-crimson hover:border-crimson text-[11px] py-[15px] px-[32px]"
          >
            {copy.continue}
          </button>
        ) : (
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center justify-center border uppercase tracking-[0.1em] font-sans font-medium transition-all duration-300 cursor-pointer bg-crimson text-paper border-crimson hover:bg-transparent hover:text-crimson hover:border-crimson text-[11px] py-[15px] px-[32px] disabled:opacity-50 disabled:pointer-events-none"
          >
            {sending ? copy.sending : copy.submit}
          </button>
        )}
      </div>
    </form>
  )
}
