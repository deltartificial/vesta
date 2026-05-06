import { BANNED_LIBS } from "../../paths";
import type { Rule } from "../../types";

const fromImport = /\bfrom\s+["']([^"']+)["']/;

export const noBannedLibs: Rule = {
  name: "no-banned-libs",
  message: "Banned library import. Use the standard alternative.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      const m = fromImport.exec(line);
      if (!m) return;
      const lib = m[1] ?? "";
      const root = lib.startsWith("@") ? lib.split("/").slice(0, 2).join("/") : lib.split("/")[0];
      if (root && BANNED_LIBS.includes(root)) {
        addError(
          index + 1,
          `Library '${root}' is banned. Use the standard alternative (date-fns, native fetch, etc.).`,
        );
      }
    });
  },
};
