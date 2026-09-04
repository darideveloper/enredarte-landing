## Context

Landing currently satisfies content completeness but not brand intent. Hero fallbacks and section headers are hardcoded, BannerBar proof points are e-commerce badge style, SEO description is generic. All are outside i18n despite having ES/EN site. No shared voice rules exist, so future pages will diverge.

Stack: Astro + `src/messages/{es,en}.json` via `getTranslations(lang)`, no CMS for copy.

## Goals / Non-Goals

**Goals:** Formal, exclusive-but-warm landing copy in both languages; all user-visible strings via i18n; reusable voice spec.
**Non-Goals:** Visual redesign, layout/structure changes, new routes, CMS integration, EN informal variant.

## Decisions

- **i18n for all strings** — no hardcoded user text remains on landing. Rationale: enables review/iteration without code, consistent with existing pattern. Alternative (inline props) rejected: duplicates.
- **Formal `usted` ES / elevated `you` EN** — aligns with explicit luxury positioning. Rationale: user decision. Trade: slightly longer strings → verify no wrapping break.
- **65% explicit, positive framing, non-linked** — `El 65% es para el artista` as statement, per user request. Alternative (link to transparency page) deferred.
- **Invitation verbs** — `Descubrir`/`Leer la curaduría`/`Afinar selección` instead of transactional verbs. Keeps both audiences (collector + discoverer) served.

## Risks / Trade-offs

- Longer formal strings may wrap on small viewports → Mitigation: keep similar length, visual QA.
- Key renames require updating all consumers → Mitigation: grep for `t("` usage, build fails on missing key (good).
- Voice spec could be ignored → Mitigation: reference it in proposal and PR template.

## Migration Plan

1. Add keys to `es.json`/`en.json`.
2. Wire components to `t()` with fallbacks.
3. `pnpm run build` + ES/EN toggle QA.
4. No data migration; rollback = revert keys/components.

## Open Questions

- None blocking; EN elevated diction to be reviewed in PR.
