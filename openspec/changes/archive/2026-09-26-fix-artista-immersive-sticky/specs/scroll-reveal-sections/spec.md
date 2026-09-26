## MODIFIED Requirements

### Requirement: Artist and curator reveals
ArtistPage `#artista-obras` SHALL fade its header, fade the featured ImageBanner once, and reveal each editorial row via its own row trigger animating inner content only (sticky wrapper untouched); `#artista-salas` SHALL stagger its gallery grid. CuratorPage SHALL fade CuratorHero header text only (portrait untouched) and stagger the CuratorSalas grid with its header.

#### Scenario: Artist and curator sections animate
- **WHEN** each artist/curator section scrolls into view
- **THEN** headers fade once and cards/rows animate in; curator/artist portrait images never animate opacity.

#### Scenario: Artista rows reveal per row without breaking sticky
- **WHEN** each `#artista-obras .js-artista-row` approaches the viewport (`start "top 85%"`, `play none none none`)
- **THEN** its inner content (image cell and info cell children) fades up (`y:40`, `duration 0.8`, `power2.out`, `clearProps`) while the `md:sticky` info wrapper itself never receives inline `transform`/`opacity`.
