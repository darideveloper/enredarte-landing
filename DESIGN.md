---
name: EnredArte
description: Warm gallery discovery platform for curated art and direct artist support
colors:
  paper: "#F2EDE4"
  ink: "#1A1A1A"
  crimson: "#C41E3A"
  muted: "#8A8478"
  border-theme: "#E0DDD8"
  banner-bg: "#EAE4D8"
  banner-text: "#5C5748"
  brand-500: "oklch(0.62 0.18 20)"
  card-dark: "#0D0D0D"
  description: "#7A7568"
typography:
  display:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    textTransform: "uppercase"
    letterSpacing: "0.1em"
    fontSize: "10px"
rounded:
  none: "0"
  sm: "6px"
  full: "9999px"
spacing:
  section-x: "24px / 56px"
  section-y: "64px / 96px"
  grid-gap: "3px / 16px"
  card-padding: "16px / 56px"
components:
  button-primary:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "15px 32px"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.crimson}"
    rounded: "{rounded.none}"
    padding: "15px 32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "15px 32px"
  button-ghost-hover:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "15px 32px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "15px 32px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "9px 18px"
  chip-active:
    backgroundColor: "white"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "9px 18px"
  input:
    backgroundColor: "white"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  nav-link:
    textColor: "{colors.muted}"
    padding: "0"
---

# Design System: EnredArte

## Overview

**Creative North Star: "The Gallery Salon"**

EnredArte's visual language is a private collector's salon — warm, intimate, unhurried. The interface recedes so art can lead. Every surface carries the materiality of physical gallery space: aged parchment backgrounds that feel like uncoated stock, near-black text that reads like lithographic print, and a single crimson accent that punctuates with the confidence of a gallery's signature wall color. The palette is deliberately restrained — three core colors with clear roles, no gradients, no decorative effects.

The system is built on generous whitespace, sharp geometry, and typographic hierarchy that trusts serif headings to carry weight. Interactions are tactile and deliberate: buttons that feel pressed, cards that lift with physical weight, accent bars that slide into place. GSAP animations are used sparingly but with conviction — entrance reveals that feel like curtains opening, scroll-driven transitions that mimic walking through a gallery. The overall effect is unhurried confidence: this is a space that respects your time and trusts the art to speak.

**Key Characteristics:**
- Warm, muted palette anchored by three roles: paper, ink, crimson
- Sharp-cornered geometry throughout — no rounded containers, no soft edges
- Uppercase, wide-tracked labels for navigation and metadata
- Generous section padding and consistent vertical rhythm
- Dark overlays on imagery with hover-driven reveal mechanics
- Tactile hover states with physical displacement (lift, indent, slide)
- Serif display type for headings, sans-serif for everything else

## Colors

The palette is warm, muted, and grounded — three core colors with clear functional roles, plus supporting neutrals that maintain the gallery atmosphere.

