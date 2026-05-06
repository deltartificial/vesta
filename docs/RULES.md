# Architecture rules reference

26 rules enforced by `scripts/lint-rules.ts`, plus the structural rules from
Biome. Each rule names what it forbids and what to do instead.

## Banned patterns

### `no-useEffect`
`useEffect` and any equivalent side-effect anchor. **Use** TanStack Query for
async work, store actions for state mutations, or event handlers for direct
user-driven effects. `useLayoutEffect` is allowed for genuine measurement.

### `no-comments`
Inline `//` and `/* */` comments. **Use** self-explanatory names, smaller
functions, JSDoc for public API, and the PR description for context. Allowed
exceptions: `// @ts-...`, `// biome-ignore ...`, `// eslint-...`, JSDoc
(`/** ... */`).

### `no-inline-types`
`interface` or `type` declared inside `src/components/**`. **Use** a file
under `src/types/<domain>/` and import the type.

### `no-magic-colors`
Tailwind hex shortcuts (`text-[#fff]`), inline `style={{ color: "#..." }}`,
or `rgb()/rgba()` in JSX. **Use** `src/constants/ui/colors.ts`.

### `no-handle-prefix`
`const handleClick = ...`, `function handleSubmit() ...`, etc. **Use** the
`on*` form (`onClick`), or call store actions directly without a wrapper.

### `no-default-export`
`export default` outside `src/app.tsx` and `src/pages/**`. **Use** named
exports so renames are mechanical and tooling can find every reference.

### `no-as-casts`
`as Foo`, `as string`, `as unknown as Foo`. **Use** `satisfies`, a type
guard, or a Zod schema's parsed output. `as const` is allowed.

### `no-direct-storage`
`localStorage.foo`, `sessionStorage.foo`. **Use** the typed wrapper in
`src/utils/storage` so reads go through a schema and writes through a
serializer.

### `no-native-date`
`new Date()`, `Date.now()` outside `src/utils/date/`. **Use** the date
utility, which makes the timezone and source-of-time explicit.

### `no-banned-libs`
Imports from `lodash`, `moment`, `dayjs`, `axios`, `underscore`, `request`.
**Use** the standard alternatives: native arrays/objects, `date-fns`, native
`fetch` via `services/http`.

### `no-window-navigation`
`window.location.href = ...`, `window.location.assign(...)`,
`window.location.replace(...)`. **Use** `useNavigate()` from React Router.

### `no-untyped-fetch`
`fetch(...)` outside `src/services/**`. **Use** `http(schema, request)` so
every payload is validated before it enters the app.

### `no-json-parse`
`JSON.parse(...)`. **Use** a Zod schema's `.parse()` or `.safeParse()`.

### `no-setTimeout-in-component`
`setTimeout` / `setInterval` inside `src/components/**` without a paired
clear function. **Use** a hook under `src/hooks/` that tracks the timer ID
and clears it on unmount.

### `no-multiple-conditionals`
Three or more `{variable === "x" && <Foo />}` blocks on the same variable in
one file. **Use** a component map: `const components = { x: Foo, y: Bar }`
then `const Component = components[variable]`.

## Required patterns

### `no-unmemoized-components`
Every component file under `src/components/` (except `src/components/ui/`)
must be wrapped with `memo()`. Primitives in `ui/` are exempt because the
indirection cost outweighs the benefit.

### `no-inline-handlers`
Inline arrow functions in event handler props are forbidden when they
contain logic (calls to `e.preventDefault`, `e.stopPropagation`, `target.*`,
`currentTarget.*`, `style.*`). **Use** `useCallback` and pass a stable
reference.

### `use-shallow-required`
Destructuring two or more properties from a Zustand store without
`useShallow` triggers excess re-renders. **Use** `useShallow` or select a
single property at a time.

### `enforce-store-suffix`
Files under `src/store/` end with `-store.ts`, or are exactly `index.ts`.

### `enforce-hook-location`
A `useX` declaration must live in `src/hooks/`, `src/store/`, or inside a
component file. Hooks defined elsewhere fail the linter.

### `no-eager-page-import`
`src/app.tsx` is the only file allowed to import pages, and it must do so
via `lazy(() => import('@/pages/x'))`. Direct `import X from '@/pages/x'`
is forbidden so chunks split by route automatically.

