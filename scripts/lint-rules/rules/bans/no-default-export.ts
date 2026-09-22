import type { Rule } from "../../types";

export const noDefaultExport: Rule = {
  name: "no-default-export",
  message: "Default exports are forbidden. Use named exports (routes export `Route`).",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (/^export\s+default\b/.test(line.trim())) addError(index + 1);
    });
  },
};
