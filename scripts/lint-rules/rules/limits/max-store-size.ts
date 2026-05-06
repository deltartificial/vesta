import { isStoreFile } from "../../helpers";
import type { Rule } from "../../types";

const MAX_STORE_LINES = 250;

export const maxStoreSize: Rule = {
  name: "max-store-size",
  message: `Store exceeds ${MAX_STORE_LINES} lines. Split into smaller stores.`,
  match: isStoreFile,
  check({ lines, addError }) {
    if (lines.length > MAX_STORE_LINES) {
      addError(
        1,
        `Store has ${lines.length} lines, exceeds ${MAX_STORE_LINES}. Split into smaller stores.`,
      );
    }
  },
};
