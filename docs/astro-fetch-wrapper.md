---
created: 2026-07-26
updated: 2026-09-09
tags:
  - astro
  - api
  - fetch
  - error-handling
  - pattern
  - documentation
type: resource
status: active
---

# Fetch Wrapper Pattern

A typed fetch client with retry logic, timeout, and structured error classes. All API calls go through this wrapper — never raw `fetch()`.

> **🏠 Local note (enredarte-landing):** `src/lib/api/` (`client.ts` with
> `apiFetch` + token injection, `types.ts`, one module per endpoint, `pagination.ts`
> `fetchAll`) is wired in — `buildSiteData()` (`src/data/api.ts`) plus the isolated
> blog fetch in `src/pages/[...path].astro` consume it at build time. New endpoints
> follow the `apiFetch(path)` pattern below: API-relative paths, token injected
> centrally.

## Architecture

```
safeFetch<T>(url, options, timeout, retries)
  └── attemptFetch<T>(url, options, timeout)
        ├── AbortSignal.timeout(timeoutMs)
        ├── url → fetch()
        ├── ok? → response.json()
        └── fail? → FetchError { type, message, status }
              ├── "network"   → retry (exponential backoff)
              ├── "timeout"   → retry (exponential backoff)
              ├── "http"      → throw immediately
              ├── "parse"     → throw immediately
              └── "abort"     → throw immediately
```

## 1. The Client

```ts
// src/lib/api/client.ts
export class FetchError extends Error {
  constructor(
    public type: "network" | "timeout" | "http" | "parse" | "abort",
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = "FetchError"
  }
}

async function attemptFetch<T>(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<T> {
  const signal = options.signal
    ? AbortSignal.any([options.signal, AbortSignal.timeout(timeoutMs)])
    : AbortSignal.timeout(timeoutMs)

  let response: Response
  try {
    response = await fetch(url, { ...options, signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      throw new FetchError("timeout", "Request timed out")
    }
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new FetchError("abort", "Request was cancelled")
    }
    throw new FetchError("network", err instanceof Error ? err.message : "Network error")
  }

  if (!response.ok) {
    throw new FetchError("http", `HTTP ${response.status} ${response.statusText}`, response.status)
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new FetchError("parse", "Failed to parse response as JSON")
  }

  return data as T
}

export async function safeFetch<T>(
  url: string,
  options: RequestInit = {},
  timeoutMs = 30_000,
  maxRetries = 2,
): Promise<T> {
  let lastError: FetchError | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await attemptFetch<T>(url, options, timeoutMs)
    } catch (err) {
      if (!(err instanceof FetchError)) throw err

      lastError = err

      // Only retry transient errors
      if (err.type === "timeout" || err.type === "network") {
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 5000)
          await new Promise((r) => setTimeout(r, delay))
          continue
        }
      }

      // HTTP errors, parse errors, aborts — throw immediately
      throw err
    }
  }

  throw lastError ?? new FetchError("network", "Unknown error")
}
```

## 2. API Endpoint Modules

Each backend endpoint gets its own file in `src/lib/api/`. The files are thin — they import `apiFetch` (base URL + `Authorization: Token` injected centrally) and define the request shape + response type. Paths are API-relative, never full URLs.

```ts
// src/lib/api/posts.ts
import { apiFetch } from "./client"
import type { Paginated, PostSummary } from "./types"

export function list(params: { page?: number; page_size?: number } = {}) {
  const search = new URLSearchParams()
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) search.set("page_size", String(params.page_size))
  const qs = search.toString()
  return apiFetch<Paginated<PostSummary>>(`/api/blog/posts/${qs ? `?${qs}` : ""}`)
}

export function detail(slug: string) {
  return apiFetch<Post>(`/api/blog/posts/${slug}/`)
}
```

## 3. Shared Types

```ts
// src/lib/api/types.ts (excerpt — API-faithful shapes)
export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  page: number
  page_size: number
  total_pages: number
  results: T[]
}

export interface ListParams {
  page?: number
  page_size?: number
}

// Per-resource interfaces mirror the backend (Base, Ref, Translations<T>,
// PostSummary/Post — see docs/blog-api.md for the blog contract).
```

## 4. Constants

```ts
// src/lib/api/constants.ts
export const API_ERROR_MESSAGE =
  "Something went wrong. Please try again."
```

Store shared messages, error strings, or common defaults in this file instead of scattering them across components.

> **🏠 Local note:** enredarte-landing has no `constants.ts` — shared strings live with their callers. Add the file only if shared copy accumulates.

## 5. Usage in Components

```tsx
import { list as listPosts } from "@/lib/api/posts"
import { FetchError } from "@/lib/api/client"

async function loadPosts() {
  try {
    const page = await listPosts({ page: 1, page_size: 11 })
    // page is typed: Paginated<PostSummary>
  } catch (err) {
    if (err instanceof FetchError) {
      if (err.type === "timeout") {
        // show "Request timed out" message
      } else if (err.type === "http" && err.status === 404) {
        // show "Not found"
      } else if (err.type === "network") {
        // show "No connection" with retry button
      } else {
        // show generic error
      }
    }
  }
}
```

## 6. Error Handling Strategy

| Error type | Meaning | Action |
|---|---|---|
| `network` | No internet, DNS failure, connection refused | Show generic error, retry button |
| `timeout` | Server didn't respond in time | Show generic error, retry button |
| `http` | Server returned 4xx/5xx | Show status-specific message |
| `parse` | Response isn't valid JSON | Log error, show generic message |
| `abort` | Request was cancelled (e.g. component unmounted) | Do nothing (expected) |

## 7. New Project Setup

```bash
# Create API directory structure
mkdir -p src/lib/api

# Create files
touch src/lib/api/client.ts     # safeFetch + FetchError
touch src/lib/api/types.ts      # shared response types
touch src/lib/api/constants.ts  # shared messages
```

For each backend endpoint, create a module:
```ts
// src/lib/api/my-endpoint.ts
import { safeFetch } from "./client"
import type { MyResponse } from "./types"

export function myEndpoint(param: string) {
  const baseUrl = import.meta.env.API_BASE_URL
  return safeFetch<MyResponse>(`${baseUrl}/endpoint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ param }),
  })
}
```

## 8. Environment Variables

```env
API_BASE_URL=https://api.example.com
API_TOKEN=<your-token>
```

Server-only env vars (no `PUBLIC_` prefix) are accessed via `import.meta.env` in build-time code (SSG). Vite statically replaces them at build time. In this project `apiFetch` (`client.ts`) reads `API_BASE_URL`/`API_TOKEN` centrally; endpoint modules pass API-relative paths.

See [[astro-docker-deployment|Dockerized Deployment]] for how to pass build-time env vars in Docker.

## 9. Key Rules

- One file per API endpoint in `src/lib/api/`
- All calls go through `safeFetch` — never raw `fetch()`
- Use `FetchError` for typed error handling in components
- Retry logic is in the client — component code doesn't need retry loops
- Set reasonable timeouts (30s default) — infinite waits are the most common bug
- Base URL + token live in `apiFetch` (`client.ts`) — endpoint modules pass relative paths, never hardcode hosts

## 10. Connection to Other Patterns

- Call API endpoints from Zustand store actions → see [[astro-zustand-zod]]
- Environment variables for base URL → see [[astro-docker-deployment]]
