# Releases

Vesta uses [release-please](https://github.com/googleapis/release-please) to
automate version bumps, changelog generation, and GitHub releases.

## How it works

1. Every push to `main` triggers `.github/workflows/release.yml`.
2. release-please scans commits since the previous release tag.
3. Based on the [conventional-commit](COMMITS.md) types, it computes the next
   semver bump and opens (or updates) a single release PR titled
   `chore: release X.Y.Z`.
4. The release PR contains the version bump in `package.json`, an updated
   `CHANGELOG.md`, and the manifest entry.
5. Merging the release PR creates a Git tag `vX.Y.Z` and a GitHub Release with
   the changelog notes.

## Bump rules

| Commit type | Pre-1.0.0 effect | Post-1.0.0 effect |
|-------------|------------------|-------------------|
| `feat:` | minor (`0.X.0`) | minor (`X.Y.0`) |
| `fix:` | patch suppressed pre-1.0.0; rolls into the next minor | patch (`X.Y.Z`) |
| `feat!:`, `BREAKING CHANGE:` | minor pre-1.0.0 (no `0.0.0` → `1.0.0`) | major (`X.0.0`) |
| `chore:`, `docs:`, `test:`, `ci:`, `style:` | no version impact | no version impact |
| `perf:`, `refactor:`, `build:`, `deps:`, `revert:` | bump if marked as fix-equivalent | bump if marked as fix-equivalent |

`bump-minor-pre-major: true` and `bump-patch-for-minor-pre-major: false` mean
that until the first `1.0.0`, `feat:` bumps the minor and everything else
defers — the changelog still records every entry.

## Changelog sections

| Section | Commit types |
|---------|--------------|
| Features | `feat` |
| Bug Fixes | `fix` |
| Performance | `perf` |
| Refactor | `refactor` |
| Documentation | `docs` |
| Build | `build` |
| Dependencies | `deps` |
| Reverts | `revert` |
| _hidden_ | `test`, `ci`, `chore`, `style` |

Hidden types still bump version when applicable; they just don't appear in the
user-facing changelog.

## Repository prerequisite

`release.yml` opens a pull request from a GitHub Actions run. New repositories
disable this by default and the workflow fails with
`GitHub Actions is not permitted to create or approve pull requests`.

Enable it once, manually:

> **Settings → Actions → General → Workflow permissions**
> ✔ Allow GitHub Actions to create and approve pull requests

After flipping the toggle, push a fresh commit to `main` (or re-run the latest
`release` workflow) to trigger release-please.

## Workflow permissions

The default `${{ secrets.GITHUB_TOKEN }}` is sufficient to open and merge the
release PR. Note that PRs opened by `GITHUB_TOKEN` do **not** trigger the
`ci.yml` workflow by default — to require CI on the release PR, replace the
token with a Personal Access Token stored as `RELEASE_PLEASE_TOKEN` and
update `.github/workflows/release.yml`.
