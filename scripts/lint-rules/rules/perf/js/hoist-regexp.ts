import type { Rule } from "../../../types";

const newRegExp = /\bnew\s+RegExp\s*\(/;
const moduleLevel = /^(?:export\s+)?const\s+\w+\s*=\s*new\s+RegExp\s*\(/;

export const hoistRegexp: Rule = {
  name: "perf/hoist-regexp",
  message:
    "new RegExp inside a function recompiles on every call. Hoist to a module-level const, or wrap in useMemo for dynamic patterns.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (!newRegExp.test(line)) return;
      if (moduleLevel.test(line)) return;
      addError(index + 1);
    });
  },
};
