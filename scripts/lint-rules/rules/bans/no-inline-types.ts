import { isComponentFile } from "../../helpers";
import type { Rule } from "../../types";

export const noInlineTypes: Rule = {
  name: "no-inline-types",
  message: "Types and interfaces must live under src/types/, not in components.",
  match: isComponentFile,
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (
        /^export\s+(interface|type)\s/.test(trimmed) ||
        /^(interface|type)\s+[A-Z]/.test(trimmed)
      ) {
        addError(index + 1);
      }
    });
  },
};
