#!/usr/bin/env bun
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

const MAX_STORE_LINES = 250;
const MAX_COMPONENT_LINES = 450;
const MAX_USE_STATE = 3;
const MAX_IMPORTS = 25;
const MIN_CONDITIONALS_FOR_MAPPING = 3;
const BANNED_LIBS = ["lodash", "moment", "dayjs", "axios", "underscore", "request"];

const DEFAULT_EXPORT_ALLOWED = new Set([join("src", "app.tsx")]);
const DEFAULT_EXPORT_ALLOWED_DIRS = [join("src", "pages") + sep];
const NATIVE_DATE_ALLOWED_DIRS = [join("src", "utils", "date") + sep];
const FETCH_ALLOWED_DIRS = [join("src", "services") + sep];
const STORE_DIR = join("src", "store") + sep;
const HOOKS_DIR = join("src", "hooks") + sep;
const COMPONENTS_DIR = join("src", "components") + sep;
const COMPONENTS_UI_DIR = join("src", "components", "ui") + sep;
const SERVICES_DIR = join("src", "services") + sep;
const APP_FILE = join("src", "app.tsx");

interface LintError {
  filePath: string;
  line: number;
  rule: string;
  message: string;
}

const errors: LintError[] = [];

function addError(filePath: string, line: number, rule: string, message: string) {
  errors.push({ filePath, line, rule, message });
}

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.d\.ts$/.test(entry.name)) {
      yield full;
    }
  }
}

function isComponentFile(rel: string): boolean {
  return rel.startsWith(COMPONENTS_DIR) && rel.endsWith(".tsx");
}

function isUiPrimitive(rel: string): boolean {
  return rel.startsWith(COMPONENTS_UI_DIR);
}

function isStoreFile(rel: string): boolean {
  return rel.startsWith(STORE_DIR) && rel.endsWith(".ts");
}

function isInDir(rel: string, dirs: string[]): boolean {
  return dirs.some((d) => rel.startsWith(d));
}

function isTestFile(rel: string): boolean {
  return /\.(test|spec)\.tsx?$/.test(rel);
}

function checkNoUseEffect(rel: string, lines: string[]) {
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//")) return;
    if (/\buseEffect\b/.test(line)) {
      addError(
        rel,
        index + 1,
        "no-useEffect",
        "useEffect is forbidden. Use TanStack Query for side effects or move state to a Zustand store.",
      );
    }
  });
}

function isAllowedLineComment(trimmed: string): boolean {
  return (
    trimmed.startsWith("// @ts-") ||
    trimmed.startsWith("// biome-ignore") ||
    trimmed.startsWith("// eslint-")
  );
}

function checkNoComments(rel: string, lines: string[]) {
  if (isTestFile(rel)) return;
  let inBlock = false;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (inBlock) {
      if (trimmed.includes("*/")) inBlock = false;
      return;
    }
    if (trimmed.startsWith("/**")) return;
    if (trimmed.startsWith("/*")) {
      if (!trimmed.includes("*/")) inBlock = true;
      addError(rel, index + 1, "no-comments", "Block comments are forbidden. Use JSDoc instead.");
      return;
    }
    if (trimmed.startsWith("//") && !isAllowedLineComment(trimmed)) {
      addError(
        rel,
        index + 1,
        "no-comments",
        "Code comments are forbidden. Code must be self-explanatory.",
      );
    }
  });
}

function checkNoInlineTypes(rel: string, lines: string[]) {
  if (!isComponentFile(rel)) return;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (/^export\s+(interface|type)\s/.test(trimmed) || /^(interface|type)\s+[A-Z]/.test(trimmed)) {
      addError(
        rel,
        index + 1,
        "no-inline-types",
        "Types and interfaces must live under src/types/, not in components.",
      );
    }
  });
}

