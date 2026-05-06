import { SERVICES_DIR } from "../../paths";
import type { Rule } from "../../types";

export const requireZodAtBoundary: Rule = {
  name: "require-zod-at-boundary",
  message: "Service modules must validate payloads with a Zod schema (.parse or .safeParse).",
  match: (rel) =>
    rel.startsWith(SERVICES_DIR) &&
    !rel.endsWith(".test.ts") &&
    !rel.endsWith(".test.tsx") &&
    !rel.endsWith("index.ts"),
  check({ content, addError }) {
    if (!/\.(parse|safeParse)\s*\(/.test(content)) addError(1);
  },
};
