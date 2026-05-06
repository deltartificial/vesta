import type { Rule } from "../../../types";

const TRACKERS = [
  "@sentry/react",
  "@sentry/nextjs",
  "@sentry/browser",
  "@datadog/browser-rum",
  "@datadog/browser-logs",
  "posthog-js",
  "mixpanel-browser",
  "@hotjar/browser",
  "amplitude-js",
];

const fromImport = /\bfrom\s+["']([^"']+)["']/;

export const bundleDeferThirdParty: Rule = {
  name: "perf/bundle-defer-third-party",
  message:
    "Analytics and observability libs should load after hydration via lazy()/dynamic() to avoid blocking first paint.",
  check({ content, lines, addError }) {
    if (/\blazy\s*\(\s*\(\)\s*=>\s*import\s*\(/.test(content)) {
      // Module already lazy-loads something, allow at-most-one static import.
    }
    lines.forEach((line, index) => {
      const m = fromImport.exec(line);
      if (!m) return;
      const lib = m[1] ?? "";
      if (TRACKERS.includes(lib)) addError(index + 1);
    });
  },
};