### `require-zod-at-boundary`
Every non-test, non-`index.ts` file under `src/services/` must invoke
`.parse(...)` or `.safeParse(...)` somewhere. A service without a Zod call
is leaking unvalidated data into the app.

## Limits

### `max-store-size`
A `-store.ts` file over **250 lines** fails. Split by sub-domain or extract
helpers to `src/utils/store/`.

### `max-component-size`
A component file over **450 lines** fails. Extract sub-components into the
same domain folder.

### `max-useState`
More than **3** `useState` calls in one component file fails. Move state
into a Zustand store or a `useReducer`.

### `max-imports`
More than **25** import statements in one file fails. The file is doing too
much; extract a sub-module.

## Performance rules

These live under `scripts/lint-rules/rules/perf/` and target React/web-perf
anti-patterns rather than architectural shape. All are regex-based, so they
favor false negatives over false positives — the goal is to catch the
obvious cases without blocking edge cases.

### Bundle (`perf/bundle/*`)

| Rule | What |
|------|------|
| `perf/bundle-barrel-imports` | Imports from `lucide-react`, `@mui/material`, `@radix-ui/react-icons`, `@hugeicons/react`, `react-icons`, `@mui/icons-material` without a deep subpath. Barrel modules ship the whole package. |
| `perf/bundle-analyzable-paths` | `import('./x' + name)` and `` import(`./x${name}`) `` defeat static analysis. Use a literal or a `switch` of literal imports. |
| `perf/bundle-defer-third-party` | Static imports of analytics/observability libs (`@sentry/*`, `@datadog/*`, `posthog-js`, `mixpanel-browser`, `@hotjar/*`, `amplitude-js`). Lazy-load them after hydration. |
| `perf/bundle-dynamic-imports` | Static imports of known-heavy libs (`monaco-editor`, `recharts`, `react-syntax-highlighter`, `prismjs`, `mermaid`, `react-pdf`, `jspdf`, `html2canvas`, `@tiptap/*`). Wrap in `lazy(() => import(...))`. |

### Client (`perf/client/*`)

| Rule | What |
|------|------|
| `perf/passive-event-listeners` | `addEventListener('touchstart' \| 'touchmove' \| 'touchend' \| 'wheel' \| 'mousewheel', ...)` without `{ passive: true }`. Blocks scrolling on mobile. |

### JavaScript (`perf/js/*`)

| Rule | What |
|------|------|
| `perf/combine-iterations` | `.filter(...).filter(...)` or similar chains that walk the array twice. |
| `perf/flatmap-filter` | `.map(...).filter(Boolean)`. Use `.flatMap` returning `[]` or `[value]`. |
| `perf/hoist-regexp` | `new RegExp(...)` inside a function body. Hoist to module scope or wrap in `useMemo` for dynamic patterns. |
| `perf/min-max-loop` | `.sort(...)[0]` or `.sort(...).at(...)` — sorting to read one element is `O(n log n)`. |
| `perf/tosorted-immutable` | `.sort(...)` mutates in place. Use `.toSorted()` or sort a spread copy. |

### Rendering (`perf/rendering/*`)

| Rule | What |
|------|------|
| `perf/animate-svg-wrapper` | `<svg className="animate-...">`. Wrap in a `<div>` and animate the wrapper for hardware acceleration. |
| `perf/hydration-suppress-warning` | `Math.random()` / `crypto.getRandomValues()` directly in JSX without `suppressHydrationWarning`. |
| `perf/script-defer-async` | `<script src="...">` without `defer`, `async`, or `type="module"`. Blocks HTML parsing. |
| `perf/svg-precision` | SVG `path` coordinates with 3+ decimal places. Round to one decimal. |
| `perf/usetransition-loading` | `useState(false)` + `setIsLoading(true)` around an `await`. Use `useTransition` so the previous UI stays interactive. |

### Re-render (`perf/rerender/*`)

