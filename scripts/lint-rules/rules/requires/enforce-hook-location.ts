import { isComponentFile, isTestFile } from "../../helpers";
import { HOOKS_DIR, STORE_DIR } from "../../paths";
import type { Rule } from "../../types";

const hookDecl = /\b(?:export\s+)?(?:const|function)\s+(use[A-Z]\w*)\s*[=(<]/;

export const enforceHookLocation: Rule = {
  name: "enforce-hook-location",
  message: "Hooks (useX) must live under src/hooks/, src/store/, or inside a component file.",
  match: (rel) =>
    !rel.startsWith(HOOKS_DIR) &&
    !rel.startsWith(STORE_DIR) &&
    !isComponentFile(rel) &&
    !isTestFile(rel),
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (hookDecl.test(line)) addError(index + 1);
    });
  },
};
