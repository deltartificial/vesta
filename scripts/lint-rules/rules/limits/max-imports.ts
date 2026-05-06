import { numOption, type Rule } from "../../types";

function isImportLine(trimmed: string): boolean {
  return (
    trimmed.startsWith("import ") || trimmed.startsWith("import{") || trimmed.startsWith("import(")
  );
}

export const maxImports: Rule = {
  name: "max-imports",
  message: "Too many imports. Extract sub-modules or split this file.",
  defaultOptions: { max: 25 },
  check({ lines, addError, options }) {
    const max = numOption(options, "max", 25);
    let count = 0;
    let lastImportLine = 0;
    for (let i = 0; i < lines.length; i++) {
      const trimmed = (lines[i] ?? "").trim();
      if (isImportLine(trimmed)) {
        count += 1;
        lastImportLine = i + 1;
      }
    }
    if (count > max) {
      addError(
        lastImportLine,
        `${count} imports exceed the limit of ${max}. Extract sub-modules or split this file.`,
      );
    }
  },
};
