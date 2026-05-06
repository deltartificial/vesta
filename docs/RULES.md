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

## When a rule is wrong

The linter is not always right. If a rule rejects a change you're confident
about:

1. **Open a discussion** in the PR before adding `// biome-ignore` —
   silencing a rule that triggers correctly is technical debt.
2. **Update the rule, not the code.** If the rule has a real false positive,
   fix `scripts/lint-rules.ts` (and add a test) in the same PR.
3. **Document the exception** if it's case-specific. A `// biome-ignore lint/...:
   reason` line must include a reason string explaining why.
