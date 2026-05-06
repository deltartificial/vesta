# ADR 0001 — Single correct pattern over flexibility

- Status: accepted
- Date: 2026-05-06

## Context

Vesta is built to scaffold AI-assisted React projects. Generative coding
assistants are creative — they can implement the same feature five different
ways, all "valid". In a flexible codebase that creativity compounds: every PR
adds a new shape, and reviewers spend their time on consistency rather than
correctness.

A traditional template optimizes for *coverage*: provide the building blocks
and let the developer compose. Vesta optimizes for *predictability*: there
is one correct shape, and tooling rejects the rest.

## Decision

For every recurring task, Vesta picks one approach and bans the others:

| Task | Approach | Banned alternatives |
|------|----------|---------------------|
| Side effects | TanStack Query, store actions, event handlers | `useEffect` |
| Cross-cut state | Zustand factories with `useShallow` | `useState` for shared state, prop drilling, Context for state |
| Network calls | `services/http` with Zod | raw `fetch`, axios, `JSON.parse` |
| Routing | `react-router` with `lazy()` | eager page imports |
| Styling | Tailwind 3 + `cn()` + `constants/ui` | inline hex, magic dimensions |
| File names | `kebab-case` | PascalCase, snake_case |
| Components | `memo()` (except primitives) | unmemoized non-primitives |
| Type imports | `import type { ... }` | mixed default + type imports |
| Versioning | release-please from conventional commits | manual bumps |

Tooling layered:

1. **Biome** — syntax-level strictness (cognitive complexity 15, no `any`,
   no `console`, no `!`, kebab-case files, etc.).
2. **`scripts/lint-rules.ts`** — 26 architecture rules that Biome cannot
   express (memo enforcement, store size limits, boundary parsing,
   forbidden libs, etc.).
3. **`bun run pr`** — single command that mirrors CI: lint, typecheck, knip,
   licenses, tests, build, size-limit.
4. **CI** (`.github/workflows/ci.yml`) — same gates run on Linux/macOS/Windows
   with an `all-green` aggregator that branch protection points at.
5. **Husky** + commitlint + lint-staged — gates that fire before code
   reaches the remote.

## Consequences

**Positive**

- AI-generated code is either correct or flagged at commit time.
- Reviewers spend their time on logic, not style.
- Refactors are mechanical: rename one symbol, every reference updates.
- The "shape" of the codebase doesn't drift even with high contributor churn.

**Negative**

- Onboarding cost: new contributors must learn the rules before their first
  PR will pass. Mitigated by `docs/RULES.md` and explicit error messages
  from the linter.
- Some legitimate patterns will be rejected and need explicit exceptions
  (`// biome-ignore`, `knip.json` entries, `.size-limit.json` adjustments).
  This is intentional friction.
- Custom rules require maintenance. The architecture linter is one TypeScript
  file we own; it will need updates as the stack evolves.

## Alternatives considered

- **ESLint with airbnb / standard config**: covers ~30 % of what we want;
  doesn't enforce architectural boundaries (memo placement, store size,
  boundary parsing).
- **Schema validation only at the type layer (TypeScript)**: catches build
  errors but not runtime ones. Users send malformed JSON; the type system
  doesn't notice.
- **Runtime checks via assertions**: too easy to skip, no compile-time gate.
- **Heavy frameworks (Next.js, Remix)**: bring opinions about routing and
  data fetching, but not about state, components, or the boundary contract —
  and add SSR complexity Vesta doesn't need.

## References

- [`ARCHITECTURE.md`](../ARCHITECTURE.md) — layer model and data flow
- [`RULES.md`](../RULES.md) — every rule with rationale and alternatives
- [`COMMITS.md`](../COMMITS.md) — commit format
