import type { Rule } from "../../../types";

const HEAVY_LIBS = [
  "monaco-editor",
  "@monaco-editor/react",
  "recharts",
  "react-syntax-highlighter",
  "highlight.js",
  "prismjs",
  "mermaid",
  "react-pdf",
  "jspdf",
  "html2canvas",
  "@tiptap/react",
  "@tiptap/core",
];

const staticImport = /^\s*import\s+[^;]*\bfrom\s+["']([^"']+)["']/;

export const bundleDynamicImports: Rule = {
  name: "perf/bundle-dynamic-imports",
  message: "Heavy libs must load via lazy(() => import('...')) to keep them off the entry chunk.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      const m = staticImport.exec(line);
      if (!m) return;
      const lib = m[1] ?? "";
      if (HEAVY_LIBS.some((h) => lib === h || lib.startsWith(`${h}/`))) addError(index + 1);
    });
  },
};
