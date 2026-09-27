import { currencyForLang } from "@/lib/format/price"

// Shared builders for per-template JSON-LD `extraJson` fragments.
// Each returns an object merged under BaseSEO's base schema; the returned
// `name`/`url`/`image` override the base so the template-specific entity is
// the schema subject. All fields are emitted only when they resolve (tolerant
// of null/empty API data) — missing fields are simply omitted, keeping the
// schema valid but sparse.

export interface BlogPostingData {
  title: string
  description?: string
  author?: string
  datePublished?: string
}

export function blogPostingSchema(data: BlogPostingData): Record<string, unknown> {
  const json: Record<string, unknown> = { "@type": "BlogPosting" }
  if (data.title) {
    json.name = data.title
    json.headline = data.title
  }
  if (data.description) json.description = data.description
  if (data.author) json.author = { "@type": "Person", name: data.author }
  if (data.datePublished) json.datePublished = data.datePublished
  return json
}

export const blogSchema = (): Record<string, unknown> => ({ "@type": "Blog" })

export interface ArtworkSchemaData {
  name: string
  description?: string
  creatorName?: string
  creatorUrl?: string
  dateCreated?: string
  artMedium?: string
  size?: string
  priceMxn?: number
  priceUsd?: number
  status?: string
  lang?: "es" | "en"
}

export function visualArtworkSchema(data: ArtworkSchemaData): Record<string, unknown> {
  const json: Record<string, unknown> = { "@type": "VisualArtwork" }
  if (data.name) json.name = data.name
  if (data.description) json.description = data.description
  if (data.creatorName || data.creatorUrl) {
    json.creator = {
      "@type": "Person",
      ...(data.creatorName ? { name: data.creatorName } : {}),
      ...(data.creatorUrl ? { url: data.creatorUrl } : {}),
    }
  }
  if (data.dateCreated) json.dateCreated = data.dateCreated
  if (data.artMedium) json.artMedium = data.artMedium
  if (data.size) json.size = data.size
  if (data.status === "available") {
    const price = data.lang === "en" ? data.priceUsd : data.priceMxn
    // Only emit an Offer when there is a matching price.
    if (price != null) {
      json.offers = {
        "@type": "Offer",
        price: String(price),
        priceCurrency: currencyForLang(data.lang ?? "es"),
        availability: "https://schema.org/InStock",
      }
    }
  }
  // image (ogImage) and url (canonical) are already resolved per page in BaseSEO.
  return json
}

export interface ArtGallerySchemaData {
  name: string
  description?: string
}

export function artGallerySchema(data: ArtGallerySchemaData): Record<string, unknown> {
  const json: Record<string, unknown> = { "@type": "ArtGallery" }
  if (data.name) json.name = data.name
  if (data.description) json.description = data.description
  return json
}

export interface PersonSchemaData {
  name: string
  email?: string
  websiteUrl?: string
  sameAs?: string[]
  url?: string
}

export function personSchema(data: PersonSchemaData): Record<string, unknown> {
  const json: Record<string, unknown> = { "@type": "Person" }
  if (data.name) json.name = data.name
  if (data.email) json.email = data.email
  // Canonical identity is the person's page on this site; their personal website,
  // if any, becomes an alternate profile via sameAs.
  if (data.url) json.url = data.url
  const sameAs = (data.sameAs ?? []).filter(Boolean)
  if (data.websiteUrl && !sameAs.includes(data.websiteUrl)) sameAs.push(data.websiteUrl)
  if (sameAs.length > 0) json.sameAs = sameAs
  return json
}