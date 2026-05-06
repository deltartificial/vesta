import type { Rule } from "../../../types";

const sortIndexAccess =
  /\.\s*sort\s*\(.*\)\s*\[\s*0\s*\]|\.\s*sort\s*\(.*\)\s*\.\s*at\s*\(\s*-?\d+\s*\)/;

export const minMaxLoop: Rule = {
  name: "perf/min-max-loop",
  message:
    "Sorting an array to take a single element is O(n log n). Use a single pass to find min/max.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (sortIndexAccess.test(line)) addError(index + 1);
    });
  },
};
