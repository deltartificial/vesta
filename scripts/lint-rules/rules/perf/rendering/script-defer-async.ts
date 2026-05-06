import type { Rule } from "../../../types";

const blockingScript =
  /<script\s+(?![^>]*\b(?:type\s*=\s*["']module|defer\b|async\b))[^>]*\bsrc\s*=/;

export const scriptDeferAsync: Rule = {
  name: "perf/script-defer-async",
  message:
    'External <script> tags must use defer, async, or type="module". Blocking scripts stop HTML parsing.',
  match: (rel) => rel.endsWith(".html") || rel.endsWith(".tsx") || rel.endsWith(".ts"),
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (blockingScript.test(line)) addError(index + 1);
    });
  },
};
