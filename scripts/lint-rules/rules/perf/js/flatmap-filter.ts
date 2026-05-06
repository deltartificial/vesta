import type { Rule } from "../../../types";

const mapFilterBoolean = /\.\s*map\s*\([^)]+\)\s*\.\s*filter\s*\(\s*Boolean\s*\)/;

export const flatmapFilter: Rule = {
  name: "perf/flatmap-filter",
  message:
    ".map(...).filter(Boolean) walks the array twice. Use .flatMap with [] / [value] returns.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (mapFilterBoolean.test(line)) addError(index + 1);
    });
  },
};
