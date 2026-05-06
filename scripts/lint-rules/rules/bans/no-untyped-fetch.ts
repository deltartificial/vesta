import { isInDir, isTestFile } from "../../helpers";
import { FETCH_ALLOWED_DIRS } from "../../paths";
import type { Rule } from "../../types";

export const noUntypedFetch: Rule = {
  name: "no-untyped-fetch",
  message:
    "Raw fetch() is forbidden outside src/services/. Use http(schema, request) so the response is parsed.",
  match: (rel) => !isInDir(rel, FETCH_ALLOWED_DIRS) && !isTestFile(rel),
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (/\bfetch\s*\(/.test(line) && !line.includes("//")) addError(index + 1);
    });
  },
};
