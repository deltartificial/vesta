import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Severity } from "./types";

interface RuleConfigObject {
  severity?: Severity;
  options?: Record<string, unknown>;
}

export type RuleConfigEntry = Severity | RuleConfigObject;

export interface OverrideConfig {
  includes: string[];
  rules: Record<string, RuleConfigEntry>;
}

export interface LintConfig {
  rules?: Record<string, RuleConfigEntry>;
  overrides?: OverrideConfig[];
}

const CONFIG_FILE = "lint-rules.config.json";

function isValidShape(value: unknown): value is LintConfig {
  if (typeof value !== "object" || value === null) return false;
  return true;
}

export function loadConfig(root: string): LintConfig {
  const path = join(root, CONFIG_FILE);
  if (!existsSync(path)) return {};
  const raw = readFileSync(path, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!isValidShape(parsed)) return {};
  return parsed;
}

function normalize(entry: RuleConfigEntry): RuleConfigObject {
  if (typeof entry === "string") return { severity: entry };
  return entry;
}

const DOUBLE_STAR_TOKEN = "__VESTA_DS__";
const SINGLE_STAR_TOKEN = "__VESTA_SS__";
const QUESTION_TOKEN = "__VESTA_Q__";

function globToRegex(glob: string): RegExp {
  const tokenized = glob
    .replace(/\*\*/g, DOUBLE_STAR_TOKEN)
    .replace(/\*/g, SINGLE_STAR_TOKEN)
    .replace(/\?/g, QUESTION_TOKEN);
  const escaped = tokenized.replace(/[.+^$|()[\]{}\\]/g, "\\$&");
  const result = escaped
    .replaceAll(DOUBLE_STAR_TOKEN, ".*")
    .replaceAll(SINGLE_STAR_TOKEN, "[^/]*")
    .replaceAll(QUESTION_TOKEN, "[^/]");
  return new RegExp(`^${result}$`);
}

function matchesAny(rel: string, patterns: string[]): boolean {
  return patterns.some((p) => globToRegex(p).test(rel));
}

export function effectiveConfig(
  rel: string,
  ruleName: string,
  config: LintConfig,
  fallback: { severity: Severity; options: Record<string, unknown> },
): { severity: Severity; options: Record<string, unknown> } {
  let severity = fallback.severity;
  let options = { ...fallback.options };

  const global = config.rules?.[ruleName];
  if (global !== undefined) {
    const o = normalize(global);
    if (o.severity !== undefined) severity = o.severity;
    if (o.options !== undefined) options = { ...options, ...o.options };
  }

  for (const override of config.overrides ?? []) {
    if (!matchesAny(rel, override.includes)) continue;
    const entry = override.rules[ruleName];
    if (entry === undefined) continue;
    const o = normalize(entry);
    if (o.severity !== undefined) severity = o.severity;
    if (o.options !== undefined) options = { ...options, ...o.options };
  }

  return { severity, options };
}
