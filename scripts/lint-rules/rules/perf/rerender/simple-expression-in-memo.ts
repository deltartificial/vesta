import type { Rule } from "../../../types";

const trivialUseMemo =
  /\buseMemo\s*\(\s*\(\)\s*=>\s*[^,;{}]*?(?:\|\||&&|!==?|===|<|>|\+|-)[^,;{}]*?,\s*\[/;

export const simpleExpressionInMemo: Rule = {
  name: "perf/simple-expression-in-memo",
  message:
    "useMemo on a primitive expression costs more than recomputing it. Drop useMemo when the body is a single boolean or arithmetic expression.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (trivialUseMemo.test(line)) addError(index + 1);
    });
  },
};
