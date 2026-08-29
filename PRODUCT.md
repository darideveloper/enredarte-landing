# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Art collectors and buyers actively looking to purchase art, browse curated galleries, and inquire about specific pieces. They value personal curation over algorithmic discovery and want to support artists directly.

## Product Purpose

EnredArte is a bilingual art gallery discovery and purchasing platform. It connects collectors with curated exhibitions and artworks, enabling them to explore galleries ("salas"), discover artists, and inquire about pieces. Success means collectors find and purchase art they love, artists receive fair compensation (65% of sale), and galleries gain visibility through curated discovery rather than open marketplace dynamics.

## Positioning

Personal curation by humans, not an algorithm or open marketplace. Combined with local gallery discovery and artist-direct economics (65% to artist, signed certificate of authenticity, insured DHL/FedEx shipping). A neighboring product could not truthfully copy the combination of human-curated salas, artist-favorable economics, and gallery-local discovery.

## Operating Context

- Bilingual experience: Spanish (default) and English, with full i18n routing
- Content sourced from a headless Django REST API at build time (SSG)
- Browsing flow: homepage hero → banner value props → gallery of salas → full artwork collection with faceted filters
- Gallery detail flow: hero image → curator card → filtered artworks within that sala
- Artwork detail flow: scroll-driven image crossfade viewer → info panel with specs, price, and inquiry CTA
- Filtering by discipline, technique, theme, format, scale — persisted across sessions
- View transitions for SPA-like navigation between pages
- Responsive: mobile hamburger menu, desktop nav row

## Capabilities and Constraints

- Full artwork browsing with faceted filtering (discipline, technique, theme, format, scale)
- Gallery (sala) browsing with curator profiles
- Artwork detail pages with scroll-driven image viewing
- Inquiry CTA per artwork (not direct purchase — no cart/checkout)
- Bilingual i18n (es/en) with hreflang and canonical URLs
- SEO: OpenGraph, Twitter cards, JSON-LD (LocalBusiness schema)
- GSAP animations with prefers-reduced-motion support
- Docker deployment (node build → nginx serve)
- No user authentication on the landing site (API token is build-time only)
- No e-commerce checkout — inquiry-based model
- Placeholder contact data (phone, email, address) — not yet real

## Brand Commitments

- Name: "EnredArte" (capitalized A)
- Tagline: "Descubre el arte en cada rincon" / "Discover art in every corner"
- Voice: Warm, inviting, editorial — speaks like a knowledgeable gallery curator
- Palette: Paper (warm off-white #F2EDE4), Ink (near-black #1A1A1A), Crimson accent (#C41E3A), Muted (#8A8478)
- Logo variants: default, dark, light, red background, red circle, icon — all present in `/public/`
- Footer attribution: "Powered by DariDevTeam"

## Evidence on Hand

- 30 art photography images in `/public/images/` (abstract, cityscapes, portraits, architecture, studio, exhibition)
- 6 logo variants in `/public/`
- Full translation files: `src/messages/en.json` and `src/messages/es.json`
- Design system page at `/design-system` (noindex)
- Tailwind v4 theme tokens in `src/styles/global.css`
- GSAP animation patterns across hero, gallery, banner, and artwork viewer
- API integration with typed client, retry logic, and pagination

## Product Principles

1. **Curated over algorithmic.** Every gallery and artwork is placed by human curators, not ranked by engagement metrics.
2. **Artists deserve fair economics.** 65% to the artist, signed COA, insured shipping — not a race to the bottom.
3. **Discovery is the experience.** Browsing should feel like walking through a gallery, not scrolling a feed.
4. **Bilingual by default.** Every surface works fully in Spanish and English without compromise.
5. **Performance serves craft.** SSG, inlined CSS, GSAP with reduced-motion respect — the technical choices serve the aesthetic, not the other way around.
