# Vesta — instructions for AI contributors

Vesta is an ultra-strict React/TypeScript template. There is **one correct way**
to do every common task; anything else fails the linter, the custom rule
runner, or CI.

This file is the index. Detailed rules will land in `docs/` over the next
layers. For now, what matters:

## Non-negotiable principles

1. **No `useEffect`.** Side effects belong to TanStack Query. State belongs to
   Zustand. Local UI state (`useState`) only for ephemeral interactions.
2. **No code comments** except `@ts-`, `biome-ignore`, and JSDoc for public
   APIs. If a comment seems necessary, the code is unclear — fix the code.
3. **No magic values.** Colors, dimensions, timings, and string identifiers
   live in `src/constants/`.
4. **No `as` casts** outside `as const`. Use `satisfies` or runtime validation.
5. **Files are kebab-case.** Components, hooks, stores, types — everything.
6. **Components in `src/components/` are wrapped in `memo()`** unless they live
   in `src/components/ui/` (primitives).
7. **Stores end with `-store.ts`** and stay under 250 lines. Components stay
   under 450 lines. If a file outgrows the budget, split it.
8. **Conventional commits.** Format: `type(scope): description`. The PR title
   check in CI rejects anything else.

## Workflow

- `bun run dev` — local dev server
- `bun run check` — Biome format + lint with autofix
- `bun run lint:all` — Biome + custom architecture rules
- `bun run test` — Vitest (watch mode)
- `bun run pr` — full local CI mirror; run before opening a PR

## When you write code here

- Prefer editing existing files over creating new ones.
- Never add features, abstractions, or fallbacks beyond what the task asks.
- Never add comments to explain *what* — only *why* it isn't obvious.
- If a tool rejects your change, fix the underlying issue. Do not add
  `biome-ignore` to silence a real warning.
