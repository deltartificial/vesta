import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { effectiveConfig, type LintConfig } from "./config";
import { isDisabled, parseDirectives } from "./directives";
import type { LintError, Rule } from "./types";

export function lintFile(
  root: string,
  filePath: string,
  rules: Rule[],
  config: LintConfig,
): LintError[] {
  const rel = relative(root, filePath);
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const directives = parseDirectives(lines);
  const errors: LintError[] = [];

  for (const meta of directives.meta) {
    errors.push({
      rel,
      line: meta.line,
      rule: "lint-rules-meta",
      message: meta.reason,
      severity: "error",
    });
  }

  for (const rule of rules) {
    const { severity, options } = effectiveConfig(rel, rule.name, config, {
      severity: "error",
      options: rule.defaultOptions ?? {},
    });
    if (severity === "off") continue;
    if (rule.match && !rule.match(rel)) continue;

    rule.check({
      rel,
      content,
      lines,
      options,
      addError: (line, override) => {
        if (isDisabled(line, rule.name, directives)) return;
        errors.push({
          rel,
          line,
          rule: rule.name,
          message: override ?? rule.message,
          severity,
        });
      },
    });
  }

  return errors;
}
