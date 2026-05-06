import type { Rule } from "../../../types";

const chained = /\.\s*filter\s*\([^)]*\)\s*\.\s*(?:filter|map|forEach|reduce)\s*\(/;

export const combineIterations: Rule = {
  name: "perf/combine-iterations",
  message: "Chained .filter/.map walks the array twice. Combine into a single loop or .reduce.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (chained.test(line)) addError(index + 1);
    });
  },
};
