import { isComponentFile } from "../../helpers";
import { numOption, type Rule } from "../../types";

export const maxComponentSize: Rule = {
  name: "max-component-size",
  message: "Component file is too large. Extract sub-components.",
  defaultOptions: { maxLines: 450 },
  match: isComponentFile,
  check({ lines, addError, options }) {
    const max = numOption(options, "maxLines", 450);
    if (lines.length > max) {
      addError(1, `Component has ${lines.length} lines, exceeds ${max}. Extract sub-components.`);
    }
  },
};
