import type { Rule } from "../../types";

const MAX_IMPORTS = 25;

function isImportLine(trimmed: string): boolean {
  return (
    trimmed.startsWith("import ") || trimmed.startsWith("import{") || trimmed.startsWith("import(")
  );
}

export const maxImports: Rule = {
  name: "max-imports",
  message: `Imports exceed ${MAX_IMPORTS}. Extract sub-modules or split this file.`,
  check({ lines, addError }) {
    let count = 0;
    let lastImportLine = 0;
    for (let i = 0; i < lines.length; i++) {
      const trimmed = (lines[i] ?? "").trim();
      if (isImportLine(trimmed)) {
        count += 1;
        lastImportLine = i + 1;
      }
    }
    if (count > MAX_IMPORTS) {
      addError(
        lastImportLine,
        `${count} imports exceed the limit of ${MAX_IMPORTS}. Extract sub-modules or split this file.`,
      );
    }
  },
};
