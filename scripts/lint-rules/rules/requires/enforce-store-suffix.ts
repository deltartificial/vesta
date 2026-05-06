import { isTestFile } from "../../helpers";
import { STORE_DIR } from "../../paths";
import type { Rule } from "../../types";

export const enforceStoreSuffix: Rule = {
  name: "enforce-store-suffix",
  message: "Files under src/store/ must end with -store.ts (or be named index.ts).",
  match: (rel) =>
    rel.startsWith(STORE_DIR) &&
    !rel.endsWith("index.ts") &&
    !isTestFile(rel) &&
    !rel.endsWith("-store.ts"),
  check({ addError }) {
    addError(1);
  },
};
