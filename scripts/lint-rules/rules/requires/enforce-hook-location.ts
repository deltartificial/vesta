import { isComponentFile, isHookFile, isStoreFile, isTestFile } from "../../helpers";
import type { Rule } from "../../types";

const hookDecl = /\b(?:export\s+)?(?:const|function)\s+(use[A-Z]\w*)\s*[=(<]/;

export const enforceHookLocation: Rule = {
  name: "enforce-hook-location",
  message:
    "Hooks (useX) must live under src/hooks/, src/features/<domain>/hooks/, src/features/<domain>/store/, or inside a component file.",
  match: (rel) =>
    !isHookFile(rel) && !isStoreFile(rel) && !isComponentFile(rel) && !isTestFile(rel),
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (hookDecl.test(line)) addError(index + 1);
    });
  },
};
