import type { Rule } from "../../types";

const MIN_CONDITIONALS_FOR_MAPPING = 3;
const conditional = /\{(\w+)\s*===\s*["'](\w+)["']\s*&&/g;

export const noMultipleConditionals: Rule = {
  name: "no-multiple-conditionals",
  message: "Use a component mapping pattern.",
  check({ lines, addError }) {
    const counts = new Map<string, number>();
    const firstLine = new Map<string, number>();
    lines.forEach((line, index) => {
      conditional.lastIndex = 0;
      for (const m of line.matchAll(conditional)) {
        const variable = m[1];
        if (!variable) continue;
        counts.set(variable, (counts.get(variable) ?? 0) + 1);
        if (!firstLine.has(variable)) firstLine.set(variable, index + 1);
      }
    });
    for (const [variable, count] of counts) {
      if (count >= MIN_CONDITIONALS_FOR_MAPPING) {
        addError(
          firstLine.get(variable) ?? 1,
          `Variable '${variable}' has ${count} conditional renders. Use a component mapping pattern.`,
        );
      }
    }
  },
};