| Rule | What |
|------|------|
| `perf/lazy-state-init` | `useState(buildIndex(items))` runs the call every render. Pass an arrow: `useState(() => buildIndex(items))`. |
| `perf/memo-default-value` | Default parameter `= () => {}`, `= []`, `= {}` inside `memo()`. New reference every render — defeats memoization. Hoist the default. |
| `perf/no-inline-components` | Component-shaped declaration (`const Foo = () => <...>` or `function Foo() { ... }`) inside another function. Recreated every render. Move to module scope. |
| `perf/simple-expression-in-memo` | `useMemo(() => a \|\| b, [a, b])` and similar trivial expressions. The memo overhead is more than recomputation. |
| `perf/rerender-transitions` | High-frequency listeners (scroll, resize, input, mousemove) that call `setState`. Wrap in `startTransition` or `useTransition`. |
| `perf/use-ref-transient` | `setX(e.clientX)` and similar pointer/scroll/touch values stored in `useState`. Use `useRef` and write to a DOM node directly. |

## Biome-enforced rules

These run via `bun run check:ci`, not the custom linter:

| Rule | Setting |
|------|---------|
| `useFilenamingConvention` | `kebab-case` |
| `noNonNullAssertion` | error — banned |
| `noExplicitAny` | error — banned |
| `noConsole` | error — banned outside `scripts/**` and tests |
| `noDebugger` | error — banned |
| `noUnusedImports` | error |
| `noUnusedVariables` | error |
| `noExcessiveCognitiveComplexity` | error at threshold **15** |
| `noUselessFragments` | error |
| `noAccumulatingSpread` | error |
| `noDelete` | error |
| `useImportType` | error — type-only imports must use `import type` |

## Configuring rules

Every rule is `error` by default. Three mechanisms to change that, applied in
order — the last one wins:

### 1. Repo-root config — `lint-rules.config.json`

```json
{
  "$schema": "./scripts/lint-rules/config.schema.json",
  "rules": {
    "no-comments": "off",
    "max-useState": { "options": { "max": 10 } },
    "perf/tosorted-immutable": "warn",
    "max-component-size": { "severity": "error", "options": { "maxLines": 600 } }
  },
  "overrides": [
    {
      "includes": ["src/legacy/**"],
      "rules": { "no-as-casts": "off" }
    },
    {
      "includes": ["src/components/big-page/**"],
      "rules": { "max-component-size": "off" }
    }
  ]
}
```

Each rule entry is either a severity string (`"off" | "warn" | "error"`) or
an object `{ severity?, options? }`. Includes are globs relative to repo
root: `**` matches any depth, `*` matches one path segment.

### 2. File-level — top-of-file directive

```ts
// vesta-disable-file max-component-size, max-imports -- being refactored, see #234
```

Disables the listed rules for the entire file. The reason after `--` is
mandatory — without it, the linter emits `[lint-rules-meta]
vesta-disable-file requires a reason after \`--\``.

### 3. Inline — line-level directive

```ts
// vesta-disable-next-line no-as-casts -- LegacyConfig has no zod schema
const config = data as LegacyConfig;
```

Suppresses the listed rules on the next non-comment line only.

For a block:

```ts
// vesta-disable no-json-parse, no-untyped-fetch -- raw IPC bridge
function rawHandshake() {
  const data = JSON.parse(...);
  const r = await fetch(...);
}
// vesta-enable no-json-parse, no-untyped-fetch
```

`vesta-enable` without a rule list closes every open block in the file.

### Tunable options per rule

| Rule | Option | Default |
|------|--------|---------|
| `max-component-size` | `maxLines` | 450 |
| `max-store-size` | `maxLines` | 250 |
| `max-imports` | `max` | 25 |
| `max-useState` | `max` | 3 |

### Resolution order

```
1. Default                                 (severity: "error", default options)
2. config.rules[ruleName]                  (global override)
3. config.overrides[*].rules[ruleName]     (file matches an includes pattern)
4. // vesta-disable-file <ruleName>        (top-of-file)
5. // vesta-disable / vesta-enable         (open block at this line)
6. // vesta-disable-next-line <ruleName>   (line directly above)
```

Severities cascade through every level. Options merge — if level 2 sets
`maxLines: 600` and level 3 sets `maxLines: 800` for a specific path, the
file-specific 800 wins for matching files.

## When a rule is wrong

The linter is not always right. If a rule rejects a change you're confident
about:

1. **Open a discussion** in the PR before adding `// biome-ignore` —
   silencing a rule that triggers correctly is technical debt.
2. **Update the rule, not the code.** If the rule has a real false positive,
   fix `scripts/lint-rules.ts` (and add a test) in the same PR.
3. **Document the exception** if it's case-specific. A `// biome-ignore lint/...:
   reason` line must include a reason string explaining why.
