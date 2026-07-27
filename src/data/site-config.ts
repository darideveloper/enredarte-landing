export const PHONES = {
  main: {
    raw: "+12345678901",
    formatted: "+1 (234) 567-8901",
    href: "tel:+12345678901",
  },
} as const

export const EMAIL = {
  address: "hello@enredarte.com",
  href: "mailto:hello@enredarte.com",
} as const

export const ADDRESS = {
  full: "123 Main St, Downtown, 12345 City, ST",
  street: "123 Main St",
  zone: "Downtown",
  city: "City",
  state: "State",
  postalCode: "12345",
  country: "Country",
  countryCode: "XX",
} as const

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/enredarte",
  instagram: "https://www.instagram.com/enredarte/",
} as const

export const GOOGLE_MAPS = {
  coordinates: { lat: 0.0, lng: 0.0 },
} as const

export const BUSINESS_DATA = {
  name: "EnredArte",
  legalName: "EnredArte",
  url: "https://enredarte.com",
  logo: "/favicon.svg",
  ogImage: "/og-image.jpg",
  contact: {
    phone: PHONES.main.formatted,
    email: EMAIL.address,
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
