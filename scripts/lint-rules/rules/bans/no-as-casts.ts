import type { Rule } from "../../types";

const asCast =
  /\bas\s+(?!const\b)(?:[A-Z]\w*|string\b|number\b|boolean\b|object\b|symbol\b|bigint\b|any\b|unknown\b|never\b|void\b)/;
const asUnknownChain = /\bas\s+unknown\s+as\b/;

export const noAsCasts: Rule = {
  name: "no-as-casts",
  message: "Type assertions (as Foo) are forbidden. Use satisfies, type guards, or Zod parsing.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
      if (asUnknownChain.test(line)) {
        addError(
          index + 1,
          "as unknown as X double-cast is forbidden. Validate with Zod or use a type guard.",
        );
        return;
      }
      if (asCast.test(line)) addError(index + 1);
    });
  },
};
