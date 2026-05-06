import { isTestFile } from "../../helpers";
import type { Rule } from "../../types";

export const noJsonParse: Rule = {
  name: "no-json-parse",
  message: "JSON.parse is forbidden. Validate the payload with a Zod schema.",
  match: (rel) => !isTestFile(rel),
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (/\bJSON\.parse\s*\(/.test(line)) addError(index + 1);
    });
  },
};
