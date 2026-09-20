<!-- All tasks below are already implemented and working in the codebase.
     Boxes are checked accordingly; /opsx-apply should verify, not rebuild. -->

## 1. Sticky image stage

- [x] 1.1 Move stickiness to the image zone in `ArtworkPage.astro` (`lg:sticky lg:top-[93px] lg:h-[calc(100svh-93px)] lg:self-start` on `.artwork-image-zone`)
- [x] 1.2 Remove the fixed box from `ArtworkInfoPanel.astro` (drop `lg:sticky lg:top-[93px] lg:h-[calc(100svh-93px)] lg:overflow-y-auto lg:self-start` so the panel flows in normal document flow)

## 2. Pin-less scrub viewer

- [x] 2.1 Replace `pin: true` + count-derived `end` with trigger `section`, `start: "top 93px"`, `end: "bottom bottom"`, keeping timeline, scrub, counter, and lifecycle
- [x] 2.2 Skip the timeline when the section fits the viewport (`section.offsetHeight <= window.innerHeight`)
- [x] 2.3 Reserve the stage height on desktop (`height: 100%`, `min-height: 0` at ≥1024px) instead of `min-height: 100vh`
- [x] 2.4 Keep mobile / `prefers-reduced-motion` stacked fallback unchanged

## 3. Spec and doc sync

- [x] 3.1 Update `openspec/specs/artwork-detail-page/spec.md` (sticky stage, single scrollbar, pin-less scrub)
- [x] 3.2 Update `openspec/specs/artwork-viewer/spec.md` (pin-less scrub, stage-height reservation, single-scrollbar verification)
- [x] 3.3 Update the artwork bullet in `docs/component-dependencies.md`

## 4. Verification

- [x] 4.1 `astro check` shows no errors in touched files (5 remaining errors are pre-existing in untouched files)
- [x] 4.2 Static sweep: no `pin: true` or `overflow-y-auto` remains in `src`
- [x] 4.3 Live `playwright-cli` pass (local dev server): single scrollbar (`overflow-y: visible`, `scrollHeight == clientHeight`), buy fully visible at scroll 275 before footer enters at 344; simulated 2-image scrub advances counter 1/2 → 2/2 with crossfade opacity 0 → 1, stage holds `top: 93px` through the scrub range, zero pin-spacers
