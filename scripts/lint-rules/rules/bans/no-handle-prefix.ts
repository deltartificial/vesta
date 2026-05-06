import type { Rule } from "../../types";

const handleDecl = /\b(const|let|function)\s+handle[A-Z][a-zA-Z]*/;

export const noHandlePrefix: Rule = {
  name: "no-handle-prefix",
  message: "Use the on* prefix or call store actions directly. handle* is forbidden.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (handleDecl.test(line)) addError(index + 1);
    });
  },
};
