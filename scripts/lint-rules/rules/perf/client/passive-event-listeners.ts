import type { Rule } from "../../../types";

const passiveEvent =
  /addEventListener\s*\(\s*["'](?:touchstart|touchmove|touchend|wheel|mousewheel)["']/;

export const passiveEventListeners: Rule = {
  name: "perf/passive-event-listeners",
  message:
    "Touch and wheel listeners must pass { passive: true } so the browser can scroll without waiting for JS.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (passiveEvent.test(line) && !/\bpassive\s*:\s*true\b/.test(line)) addError(index + 1);
    });
  },
};
