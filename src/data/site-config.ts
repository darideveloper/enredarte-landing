export const PHONES = {
  main: {
    raw: "+526241764802",
    formatted: "+52 624 176 4802",
    href: "tel:+526241764802",
  },
} as const

export const WHATSAPP = {
  raw: "+5216241764802",
  formatted: "+52 1 624 176 4802",
  href: "https://wa.me/5216241764802",
} as const

export const EMAIL = {
  address: "info@enredarte.com",
  href: "mailto:info@enredarte.com",
} as const

// Parked for future map integration: full street-level detail + coordinates
// are kept here but currently unrendered (footer shows LOCATION_SHORT only).
export const ADDRESS = {
  full: "Mexico City, Mexico",
  street: "",
  zone: "",
  city: "Mexico City",
  state: "Mexico City",
  postalCode: "",
  country: "Mexico",
  countryCode: "MX",
} as const

export const LOCATION_SHORT = "Mexico City, Mexico" as const

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/enredarte",
  instagram: "https://www.instagram.com/enredarte/",
} as const

// Parked for future map integration: coordinates kept but unreferenced by the footer.
export const GOOGLE_MAPS = {
  coordinates: { lat: 0.0, lng: 0.0 },
} as const

export const BUSINESS_DATA = {
  name: "EnredArte",
  legalName: "EnredArte",
  url: "https://enredarte.mx",
  logo: "/favicon.svg",
  ogImage: "/og-image.jpg",
  contact: {
    phone: PHONES.main.formatted,
    whatsapp: WHATSAPP.formatted,
    email: EMAIL.address,
    location: LOCATION_SHORT,
    address: {
      street: ADDRESS.street,
      city: ADDRESS.city,
      region: ADDRESS.state,
      postalCode: ADDRESS.postalCode,
      country: ADDRESS.countryCode,
    },
    geo: GOOGLE_MAPS.coordinates,
  },
  social: SOCIAL_LINKS,
} as const
