import { isComponentFile } from "../../../helpers";
import type { Rule } from "../../../types";

const loadingState =
  /useState\s*\(\s*false\s*\)[\s\S]*?\bset(?:Is|)Loading\b|\bset(?:Is|)Pending\s*\(\s*true\s*\)/;

export const useTransitionLoading: Rule = {
  name: "perf/usetransition-loading",
  message:
    "Manual loading state around an async call should use useTransition / startTransition so React can keep the previous UI responsive.",
  match: isComponentFile,
  check({ content, lines, addError }) {
    if (!loadingState.test(content)) return;
    if (/\buseTransition\s*\(/.test(content) || /\bstartTransition\s*\(/.test(content)) return;
    lines.forEach((line, index) => {
      if (/\bset(?:Is|)Loading\s*\(\s*true\s*\)/.test(line)) addError(index + 1);
    });
  },
};
