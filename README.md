# Vesta

An ultra-strict React + TypeScript workspace template for AI-assisted
development.

There is one correct way to do every common task. Tooling rejects deviations
at commit time, in CI, and at release time — so AI-generated code stays on
rails and human reviewers spend their time on logic, not consistency.

## Stack

- **Build**: Vite 7 with esbuild, gzip + brotli compression, deterministic
  manualChunks (vendor / router / query / state / forms / animation / ui)
- **Framework**: React 19 with `react-router-dom` v7 (lazy routes only)
- **State**: Zustand factories with `useShallow`
- **Data**: TanStack Query (the only side-effect anchor) + Zod schemas at
  every external boundary
- **Forms**: react-hook-form + `@hookform/resolvers` + Zod
- **UI primitives**: Base UI (headless) + Tailwind 3
- **Animation**: Framer Motion
- **Tests**: Vitest + Testing Library + jsdom + v8 coverage
- **Lint / format**: Biome 2 with kebab-case filenames, no `any`, no
  `console`, no `!`, cognitive complexity capped at 15
- **Architecture rules**: 26 custom rules in `scripts/lint-rules.ts` running
  on every commit (no `useEffect`, no `as` casts, memo enforcement, store
  size limits, boundary parsing, banned libs, …)
- **Quality gates**: knip (unused), size-limit (gzip budgets per chunk),
  typos (spellcheck), license-checker (allowlist)
- **Releases**: release-please from conventional commits

## Quickstart

```sh
bun install
bun run dev          # http://localhost:5173
bun run pr           # full local CI mirror before pushing
```

## Documentation

| Doc | Topic |
|-----|-------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layered model, data flow, where things live |
| [docs/RULES.md](docs/RULES.md) | Every architecture rule with rationale and alternatives |
| [docs/COMMITS.md](docs/COMMITS.md) | Commit and PR title format |
| [docs/RELEASES.md](docs/RELEASES.md) | Versioning and changelog automation |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Local workflow, PR loop, and gotchas |
| [docs/adr/](docs/adr/) | Architecture Decision Records |
| [CLAUDE.md](CLAUDE.md) | Instructions for AI contributors |

## Workflow

```
git commit
   ↓ husky pre-commit
lint-staged → biome → architecture linter
   ↓ husky commit-msg
commitlint → conventional-commit format
   ↓ git push
PR opened
   ↓ ci.yml
biome / typecheck / architecture-rules / test (linux/mac/win) /
coverage / build / knip / licenses / typos / size-limit / all-green
   ↓ pr-title.yml
PR title validated
   ↓ squash & merge
main updated → release.yml → release-please opens "chore: release X.Y.Z" PR
   ↓ merge release PR
git tag vX.Y.Z + GitHub Release with rendered changelog
```

## License

Dual-licensed under [MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE) at
your option.
