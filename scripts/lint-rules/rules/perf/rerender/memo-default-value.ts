import type { Rule } from "../../../types";

const memoCall = /\bmemo\s*\(/;
const inlineDefault = /\b\w+\s*=\s*(?:\(\s*\)\s*=>|\[\s*\]|\{\s*\})/;

function parenDelta(line: string): number {
  let delta = 0;
  for (const ch of line) {
    if (ch === "(") delta += 1;
    else if (ch === ")") delta -= 1;
  }
  return delta;
}

export const memoDefaultValue: Rule = {
  name: "perf/memo-default-value",
  message:
    "Default parameter `= () => {}`, `= []`, or `= {}` inside memo() creates a new reference every render and defeats memoization. Hoist the default to a module-level constant.",
  check({ content, lines, addError }) {
    if (!memoCall.test(content)) return;
    let depth = 0;
    let inMemo = false;
    lines.forEach((line, index) => {
      const opening = memoCall.test(line);
      if (opening) inMemo = true;
      if (!inMemo) return;
      depth += parenDelta(line);
      if (inlineDefault.test(line)) addError(index + 1);
      if (depth <= 0) {
        inMemo = false;
        depth = 0;
      }
    });
  },
};
