import type { Rule } from "../../types";

const storageAccess = /\b(localStorage|sessionStorage)\s*\./;

export const noDirectStorage: Rule = {
  name: "no-direct-storage",
  message:
    "Use the typed storage utility under src/utils/storage instead of localStorage/sessionStorage.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (storageAccess.test(line)) addError(index + 1);
    });
  },
};
