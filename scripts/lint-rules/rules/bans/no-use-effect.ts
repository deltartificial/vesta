import type { Rule } from "../../types";

export const noUseEffect: Rule = {
  name: "no-useEffect",
  message:
    "useEffect is forbidden. Use TanStack Query for side effects or move state to a Zustand store.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (line.trim().startsWith("//")) return;
      if (/\buseEffect\b/.test(line)) addError(index + 1);
    });
  },
};
