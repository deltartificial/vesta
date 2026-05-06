import type { Rule } from "../../types";

const destructure = /const\s*\{\s*([\w\s,]+)\}\s*=\s*use[A-Z][a-zA-Z]*Store\s*\(\s*\)/;

export const useShallowRequired: Rule = {
  name: "use-shallow-required",
  message:
    "Destructuring multiple properties from a store without useShallow causes excess re-renders.",
  check({ content, lines, addError }) {
    lines.forEach((line, index) => {
      const match = destructure.exec(line);
      if (!match) return;
      const props = (match[1] ?? "").split(",").filter((p) => p.trim().length > 0);
      if (props.length >= 2 && !content.includes("useShallow")) {
        addError(index + 1);
      }
    });
  },
};
