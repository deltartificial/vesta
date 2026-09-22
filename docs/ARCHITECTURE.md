# Architecture

Vesta is opinionated to the point of dogma: there is **one correct way** to do
each common task, and tooling rejects deviations. This document explains the
shape of that "one correct way" so contributors don't have to reverse-engineer
it from the linter.

## Layered model

Code is split by **domain first**, then by technical layer inside each domain.
Global folders only hold code that is generic and shared by several domains.

```
┌─────────────────────────────────────────────────────────────┐
│  src/routes/             file-based routes (TanStack Router)│
│                          composes features, validates URL   │
├─────────────────────────────────────────────────────────────┤
│  src/features/<domain>/  one folder per business domain     │
│    components/           memoized, < 450 LOC                │
│    hooks/                useX, composes store + queries     │
│    store/                zustand stores (< 250 LOC each)    │
│    services/             data boundary (zod-parsed)         │
│    schemas/              zod schemas (payloads, URL params) │
│    types/  constants/  utils/                               │
├─────────────────────────────────────────────────────────────┤
│  shared, domain-agnostic layers                             │
│  src/components/ui/      primitives (memo optional)         │
│  src/hooks/              generic hooks                      │
│  src/services/http.ts    the only place fetch() is called   │
│  src/schemas/  src/types/  src/constants/                   │
│  src/utils/              pure helpers, fully tested         │
└─────────────────────────────────────────────────────────────┘
```

Imports flow downward only, and the architecture linter enforces it:

- a feature never imports another feature (`enforce-feature-boundaries`);
  two features meet only in a route;
- shared layers never import a feature;
- `src/pages/`, `src/store/` and non-`ui/` folders under `src/components/`
  are rejected (`enforce-feature-structure`).

When two features need the same thing, move it down into a shared layer
instead of importing across features.

## Routing

Routes are files under `src/routes/`. The TanStack Router plugin generates
`src/route-tree.gen.ts` (committed, never edited by hand) and splits every
route component into its own chunk (`autoCodeSplitting`).

| URL | File |
|-----|------|
| `/` | `src/routes/index.tsx` |
| `/status/$field` | `src/routes/status/$field.tsx` |
| layout for `/users/*` | `src/routes/users/route.tsx` |

Nested routes use directories, never the dot notation (`status.$field.tsx`),
which the kebab-case filename rule rejects.

The URL is an external boundary, so every value read from it goes through
Zod (`require-route-schemas`):

```ts
export const Route = createFileRoute("/users/$userId")({
  params: { parse: parseParams(UserParams) },
  validateSearch: UserSearch,
  component: UserPage,
});
```

- **Path params**: every route whose path contains a `$segment` declares
  `params: { parse: parseParams(Schema) }`. An invalid param becomes a 404
  instead of an error screen. Child routes receive params already parsed by
  their parent, so use `z.coerce` for non-string params.
- **Search params**: every route that calls `useSearch()` declares
  `validateSearch: Schema`. Give each key a `.default()` and a `.catch()` so a
  hand-edited URL falls back instead of crashing.
- Schemas live in `src/features/<domain>/schemas/`, never inline in the
  route file.

`Route.useParams()` and `Route.useSearch()` are fully typed from the schema,
and so are `<Link to params search>` and `useNavigate()`.

## Data flow

```
external API
     │  fetch
     ▼
src/services/http.ts   ── http(schema, request) ── zod.parse(...)
     │  typed value
     ▼
features/<d>/services  ── one function per endpoint
     │
     ▼
@tanstack/react-query  ── query key, staleTime, retry
     │  hook output
     ▼
features/<d>/hooks     ── useX()
     │
     ▼
component              ── memoized, useShallow on store
     │  user action
     ▼
features/<d>/store/*-store.ts  ── action method
```

There is no `useEffect` anywhere in this picture. Side effects belong to
TanStack Query or to event handlers; runtime state belongs to Zustand.

## Where things live

| Concern | Folder | Notes |
|---------|--------|-------|
| Routes | `src/routes/` | File-based; params and search validated by Zod |
| Domain components | `src/features/<domain>/components/` | Always wrapped in `memo()`, max 450 LOC, props < 8 |
| Domain behavior | `src/features/<domain>/hooks/use-<name>.ts` | Hooks compose stores and queries; never own state directly |
| Domain state | `src/features/<domain>/store/<name>-store.ts` | One Zustand factory per file, max 250 LOC |
| Network calls | `src/features/<domain>/services/` | Every function ends in `schema.parse()` or goes through `http()` |
| Runtime schemas | `src/features/<domain>/schemas/` | Payloads, path params, search params |
| Domain types / constants / helpers | `src/features/<domain>/{types,constants,utils}/` | Same rules as their shared counterparts |
| HTTP transport | `src/services/http.ts` | The only file allowed to call `fetch()` |
| UI primitives | `src/components/ui/` | Base UI / Tailwind atoms; `memo()` optional |
| Generic hooks | `src/hooks/` | No domain knowledge |
| Shared schemas / types / constants | `src/schemas/`, `src/types/`, `src/constants/` | Used by several features |
| Pure helpers | `src/utils/<domain>/` | No React, no DOM, easily unit-tested |

## Boundary contract

Anything entering the app from the outside world must be parsed by Zod before
it touches application code. That means:

- HTTP responses: `http(schema, request)` returns the parsed value
- LocalStorage / SessionStorage: read through `src/utils/storage`, which
  passes the raw string through `JSON.parse` plus a Zod schema
- URL params and search params: validated by the route (`parseParams`,
  `validateSearch`), see [Routing](#routing)
- Environment variables: validated at boot in a single `env` module

`JSON.parse` and raw `fetch` are forbidden in application code (the linter
rejects them); they exist only inside the wrappers above.

## Commit-time enforcement

```
git commit
   ↓
husky pre-commit
   ↓
lint-staged   ── biome check --write on staged files
   ↓
bun run lint:rules   ── 28 architecture rules (scripts/lint-rules.ts)
   ↓
husky commit-msg
   ↓
commitlint   ── conventional-commit format
```

If any of these fail, the commit is rejected. CI (`.github/workflows/ci.yml`)
runs the same linters plus the OS test matrix, knip, size-limit, typos, and
the license audit. Merging into `main` requires all of these to pass.

## See also

- [`COMMITS.md`](COMMITS.md) — commit and PR title format
- [`RULES.md`](RULES.md) — every architecture rule with rationale and
  alternatives
- [`RELEASES.md`](RELEASES.md) — how versions and changelogs are generated
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — local workflow and PR conventions
- [`adr/`](adr/) — Architecture Decision Records
