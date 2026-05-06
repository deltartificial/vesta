import { isTestFile } from "../../helpers";
import type { Rule } from "../../types";

function isAllowedLineComment(trimmed: string): boolean {
  return (
    trimmed.startsWith("// @ts-") ||
    trimmed.startsWith("// biome-ignore") ||
    trimmed.startsWith("// eslint-") ||
    trimmed.startsWith("// vesta-disable") ||
    trimmed.startsWith("// vesta-enable")
  );
}

export const noComments: Rule = {
  name: "no-comments",
  message: "Code comments are forbidden. Code must be self-explanatory.",
  match: (rel) => !isTestFile(rel),
  check({ lines, addError }) {
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
        addError(index + 1, "Block comments are forbidden. Use JSDoc instead.");
        return;
      }
      if (trimmed.startsWith("//") && !isAllowedLineComment(trimmed)) {
        addError(index + 1);
      }
    });
  },
};
