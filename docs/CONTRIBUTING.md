# Contributing

Local development and the PR loop.

## Setup

```sh
bun install
```

`bun.lockb` is the source of truth. CI runs `bun install --frozen-lockfile`,
so any dependency change must come with a regenerated lockfile.

## Day-to-day commands

| Command | What it does |
|---------|--------------|
| `bun run dev` | Vite dev server on `http://localhost:5173` |
| `bun run check` | Format and lint with Biome (writes fixes) |
| `bun run lint:rules` | Run the 26 architecture rules |
| `bun run lint:all` | Biome + architecture rules (no writes) |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run test` | Vitest in watch mode |
| `bun run test:run` | Vitest once |
| `bun run test:coverage` | Vitest with v8 coverage and 70 % thresholds |
| `bun run knip` | Find unused files, deps, exports |
| `bun run licenses` | License allowlist audit |
| `bun run build` | Type-check + Vite production build |
| `bun run size` | Check bundle sizes against `.size-limit.json` |
| `bun run pr` | Full local CI mirror (run before opening a PR) |

## Workflow

1. **Branch off `main`** with a name matching the conventional-commit type:
   `feat/<scope>`, `fix/<scope>`, `chore/<scope>`, etc.
2. **Make the change.** Keep PRs small and focused.
3. **Run `bun run pr`** — same pipeline as CI.
4. **Commit.** Husky runs lint-staged + the architecture linter + commitlint.
   The commit message must follow the [conventional-commit format](COMMITS.md).
5. **Push and open a PR.** The PR title is also linted (`pr-title.yml`). Fill
   in motivation, solution, and the checklist.
6. **CI runs.** All jobs in `.github/workflows/ci.yml` plus `pr-title.yml`
   must be green. The `all-green` job aggregates the others.
7. **Squash and merge** into `main` — the squash merge preserves the
   `(#N)` suffix in the commit title, which release-please depends on.

## When CI fails

Read the logs first. Common cases:

- **Biome failure** → run `bun run check` locally to apply autofixes.
- **Architecture-rules failure** → the message names the rule and the
  alternative. See [`RULES.md`](RULES.md) for full context.
- **Typecheck failure** → strict TS settings; see `tsconfig.json`.
- **Knip failure** → either remove the unused symbol/file, or add it to
  `knip.json`'s `entry` if it's an example users will re-export.
- **Size-limit failure** → either trim the bundle or, if the growth is
  legitimate, raise the budget in `.size-limit.json` in the same PR.

## Adding a new architecture rule

If the codebase keeps producing the same shape of bug or smell:

1. Open an ADR under `docs/adr/` describing the constraint and why generic
   tooling can't catch it.
2. Add a `checkX` function to `scripts/lint-rules.ts` and call it from the
   `check(filePath)` orchestrator.
3. Document the rule in `docs/RULES.md` (banned/required/limit section, plus
   the alternative).
4. Run `bun run lint:rules` against the existing tree. Either it passes
   (rule is well-targeted) or it surfaces existing violations (fix them in
   the same PR or follow-up).
5. Submit as `feat(lint): <rule>` — the commit type is `feat` because users
   see new errors at commit time.

## Adding a new dependency

1. Justify the addition in the PR description: what does the existing stack
   not cover.
2. `bun add <pkg>` (or `bun add -d <pkg>` for dev).
3. If the dep ships under a non-permissive license, the `licenses` job will
   fail; either pick a different lib or document the exception in
   `docs/adr/`.
4. If the dep is heavy, expect the `size-limit` job to fail; raise the
   budget intentionally with the rationale in the PR.
5. New `dependencies` count toward the bundle. Prefer `devDependencies` for
   anything that runs only at build time.

## Release

Releases are automated by release-please — see [`RELEASES.md`](RELEASES.md).
Maintainers merge the release PR when ready; everything else is automatic.
