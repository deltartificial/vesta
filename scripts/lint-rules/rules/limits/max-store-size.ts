import { isStoreFile } from "../../helpers";
import { numOption, type Rule } from "../../types";

export const maxStoreSize: Rule = {
  name: "max-store-size",
  message: "Store file is too large. Split into smaller stores.",
  defaultOptions: { maxLines: 250 },
  match: isStoreFile,
  check({ lines, addError, options }) {
    const max = numOption(options, "maxLines", 250);
    if (lines.length > max) {
      addError(1, `Store has ${lines.length} lines, exceeds ${max}. Split into smaller stores.`);
    }
  },
};
