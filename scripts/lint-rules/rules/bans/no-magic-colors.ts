import type { Rule } from "../../types";

const tailwindHex =
  /\b(text|bg|border|fill|stroke|ring|outline|shadow|from|to|via)-\[#[0-9a-fA-F]+\]/;
const inlineHex = /style\s*=\s*\{\{[^}]*#[0-9a-fA-F]{3,8}/;
const inlineRgb = /style\s*=\s*\{\{[^}]*rgba?\s*\(/;

export const noMagicColors: Rule = {
  name: "no-magic-colors",
  message: "Color values must come from src/constants/ui/colors.ts, not inline.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (tailwindHex.test(line) || inlineHex.test(line) || inlineRgb.test(line)) {
        addError(index + 1);
      }
    });
  },
};
