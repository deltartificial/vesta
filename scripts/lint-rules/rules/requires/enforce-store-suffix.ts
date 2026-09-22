import { featureLayer, isTestFile } from "../../helpers";
import type { Rule } from "../../types";

export const enforceStoreSuffix: Rule = {
  name: "enforce-store-suffix",
  message:
    "Files under src/features/<domain>/store/ must end with -store.ts (or be named index.ts).",
  match: (rel) =>
    featureLayer(rel) === "store" &&
    !rel.endsWith("index.ts") &&
    !isTestFile(rel) &&
    !rel.endsWith("-store.ts"),
  check({ addError }) {
    addError(1);
  },
};
