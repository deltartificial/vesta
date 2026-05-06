import type { Rule } from "../../../types";

const sortCall = /\b(\w+)\.sort\s*\(/;

export const toSortedImmutable: Rule = {
  name: "perf/tosorted-immutable",
  message:
    ".sort() mutates in place; on props/state arrays this leaks. Use .toSorted() or sort a spread copy.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      const m = sortCall.exec(line);
      if (!m) return;
      const before = line.slice(0, m.index);
      if (/\[\s*\.\.\./.test(before) || /Array\.from\s*\($/.test(before)) return;
      addError(index + 1);
    });
  },
};
