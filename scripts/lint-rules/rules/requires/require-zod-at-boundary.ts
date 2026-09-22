import { isServiceFile, isTestFile } from "../../helpers";
import type { Rule } from "../../types";

export const requireZodAtBoundary: Rule = {
  name: "require-zod-at-boundary",
  message: "Service modules must validate payloads with a Zod schema (.parse or .safeParse).",
  match: (rel) => isServiceFile(rel) && !isTestFile(rel) && !rel.endsWith("index.ts"),
  check({ content, addError }) {
    if (!/\.(parse|safeParse)\s*\(/.test(content)) addError(1);
  },
};
