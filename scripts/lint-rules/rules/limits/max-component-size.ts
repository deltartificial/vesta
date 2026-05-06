import { isComponentFile } from "../../helpers";
import type { Rule } from "../../types";

const MAX_COMPONENT_LINES = 450;

export const maxComponentSize: Rule = {
  name: "max-component-size",
  message: `Component exceeds ${MAX_COMPONENT_LINES} lines. Extract sub-components.`,
  match: isComponentFile,
  check({ lines, addError }) {
    if (lines.length > MAX_COMPONENT_LINES) {
      addError(
        1,
        `Component has ${lines.length} lines, exceeds ${MAX_COMPONENT_LINES}. Extract sub-components.`,
      );
    }
  },
};
