import { dirname, join, normalize } from "node:path";
import { featureName, isRouteFile, isTestFile } from "../../helpers";
import { SRC_DIR } from "../../paths";
import type { Rule } from "../../types";

const specifier = /(?:\bfrom\s+|\bimport\s*\(\s*)["']([^"']+)["']/;

function resolveTarget(rel: string, spec: string): string | undefined {
  if (spec.startsWith("@/")) return normalize(SRC_DIR + spec.slice(2));
  if (spec.startsWith(".")) return normalize(join(dirname(rel), spec));
  return undefined;
}

function violation(rel: string, target: string): string | undefined {
  const targetFeature = featureName(target);
  if (targetFeature === undefined) return undefined;
  const ownFeature = featureName(rel);
  if (ownFeature === undefined) {
    if (isRouteFile(rel) || isTestFile(rel)) return undefined;
    return `Shared code cannot import from features/${targetFeature}. Move the dependency into a shared layer, or compose in a route.`;
  }
  if (ownFeature !== targetFeature) {
    return `features/${ownFeature} cannot import from features/${targetFeature}. Compose features in a route, or move shared code into a shared layer.`;
  }
  return undefined;
}

export const enforceFeatureBoundaries: Rule = {
  name: "enforce-feature-boundaries",
  message: "Features are isolated: only routes compose them.",
  check({ rel, lines, addError }) {
    lines.forEach((line, index) => {
      const spec = specifier.exec(line)?.[1];
      if (spec === undefined) return;
      const target = resolveTarget(rel, spec);
      if (target === undefined) return;
      const message = violation(rel, target);
      if (message) addError(index + 1, message);
    });
  },
};
