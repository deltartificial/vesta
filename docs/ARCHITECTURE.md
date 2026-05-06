# Architecture

Vesta is opinionated to the point of dogma: there is **one correct way** to do
each common task, and tooling rejects deviations. This document explains the
shape of that "one correct way" so contributors don't have to reverse-engineer
it from the linter.

## Layered model

```
┌─────────────────────────────────────────────────────────────┐
│  src/pages/              routes (lazy-loaded only)          │
├─────────────────────────────────────────────────────────────┤
│  src/components/         presentation (memoized, < 450 LOC) │
│    ui/                   primitives (memo optional)         │
├─────────────────────────────────────────────────────────────┤
│  src/hooks/              reusable behavior (useX)           │
├─────────────────────────────────────────────────────────────┤
│  src/store/              zustand stores (< 250 LOC each)    │
│  src/services/           data boundary (zod-parsed)         │
│  src/schemas/            shared zod schemas                 │
├─────────────────────────────────────────────────────────────┤
│  src/utils/              pure helpers, fully tested         │
│  src/constants/          colors, sizes, hotkeys, animations │
│  src/types/              shared TypeScript types            │
└─────────────────────────────────────────────────────────────┘
```

Imports flow downward only. A `utils/` file never imports from `components/`,
a `store/` file never imports from `pages/`, and so on. The architecture
linter enforces a subset of this directly; the rest is a code-review
responsibility.

## Data flow

```
external API
     │  fetch
     ▼
src/services/*.ts      ── http(schema, request) ── zod.parse(...)
     │  typed value
     ▼
@tanstack/react-query  ── query key, staleTime, retry
     │  hook output
     ▼
component              ── memoized, useShallow on store
     │  user action
     ▼
src/store/*-store.ts   ── action method
```

There is no `useEffect` anywhere in this picture. Side effects belong to
TanStack Query or to event handlers; runtime state belongs to Zustand.

## Where things live

| Concern | Folder | Notes |
|---------|--------|-------|
| Network calls | `src/services/` | Every function ends in `schema.parse()` or `safeParse()` |
| Runtime schemas | `src/schemas/` | `z.object`/`z.union`/etc. Reused by services and tests |
| Types | `src/types/` | Pure TS shapes. Never declared inside a component file |
| Cross-cutting state | `src/store/<domain>/<name>-store.ts` | One Zustand factory per file, max 250 LOC |
| Reusable behavior | `src/hooks/<domain>/use-<name>.ts` | Hooks compose stores and queries; never own state directly |
| UI primitives | `src/components/ui/` | Base UI / Tailwind atoms; `memo()` optional |
| Domain components | `src/components/<domain>/` | Always wrapped in `memo()`, max 450 LOC, props < 8 |
| Routes | `src/pages/` | Always loaded via `lazy(() => import('@/pages/x'))` |
| Constants | `src/constants/<domain>/` | Colors, animations, hotkeys, sizes |
| Pure helpers | `src/utils/<domain>/` | No React, no DOM, easily unit-tested |

## Boundary contract

Anything entering the app from the outside world must be parsed by Zod before
it touches application code. That means:

- HTTP responses: `http(schema, request)` returns the parsed value
- LocalStorage / SessionStorage: read through `src/utils/storage`, which
  passes the raw string through `JSON.parse` plus a Zod schema
- URL search params: read via `react-router` and validated against a schema
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
bun run lint:rules   ── 26 architecture rules (scripts/lint-rules.ts)
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
