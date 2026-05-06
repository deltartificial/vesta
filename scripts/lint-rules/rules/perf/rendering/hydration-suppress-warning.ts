import type { Rule } from "../../../types";

const nonDeterministicInJsx = /\{[^}]*(?:Math\.random\s*\(|crypto\.getRandomValues\s*\()[^}]*\}/;

export const hydrationSuppressWarning: Rule = {
  name: "perf/hydration-suppress-warning",
  message:
    "Non-deterministic values in JSX (Math.random, crypto) cause hydration mismatches. Move them to an effect, or add suppressHydrationWarning when intentional.",
  check({ lines, addError }) {
    lines.forEach((line, index) => {
      if (nonDeterministicInJsx.test(line) && !line.includes("suppressHydrationWarning")) {
        addError(index + 1);
      }
    });
  },
};
