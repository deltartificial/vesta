import { isComponentFile } from "../../../helpers";
import type { Rule } from "../../../types";

const indentedComponent =
  /^[\t ]+(?:const|function)\s+[A-Z]\w*\s*[=(<][^=]*=>\s*[(<]|^[\t ]+function\s+[A-Z]\w*\s*\(/;

export const noInlineComponents: Rule = {
  name: "perf/no-inline-components",
  message:
    "A component declared inside another component is recreated on every render. Define it at module scope.",
  match: isComponentFile,
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (indentedComponent.test(line)) addError(index + 1);
    });
  },
};
