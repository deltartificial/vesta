import { isInDir } from "../../helpers";
import { NATIVE_DATE_ALLOWED_DIRS } from "../../paths";
import type { Rule } from "../../types";

export const noNativeDate: Rule = {
  name: "no-native-date",
  message: "Wrap date access in src/utils/date so timezone and source-of-time stay explicit.",
  match: (rel) => !isInDir(rel, NATIVE_DATE_ALLOWED_DIRS),
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (/\bnew\s+Date\s*\(/.test(line) || /\bDate\.now\s*\(/.test(line)) {
        addError(index + 1);
      }
    });
  },
};
