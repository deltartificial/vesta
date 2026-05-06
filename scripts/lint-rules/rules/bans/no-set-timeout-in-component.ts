import { isComponentFile } from "../../helpers";
import type { Rule } from "../../types";

const timer = /\b(setTimeout|setInterval)\s*\(/;
const cleanupHints = /\b(useEffect|useLayoutEffect|cleanup|clearTimeout|clearInterval)\b/;

export const noSetTimeoutInComponent: Rule = {
  name: "no-setTimeout-in-component",
  message:
    "Timers in components require a paired clear in cleanup. Move to a hook under src/hooks/.",
  match: isComponentFile,
  check({ content, lines, addError }) {
    if (cleanupHints.test(content)) return;
    lines.forEach((line, index) => {
      if (timer.test(line)) addError(index + 1);
    });
  },
};
