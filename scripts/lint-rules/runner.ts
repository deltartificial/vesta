import { readFileSync } from "node:fs";
import { relative } from "node:path";
import type { LintError, Rule } from "./types";

export function lintFile(root: string, filePath: string, rules: Rule[]): LintError[] {
  const rel = relative(root, filePath);
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const errors: LintError[] = [];

  for (const rule of rules) {
    if (rule.match && !rule.match(rel)) continue;
    rule.check({
      rel,
      content,
      lines,
      addError: (line, override) => {
        errors.push({ rel, line, rule: rule.name, message: override ?? rule.message });
      },
    });
  }

  return errors;
}
