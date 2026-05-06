import type { Rule } from "../../../types";

const overPrecise = /\bd\s*=\s*["'][^"']*\b\d+\.\d{3,}/;

export const svgPrecision: Rule = {
  name: "perf/svg-precision",
  message:
    "SVG path coordinates with more than 2 decimals waste bytes. Round to one decimal place.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (overPrecise.test(line)) addError(index + 1);
    });
  },
};
