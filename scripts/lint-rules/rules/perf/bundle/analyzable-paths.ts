import type { Rule } from "../../../types";

const dynamicImportConcat = /\bimport\s*\(\s*[^)]*\$\{|\bimport\s*\(\s*[^)]*\+\s/;

export const bundleAnalyzablePaths: Rule = {
  name: "perf/bundle-analyzable-paths",
  message:
    "Dynamic import paths must be statically analyzable. Use a literal string or a switch instead of concatenation/templates.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (dynamicImportConcat.test(line)) addError(index + 1);
    });
  },
};
