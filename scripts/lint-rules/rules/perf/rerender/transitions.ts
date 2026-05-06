import { isComponentFile } from "../../../helpers";
import type { Rule } from "../../../types";

const continuousListener = /addEventListener\s*\(\s*["'](?:scroll|resize|input|mousemove)["']/;
const setStateCall = /\bset[A-Z]\w*\s*\(/;

export const rerenderTransitions: Rule = {
  name: "perf/rerender-transitions",
  message:
    "High-frequency events (scroll, resize, input, mousemove) that call setState should wrap the update in startTransition or useTransition.",
  match: isComponentFile,
  check({ content, lines, addError }) {
    if (!continuousListener.test(content)) return;
    if (/\b(?:startTransition|useTransition)\s*\(/.test(content)) return;
    lines.forEach((line, index) => {
      if (continuousListener.test(line) && setStateCall.test(line)) addError(index + 1);
    });
  },
};