### Primary
- **Aged Parchment** (#F2EDE4): The dominant background across every surface. Warm off-white that evokes uncoated paper stock. Used for page backgrounds, header, mobile navigation drawer, and filter scroll fades.
- **Lamp Black** (#1A1A1A): Primary text color and the inverse background (footer). Near-black with warmth — never pure #000. Used for headings, body text, and all high-contrast surfaces.
- **Gallery Red** (#C41E3A): The single accent. Deep crimson used exclusively for CTAs, active filter states, hover underlines, price callouts, and eyebrow highlights. Its rarity is the point — it draws the eye with surgical precision.

### Neutral
- **Warm Muted** (#8A8478): Secondary text for labels, metadata, inactive nav links, disabled states, and spec values. Warm gray that recedes without disappearing.
- **Soft Border** (#E0DDD8): All borders and dividers. Light warm gray that structures layout without visual weight.
- **Banner Canvas** (#EAE4D8): Background for the horizontal banner bar. Slightly warmer than paper, creating subtle section distinction.
- **Banner Inscription** (#5C5748): Text on the banner canvas. Olive-gray that maintains contrast while staying muted.
- **Deep Charcoal** (#0D0D0D): Image containers and photo backgrounds. Near-black used as the canvas for artwork imagery — darker than ink, creating depth behind photographs.

### Supporting
- **Description Gray** (#7A7568): Longer-form body text in artwork descriptions and hero copy. Warmer than muted, optimized for reading comfort at 15px. Exposed as `text-description` utility.
- **Brand Hue** (oklch(0.62 0.18 20)): Input focus ring and loading spinner. A saturated crimson that reads as a functional signal rather than decorative.

### Named Rules
**The Crimson Rule.** Gallery Red appears on ≤10% of any given screen. Its scarcity creates visual authority — when crimson appears, the eye knows it matters.

**The Paper Rule.** Every surface that isn't an image, the footer, or a card overlay defaults to Aged Parchment. No exceptions for white backgrounds, no cool grays leaking in.

## Typography

**Display Font:** Georgia (with 'Times New Roman', serif fallback)
**Body Font:** System UI stack (system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif)

**Character:** The pairing is classic editorial — serif headings carry the warmth and authority of a printed gallery catalog, while the sans-serif body maintains clean readability for metadata and UI text. The contrast between warm serif and neutral sans-serif creates the magazine-meets-museum feel.

### Hierarchy
- **Display** (font-normal, 48px–72px clamp, line-height 1.03): Hero titles and page-level headings. Maximum visual weight with tight leading for dramatic presence.
- **Headline** (font-serif, text-3xl/4xl, line-height 1.1): Section titles, curator names, artwork titles. The workhorse display size.
- **Title** (font-serif, text-3xl, line-height 1.15): Section headers ("Pabellón de Salas", "Colección completa"). Paired with uppercase eyebrows.
- **Body** (font-sans, 14px–15px, line-height 1.8–1.85): Artwork descriptions, hero copy, curator bios. Generous leading for comfortable reading.
- **Label** (font-sans, 10px–11px, uppercase, tracking 0.06em–0.22em): Navigation, filter chips, metadata, eyebrow text, spec labels. The wide tracking and uppercase treatment creates a distinct informational layer.

### Named Rules
**The Eyebrow Rule.** Every major section opens with an uppercase label (10px, tracking 0.22em) followed by a serif title. The eyebrow contextualizes; the title names. Never skip the eyebrow on a new section.

**The Tracking Gradient.** Letter spacing decreases as text size increases: 0.22em on 10px labels → 0.14em on 12px metadata → 0.1em on 11px nav → 0.06em on small labels → -0.01em on display headings. Tighten size, loosen spacing.

## Layout

The spatial model is generous and gallery-like — wide breathing room between sections, tight control within components.

**Container:** All content pages use `max-w-6xl` (1152px) with `px-6 md:px-14` horizontal padding. The footer uses the same container. Hero sections break out to full viewport width.

**Section rhythm:** Consistent `pt-16 md:pt-24 pb-16 md:px-24` padding across all page sections. This 64px/96px vertical rhythm creates the unhurried gallery pace.

**Grid systems:**
- Hero: 2-column split (`0.95fr 1.05fr`) at desktop, stacked on mobile
- Gallery grid: Asymmetric 3-column (`1.4fr 1fr 1fr`) at desktop, 2-column at tablet, stacked on mobile. Fixed row heights of 280px/340px.
- Artwork grid: 4-column (`grid-cols-4`) at desktop with 3px gaps — the tight gap creates a mosaic/tiled effect
- Artwork detail: Asymmetric 2-column (`1fr 380px` / `1fr 420px`) at desktop. Image fills full viewport height, info panel is fixed-width with sticky scroll. Mobile stacks image above info.

**Breakpoints:** Tailwind defaults — `sm` (640px), `md` (768px), `lg` (1024px). Mobile-first progressive enhancement.

**Density:** Low density. Generous whitespace between sections, tight density within card grids and filter rows. The contrast between spacious page sections and compact component clusters creates visual rhythm.

## Elevation & Depth

The system is predominantly flat with tonal layering rather than shadow-based depth. Depth is conveyed through overlay opacity, brightness filters, and physical displacement on hover.

### Shadow Vocabulary
- **Card lift** (`shadow-2xl`): Applied only on card hover — appears as a response to interaction, never at rest. Creates the "pick up the card" tactile feel.
- **Backdrop blur** (`backdrop-blur-sm`): Used on CardSummary overlays and loading states to create frosted-glass depth over imagery.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation, focus). No decorative shadows, no ambient depth.

**The Overlay Rule.** Depth over imagery is always achieved through black gradient overlays (from-black/80 to transparent) and brightness reduction (0.75 → 0.55 on hover). Never white overlays, never colored overlays.

## Shapes

The form language is sharp and architectural — a deliberate rejection of soft, rounded UI conventions.

**Corner strategy:** All containers, cards, buttons, chips, and interactive elements use `rounded-none` (0px). The only exceptions are the input field (`rounded-md`, 6px) and the footer logo (`rounded-full`). This creates a consistent grid-like, editorial feel.

**Borders:** Single-pixel borders using Soft Border (#E0DDD8) for structure — header bottom, footer top, filter chips, spec rows, ImageRowCard dividers. Never decorative, always structural.

**Geometry:** The system favors rectangles and hard edges. Accent elements use `rounded-full` only for small decorative marks (the crimson accent bar in CardInfo, loading spinners). The contrast between sharp containers and small round accents creates visual punctuation.

## Components

### Buttons
- **Shape:** Sharp-cornered rectangle (0px radius), uppercase text, wide letter-spacing (0.1em)
- **Primary:** Crimson background, paper text, crimson border. Toggles to transparent/crimson on hover with `duration-300 ease-in-out`
- **Ghost:** Transparent background, ink text, ink border. Toggles to crimson/crimson/paper on hover — the inversion is the key interaction
- **Outline:** Transparent background, muted text, soft border. Hover shifts to ink text and ink border — the most restrained variant
- **Sizes:** 3 tiers (sm/md/lg) with decreasing padding at smaller sizes. Always uppercase, always tracked.

### Chips (Filter Buttons)
- **Style:** Transparent background, muted text, soft border. 10px uppercase, tracking 0.06em. Sharp corners, `shrink-0` for horizontal scroll
- **Active state:** White background, ink text, crimson border. The active chip inverts the default — white surface with dark text signals selection
- **Disabled state:** Same as default but with `opacity-40` and `cursor-not-allowed`
- **Hover:** Border shifts to crimson, text shifts to ink, background shifts to white — the hover previews the active state

### Cards
- **ImageCard:** Full-bleed image with black gradient overlay (hover/darker/always modes). Image scales 105% on hover with brightness reduction. No radius, no border — the image IS the card
- **CardSummary:** Dark overlay (black/88) with backdrop blur. Title in serif, artist in 10px uppercase, price in crimson. Hover lifts with scale(1.03) and translate-y(-1)
- **CardInfo:** Absolute-positioned overlay with crimson accent bar that slides in from left on hover. Title indents with pl-3.5 on group-hover. The accent bar + indent is the signature interaction
- **ImageRowCard:** Two-column grid (image + text panel). Text panel uses white/50 background. Tags are 10px uppercase with soft border. Sharp corners, structural border-bottom

### Inputs
- **Style:** White background, gray-300 border, rounded-md (6px). 10px label above, field at h-10
- **Focus:** Border shifts to Brand Hue (oklch crimson), ring-2 with 20% opacity. The only rounded element in the system — it signals "this is an input" visually
- **Error:** Border shifts to red-500, focus ring follows. Error text at xs in red-500

### Navigation
- **Desktop:** Sticky header, paper background, logo left, nav links center, language switcher right. Nav links are 11px uppercase, muted, with animated crimson underline on hover (width transition from 0 to full)
- **Mobile:** Full-screen drawer sliding from right, paper background, centered links. Hamburger button animates to X with 300ms transform
- **Footer:** Ink background, paper text. Logo in circle, 3-column grid at desktop. Social icons shift to crimson on hover. Bottom bar with copyright in 11px uppercase

### Signature Component: ArtworkImageViewer
A scroll-driven image crossfade viewer that pins at viewport top and cycles through artwork images as the user scrolls. Uses GSAP ScrollTrigger with `scrub: 1` for frame-accurate scrubbing. Images crossfade with opacity transitions. A counter badge (paper/90 background, 10px uppercase) shows current/total. Desktop only — mobile falls back to stacked images. The pin-and-scrub mechanic is the closest thing to physically walking around a sculpture.

## Do's and Don'ts

### Do:
- **Do** use Gallery Red sparingly — it should appear on ≤10% of any screen. CTAs, active states, prices, and accent bars are its territory.
- **Do** use uppercase, wide-tracked labels for all navigation, metadata, and eyebrow text. This creates a distinct informational layer that separates UI from content.
- **Do** use dark gradient overlays on all imagery. The overlay is what makes text readable and creates depth without shadows.
- **Do** maintain the section rhythm: `px-6 md:px-14 pt-16 md:pt-24 pb-16 md:pb-24` for every major page section.
- **Do** use serif fonts for all display text — titles, headings, card titles. The serif is the visual identity.
- **Do** apply hover transforms with physical weight: `scale-[1.03] + -translate-y-1` for cards, `pl-3.5` for title indent, `translate-x-0 + scale-y-100` for accent bars.

### Don't:
- **Don't** add border-radius to containers, cards, buttons, or chips. The system is sharp-cornered. Only inputs and decorative marks get radius.
- **Don't** use pure white (#FFFFFF) or pure black (#000000) as background colors. Aged Parchment and Lamp Black are the only surface colors.
- **Don't** add shadows to elements at rest. Shadows appear only on hover/interaction state.
- **Don't** use cool grays, blues, or any color temperature that contradicts the warm palette. Every neutral skews warm.
- **Don't** stack multiple accent colors. Gallery Red is the only accent. Brand Hue is a functional signal, not a decorative color.
- **Don't** skip the uppercase label above section titles. Every new section needs the eyebrow.
- **Don't** use decorative gradients, pattern backgrounds, or texture overlays. The paper background IS the texture.
