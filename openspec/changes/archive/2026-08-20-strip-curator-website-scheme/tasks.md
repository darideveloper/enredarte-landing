## 1. URL helper

- [x] 1.1 Add a `stripUrlScheme(url)` helper to `src/lib/utils.ts` that removes a leading `http://` or `https://` and a single trailing `/`.

## 2. CuratorCard display

- [x] 2.1 In `src/components/molecules/CuratorCard.astro`, import `stripUrlScheme` and use it for the website link's visible text while keeping `href={curator.website}` unchanged.

## 3. Verification

- [x] 3.1 Run `pnpm build` and manually confirm the curator website link on a `/salas/<slug>` page shows the scheme-free text and still links to the full URL.