function checkNoMagicColors(rel: string, lines: string[]) {
  const tailwindHex =
    /\b(text|bg|border|fill|stroke|ring|outline|shadow|from|to|via)-\[#[0-9a-fA-F]+\]/;
  const inlineHex = /style\s*=\s*\{\{[^}]*#[0-9a-fA-F]{3,8}/;
  const inlineRgb = /style\s*=\s*\{\{[^}]*rgba?\s*\(/;
  lines.forEach((line, index) => {
    if (tailwindHex.test(line) || inlineHex.test(line) || inlineRgb.test(line)) {
      addError(
        rel,
        index + 1,
        "no-magic-colors",
        "Color values must come from src/constants/ui/colors.ts, not inline.",
      );
    }
  });
}

function checkNoHandlePrefix(rel: string, lines: string[]) {
  const handleDecl = /\b(const|let|function)\s+handle[A-Z][a-zA-Z]*/;
  lines.forEach((line, index) => {
    if (handleDecl.test(line)) {
      addError(
        rel,
        index + 1,
        "no-handle-prefix",
        "Use the on* prefix or call store actions directly. handle* is forbidden.",
      );
    }
  });
}

function checkNoUnmemoizedComponents(rel: string, content: string) {
  if (!isComponentFile(rel)) return;
  if (isUiPrimitive(rel)) return;
  const exportFn = /export\s+(default\s+)?function\s+([A-Z][a-zA-Z]*)/;
  const exportConst = /export\s+(default\s+)?const\s+([A-Z][a-zA-Z]*)\s*=/;
  const memoCall = /\bmemo\s*\(/;
  const matchFn = exportFn.exec(content);
  const matchConst = exportConst.exec(content);
  const componentName = matchFn?.[2] ?? matchConst?.[2];
  if (!componentName) return;
  if (!memoCall.test(content)) {
    addError(
      rel,
      1,
      "no-unmemoized-components",
      `Component ${componentName} must be wrapped with memo(). Only src/components/ui/ primitives are exempt.`,
    );
  }
}

function checkNoInlineHandlers(rel: string, lines: string[]) {
  if (!isComponentFile(rel)) return;
  const handlerEvent =
    /\b(onClick|onMouseEnter|onMouseLeave|onMouseMove|onMouseDown|onMouseUp|onChange|onSubmit|onFocus|onBlur|onKeyDown|onKeyUp|onScroll)\s*=\s*\{\s*\([^)]*\)\s*=>/;
  lines.forEach((line, index) => {
    if (
      handlerEvent.test(line) &&
      (line.includes("style.") ||
        line.includes("currentTarget") ||
        line.includes("target.") ||
        line.includes("preventDefault") ||
        line.includes("stopPropagation"))
    ) {
      addError(
        rel,
        index + 1,
        "no-inline-handlers",
        "Inline handlers with logic must use useCallback. Extract to a memoized handler.",
      );
    }
  });
}

function checkMaxStoreSize(rel: string, lines: string[]) {
  if (!isStoreFile(rel)) return;
  if (lines.length > MAX_STORE_LINES) {
    addError(
      rel,
      1,
      "max-store-size",
      `Store has ${lines.length} lines, exceeds ${MAX_STORE_LINES}. Split into smaller stores.`,
    );
  }
}

function checkMaxComponentSize(rel: string, lines: string[]) {
  if (!isComponentFile(rel)) return;
  if (lines.length > MAX_COMPONENT_LINES) {
    addError(
      rel,
      1,
      "max-component-size",
      `Component has ${lines.length} lines, exceeds ${MAX_COMPONENT_LINES}. Extract sub-components.`,
    );
  }
}

function checkUseShallow(rel: string, content: string, lines: string[]) {
  const destructure = /const\s*\{\s*([\w\s,]+)\}\s*=\s*use[A-Z][a-zA-Z]*Store\s*\(\s*\)/;
  lines.forEach((line, index) => {
    const match = destructure.exec(line);
    if (!match) return;
    const props = (match[1] ?? "").split(",").filter((p) => p.trim().length > 0);
    if (props.length >= 2 && !content.includes("useShallow")) {
      addError(
        rel,
        index + 1,
        "use-shallow-required",
        "Destructuring multiple properties from a store without useShallow causes excess re-renders.",
      );
    }
  });
}

function checkNoMultipleConditionals(rel: string, content: string) {
  const pattern = /\{(\w+)\s*===\s*["'](\w+)["']\s*&&/g;
  const counts = new Map<string, number>();
  const firstLine = new Map<string, number>();
  const lines = content.split("\n");
  lines.forEach((line, index) => {
    pattern.lastIndex = 0;
    for (const m of line.matchAll(pattern)) {
      const variable = m[1];
      if (!variable) continue;
      counts.set(variable, (counts.get(variable) ?? 0) + 1);
      if (!firstLine.has(variable)) firstLine.set(variable, index + 1);
    }
  });
  for (const [variable, count] of counts) {
    if (count >= MIN_CONDITIONALS_FOR_MAPPING) {
      addError(
        rel,
        firstLine.get(variable) ?? 1,
        "no-multiple-conditionals",
        `Variable '${variable}' has ${count} conditional renders. Use a component mapping pattern.`,
      );
    }
  }
}

function checkNoAsCasts(rel: string, lines: string[]) {
  const asCast =
    /\bas\s+(?!const\b)(?:[A-Z]\w*|string\b|number\b|boolean\b|object\b|symbol\b|bigint\b|any\b|unknown\b|never\b|void\b)/;
  const asUnknownChain = /\bas\s+unknown\s+as\b/;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
    if (asUnknownChain.test(line)) {
      addError(
        rel,
        index + 1,
        "no-as-casts",
        "as unknown as X double-cast is forbidden. Validate with Zod or use a type guard.",
      );
      return;
    }
    if (asCast.test(line)) {
      addError(
        rel,
        index + 1,
        "no-as-casts",
        "Type assertions (as Foo) are forbidden. Use satisfies, type guards, or Zod parsing.",
      );
    }
  });
}

function checkNoDefaultExport(rel: string, lines: string[]) {
  if (DEFAULT_EXPORT_ALLOWED.has(rel)) return;
  if (isInDir(rel, DEFAULT_EXPORT_ALLOWED_DIRS)) return;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (/^export\s+default\b/.test(trimmed)) {
      addError(
        rel,
        index + 1,
        "no-default-export",
        "Default exports are forbidden outside src/app.tsx and src/pages/. Use named exports.",
      );
    }
  });
}

function checkNoDirectStorage(rel: string, lines: string[]) {
  const storageAccess = /\b(localStorage|sessionStorage)\s*\./;
  lines.forEach((line, index) => {
    if (storageAccess.test(line)) {
      addError(
        rel,
        index + 1,
        "no-direct-storage",
        "Use the typed storage utility under src/utils/storage instead of localStorage/sessionStorage.",
      );
    }
  });
}

function checkNoNativeDate(rel: string, lines: string[]) {
  if (isInDir(rel, NATIVE_DATE_ALLOWED_DIRS)) return;
  const newDate = /\bnew\s+Date\s*\(/;
  const dateNow = /\bDate\.now\s*\(/;
  lines.forEach((line, index) => {
    if (newDate.test(line) || dateNow.test(line)) {
      addError(
        rel,
        index + 1,
        "no-native-date",
        "Wrap date access in src/utils/date so timezone and source-of-time stay explicit.",
      );
    }
  });
}

function checkNoBannedLibs(rel: string, lines: string[]) {
  lines.forEach((line, index) => {
    const m = /\bfrom\s+["']([^"']+)["']/.exec(line);
    if (!m) return;
    const lib = m[1] ?? "";
    const root = lib.startsWith("@") ? lib.split("/").slice(0, 2).join("/") : lib.split("/")[0];
    if (root && BANNED_LIBS.includes(root)) {
      addError(
        rel,
        index + 1,
        "no-banned-libs",
        `Library '${root}' is banned. Use the standard alternative (date-fns, native fetch, etc.).`,
      );
    }
  });
}

function checkNoWindowNavigation(rel: string, lines: string[]) {
  const windowNav = /\bwindow\.location\.(href|assign|replace)\s*=?/;
  lines.forEach((line, index) => {
    if (windowNav.test(line)) {
      addError(
        rel,
        index + 1,
        "no-window-navigation",
        "Use react-router's useNavigate(). Direct window.location mutation is forbidden.",
      );
    }
  });
}

function checkNoUntypedFetch(rel: string, lines: string[]) {
  if (isInDir(rel, FETCH_ALLOWED_DIRS)) return;
  if (isTestFile(rel)) return;
  const rawFetch = /\bfetch\s*\(/;
  lines.forEach((line, index) => {
    if (rawFetch.test(line) && !line.includes("//")) {
      addError(
        rel,
        index + 1,
        "no-untyped-fetch",
        "Raw fetch() is forbidden outside src/services/. Use http(schema, request) so the response is parsed.",
      );
    }
  });
}

function checkNoJsonParse(rel: string, lines: string[]) {
  if (isTestFile(rel)) return;
  const jsonParse = /\bJSON\.parse\s*\(/;
  lines.forEach((line, index) => {
    if (jsonParse.test(line)) {
      addError(
        rel,
        index + 1,
        "no-json-parse",
        "JSON.parse is forbidden. Validate the payload with a Zod schema.",
      );
    }
  });
}

function checkMaxUseState(rel: string, lines: string[]) {
  if (!isComponentFile(rel)) return;
  let count = 0;
  let firstLine = 0;
  lines.forEach((line, index) => {
    if (/\buseState\s*[<(]/.test(line)) {
      count += 1;
      if (firstLine === 0) firstLine = index + 1;
    }
  });
  if (count > MAX_USE_STATE) {
    addError(
      rel,
      firstLine || 1,
      "max-useState",
      `${count} useState calls exceed the limit of ${MAX_USE_STATE}. Move state into a Zustand store or a reducer.`,
    );
  }
}

function checkMaxImports(rel: string, lines: string[]) {
  let count = 0;
  let lastImportLine = 0;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = (lines[i] ?? "").trim();
    if (
      trimmed.startsWith("import ") ||
      trimmed.startsWith("import{") ||
      trimmed.startsWith("import(")
    ) {
      count += 1;
      lastImportLine = i + 1;
    }
  }
  if (count > MAX_IMPORTS) {
    addError(
      rel,
      lastImportLine,
      "max-imports",
      `${count} imports exceed the limit of ${MAX_IMPORTS}. Extract sub-modules or split this file.`,
    );
  }
}

function checkEnforceStoreSuffix(rel: string) {
  if (!rel.startsWith(STORE_DIR)) return;
  if (rel.endsWith("index.ts")) return;
  if (isTestFile(rel)) return;
  if (!rel.endsWith("-store.ts")) {
    addError(
      rel,
      1,
      "enforce-store-suffix",
      "Files under src/store/ must end with -store.ts (or be named index.ts).",
    );
  }
}

function checkEnforceHookLocation(rel: string, lines: string[]) {
  if (rel.startsWith(HOOKS_DIR)) return;
  if (rel.startsWith(STORE_DIR)) return;
  if (isComponentFile(rel)) return;
  if (isTestFile(rel)) return;
  const hookDecl = /\b(?:export\s+)?(?:const|function)\s+(use[A-Z]\w*)\s*[=(<]/;
  lines.forEach((line, index) => {
    if (hookDecl.test(line)) {
      addError(
        rel,
        index + 1,
        "enforce-hook-location",
        "Hooks (useX) must live under src/hooks/, src/store/, or inside a component file.",
      );
    }
  });
}

function checkNoEagerPageImport(rel: string, lines: string[]) {
  if (rel !== APP_FILE) return;
  lines.forEach((line, index) => {
    if (line.includes("@/pages/") && line.startsWith("import ") && !line.includes("type ")) {
      addError(
        rel,
        index + 1,
        "no-eager-page-import",
        "Pages must be loaded lazily: const X = lazy(() => import('@/pages/x')).",
      );
    }
  });
}

function checkRequireZodAtBoundary(rel: string, content: string) {
  if (!rel.startsWith(SERVICES_DIR)) return;
  if (rel.endsWith(".test.ts") || rel.endsWith(".test.tsx")) return;
  if (rel.endsWith("index.ts")) return;
  if (!/\.(parse|safeParse)\s*\(/.test(content)) {
    addError(
      rel,
      1,
      "require-zod-at-boundary",
      "Service modules must validate payloads with a Zod schema (.parse or .safeParse).",
    );
  }
}

function checkNoSetTimeoutInComponent(rel: string, content: string, lines: string[]) {
  if (!isComponentFile(rel)) return;
  const timer = /\b(setTimeout|setInterval)\s*\(/;
  if (!/\b(useEffect|useLayoutEffect|cleanup|clearTimeout|clearInterval)\b/.test(content)) {
    lines.forEach((line, index) => {
      if (timer.test(line)) {
        addError(
          rel,
          index + 1,
          "no-setTimeout-in-component",
          "Timers in components require a paired clear in cleanup. Move to a hook under src/hooks/.",
        );
      }
    });
  }
}

function check(filePath: string) {
  const rel = relative(ROOT, filePath);
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  checkNoUseEffect(rel, lines);
  checkNoComments(rel, lines);
  checkNoInlineTypes(rel, lines);
  checkNoMagicColors(rel, lines);
  checkNoHandlePrefix(rel, lines);
  checkNoUnmemoizedComponents(rel, content);
  checkNoInlineHandlers(rel, lines);
  checkMaxStoreSize(rel, lines);
  checkMaxComponentSize(rel, lines);
  checkUseShallow(rel, content, lines);
  checkNoMultipleConditionals(rel, content);
  checkNoAsCasts(rel, lines);
  checkNoDefaultExport(rel, lines);
  checkNoDirectStorage(rel, lines);
  checkNoNativeDate(rel, lines);
  checkNoBannedLibs(rel, lines);
  checkNoWindowNavigation(rel, lines);
  checkNoUntypedFetch(rel, lines);
  checkNoJsonParse(rel, lines);
  checkMaxUseState(rel, lines);
  checkMaxImports(rel, lines);
  checkEnforceStoreSuffix(rel);
  checkEnforceHookLocation(rel, lines);
  checkNoEagerPageImport(rel, lines);
  checkRequireZodAtBoundary(rel, content);
  checkNoSetTimeoutInComponent(rel, content, lines);
}

for (const file of walk(SRC)) {
  check(file);
}

if (errors.length > 0) {
  for (const e of errors) {
    console.error(`${e.filePath}:${e.line}  [${e.rule}]  ${e.message}`);
  }
  console.error(`\n✖ ${errors.length} architecture rule violation(s)`);
  process.exit(1);
}

console.log(`✓ Architecture rules pass on ${SRC}`);
