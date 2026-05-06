import type { Rule } from "../../../types";

const eagerCallInUseState = /\buseState\s*\(\s*\w+\s*\([^)]+\)\s*\)/;

export const lazyStateInit: Rule = {
  name: "perf/lazy-state-init",
  message:
    "useState(buildSomething(args)) runs the call on every render. Pass an arrow: useState(() => buildSomething(args)).",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (eagerCallInUseState.test(line)) addError(index + 1);
    });
  },
};
