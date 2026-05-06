import { isInDir } from "../../helpers";
import { DEFAULT_EXPORT_ALLOWED_DIRS, DEFAULT_EXPORT_ALLOWED_FILES } from "../../paths";
import type { Rule } from "../../types";

export const noDefaultExport: Rule = {
  name: "no-default-export",
  message: "Default exports are forbidden outside src/app.tsx and src/pages/. Use named exports.",
  match: (rel) =>
    !DEFAULT_EXPORT_ALLOWED_FILES.has(rel) && !isInDir(rel, DEFAULT_EXPORT_ALLOWED_DIRS),
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (/^export\s+default\b/.test(line.trim())) addError(index + 1);
    });
  },
};
