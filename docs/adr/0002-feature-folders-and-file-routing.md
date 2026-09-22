# ADR 0002 · Feature folders and file-based routing

- Status: accepted
- Date: 2026-09-23

## Context

Vesta started with one global folder per technical layer (`src/components`,
`src/hooks`, `src/store`, `src/services`) and one `app.tsx` declaring every
route by hand. That holds for a template, not for the codebases Vesta is
meant to scaffold: at around 3,500 files and 400+ routes, each global folder
becomes a catch-all, ownership is invisible, and the hand-written route table
turns into a merge-conflict hotspot where nothing checks the URL.

## Decision

1. **Split by domain first.** Domain code lives in
   `src/features/<domain>/{components,hooks,store,services,schemas,types,constants,utils}/`.
   Global folders only keep generic, shared code: `components/ui`, `hooks`,
   `services/http.ts`, `schemas`, `types`, `constants`, `utils`.
   `src/pages/` and `src/store/` are removed.
2. **Features are isolated.** A feature never imports another feature, and
   shared layers never import a feature. Routes are the only composition
   point.
3. **Routing is file-based**, with TanStack Router: one file per route under
   `src/routes/`, a generated and committed `src/route-tree.gen.ts`, and
   automatic per-route code splitting.
4. **The URL is a Zod boundary.** Path params go through
   `params: { parse: parseParams(Schema) }`, search params through
   `validateSearch: Schema`. Both are typed end to end, including `<Link>`
   and `useNavigate()`.

The linter enforces each point: `enforce-feature-structure`,
`enforce-feature-boundaries`, `require-route-schemas`, plus the existing
path-based rules (`enforce-hook-location`, `enforce-store-suffix`,
`no-unmemoized-components`, ...) now understand feature layers.
`react-router` and `react-router-dom` join the banned libraries.

## Consequences

**Positive**

- A domain can be read, owned, moved or deleted as one folder.
- Adding a route is adding a file: no shared route table to edit.
- Every route is lazy-loaded without anyone writing `lazy()`.
- Invalid URLs are rejected at the edge (404 for params, defaults for search)
  instead of leaking `undefined` or strings into components.

**Negative**

- TanStack Router costs about 26 kB gzip against 14 kB for React Router. The
  `router` size budget moves from 15 kB to 28 kB.
- The generated route tree must stay in sync. `bun run typecheck` regenerates
  it, and CI fails when the committed file differs.
- Cross-feature reuse requires moving code down to a shared layer, which is
  deliberate friction.

## Alternatives considered

- **Keep layer folders, add sub-folders per domain** (`src/components/billing`):
  keeps the catch-all at the top level and scatters one domain across five
  trees.
- **React Router v7 framework mode**: file routing exists, but params and
  search are untyped strings, so the Zod boundary would be manual.
- **Code-based TanStack Router**: typed, but brings back the central route
  table this ADR removes.

## References

- [`ARCHITECTURE.md`](../ARCHITECTURE.md), sections Layered model and Routing
- [`RULES.md`](../RULES.md), the rules listed above
- [ADR 0001](0001-single-correct-pattern.md)
