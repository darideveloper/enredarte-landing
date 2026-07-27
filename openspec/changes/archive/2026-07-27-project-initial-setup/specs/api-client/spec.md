## ADDED Requirements

### Requirement: Typed fetch wrapper
The project SHALL provide a `safeFetch<T>()` function that wraps `fetch()` with typing, timeout, and retry logic. All API calls SHALL go through this wrapper.

#### Scenario: Successful fetch returns typed data
- **WHEN** `safeFetch<UserResponse>("/api/user")` succeeds
- **THEN** it SHALL return a value of type `UserResponse`

#### Scenario: Network error triggers retry
- **WHEN** a network error occurs on the first attempt
- **THEN** `safeFetch` SHALL retry up to `maxRetries` (default 2) times with exponential backoff

### Requirement: Structured error classes
The project SHALL define a `FetchError` class with typed error categories: `"network"`, `"timeout"`, `"http"`, `"parse"`, `"abort"`.

#### Scenario: HTTP error throws FetchError
- **WHEN** the server returns a 4xx or 5xx status
- **THEN** `safeFetch` SHALL throw a `FetchError` with `type: "http"` and `status` set to the HTTP status code

#### Scenario: Timeout throws FetchError
- **WHEN** a request exceeds the timeout (default 30s)
- **THEN** `safeFetch` SHALL throw a `FetchError` with `type: "timeout"`

### Requirement: Per-endpoint modules
Each backend endpoint SHALL have its own module in `src/lib/api/` that imports `safeFetch` and defines the request/response types.

#### Scenario: Endpoint module calls safeFetch
- **WHEN** an endpoint module function is called
- **THEN** it SHALL use `safeFetch` internally and return a typed promise

### Requirement: Base URL from environment
The API base URL SHALL come from `import.meta.env.PUBLIC_API_BASE_URL`. It SHALL never be hardcoded.

#### Scenario: Base URL uses env var
- **WHEN** an endpoint module constructs a URL
- **THEN** it SHALL use `import.meta.env.PUBLIC_API_BASE_URL` as the base
