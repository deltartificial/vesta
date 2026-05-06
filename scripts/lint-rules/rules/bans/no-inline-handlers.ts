import { isComponentFile } from "../../helpers";
import type { Rule } from "../../types";

const handlerEvent =
  /\b(onClick|onMouseEnter|onMouseLeave|onMouseMove|onMouseDown|onMouseUp|onChange|onSubmit|onFocus|onBlur|onKeyDown|onKeyUp|onScroll)\s*=\s*\{\s*\([^)]*\)\s*=>/;

const hasLogic = (line: string) =>
  line.includes("style.") ||
  line.includes("currentTarget") ||
  line.includes("target.") ||
  line.includes("preventDefault") ||
  line.includes("stopPropagation");

export const noInlineHandlers: Rule = {
  name: "no-inline-handlers",
  message: "Inline handlers with logic must use useCallback. Extract to a memoized handler.",
  match: isComponentFile,
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (handlerEvent.test(line) && hasLogic(line)) addError(index + 1);
    });
  },
};
