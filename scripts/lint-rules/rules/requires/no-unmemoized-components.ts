import { isComponentFile, isUiPrimitive } from "../../helpers";
import type { Rule } from "../../types";

const exportFn = /export\s+(default\s+)?function\s+([A-Z][a-zA-Z]*)/;
const exportConst = /export\s+(default\s+)?const\s+([A-Z][a-zA-Z]*)\s*=/;
const memoCall = /\bmemo\s*\(/;

export const noUnmemoizedComponents: Rule = {
  name: "no-unmemoized-components",
  message: "Component must be wrapped with memo(). Only src/components/ui/ primitives are exempt.",
  match: (rel) => isComponentFile(rel) && !isUiPrimitive(rel),
  check({ content, addError }) {
    const matchFn = exportFn.exec(content);
    const matchConst = exportConst.exec(content);
    const componentName = matchFn?.[2] ?? matchConst?.[2];
    if (!componentName) return;
    if (!memoCall.test(content)) {
      addError(
        1,
        `Component ${componentName} must be wrapped with memo(). Only src/components/ui/ primitives are exempt.`,
      );
    }
  },
};
