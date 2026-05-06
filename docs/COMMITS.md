# Commit and PR conventions

Vesta enforces [Conventional Commits](https://www.conventionalcommits.org/) on
every commit message and every pull request title. The rules are checked
locally by Husky + commitlint and remotely by the `pr-title` workflow.

## Format

```
type(scope): description
```

- **type** — one of the allowed types (see below). Lowercase.
- **scope** — optional. Lowercase. Identifies the area touched (`stack`, `lint`,
  `ci`, `store`, `forms`, …).
- **description** — imperative, lowercase, no trailing period.

The full header (everything before the first blank line) must stay under
**100 characters**. Body and footer are free-form but must be separated from
the header by a blank line.

## Allowed types

| Type | When to use |
|------|-------------|
| `feat`     | A user-visible feature or capability |
| `fix`      | A bug fix |
| `perf`     | A change that improves performance without altering behavior |
| `refactor` | An internal change that preserves behavior |
| `style`    | Formatting only (whitespace, quotes, semicolons) |
| `docs`     | Documentation only |
| `test`     | Tests only |
| `bench`    | Benchmarks only |
| `build`    | Build system or external dependency change |
| `deps`     | Dependency upgrade not covered by `build` |
| `ci`       | CI configuration only |
| `chore`    | Repo maintenance with no production impact |
| `revert`   | Reverts a previous commit |

## PR titles

The PR title becomes the squash-merge commit title (`type: description (#N)`),
so it must follow the same rules. The CI job `pr-title` rejects any PR whose
title does not parse.

## Examples

```
feat(forms): add zod-backed form context
fix(store): drop stale subscriptions on hot reload
chore(deps): bump biome to 2.4
ci: gate merges on the all-green workflow
docs(architecture): add adr 0002 on routing
```

## Breaking changes

Append `!` after the type or scope, and start the body with `BREAKING CHANGE:`.

```
feat(api)!: replace fetch wrapper with typed client

BREAKING CHANGE: services/fetch is removed; import the typed client from
services/http instead.
```
