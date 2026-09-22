import { featureLayer, isInDir } from "../../helpers";
import {
  COMPONENTS_DIR,
  COMPONENTS_UI_DIR,
  FEATURE_LAYERS,
  FEATURES_DIR,
  REMOVED_DIRS,
} from "../../paths";
import type { Rule } from "../../types";

const layers = FEATURE_LAYERS.join(",");

function violation(rel: string): string | undefined {
  if (isInDir(rel, REMOVED_DIRS)) {
    return "src/pages/ and src/store/ are gone. Routes live in src/routes/, stores in src/features/<domain>/store/.";
  }
  if (rel.startsWith(COMPONENTS_DIR) && !rel.startsWith(COMPONENTS_UI_DIR)) {
    return "src/components/ only holds ui/ primitives. Domain components go in src/features/<domain>/components/.";
  }
  if (rel.startsWith(FEATURES_DIR)) {
    const layer = featureLayer(rel);
    if (layer === undefined || !FEATURE_LAYERS.includes(layer)) {
      return `Feature files must live in src/features/<domain>/{${layers}}/.`;
    }
  }
  return undefined;
}

export const enforceFeatureStructure: Rule = {
  name: "enforce-feature-structure",
  message: "Domain code lives in src/features/<domain>/<layer>/.",
  check({ rel, addError }) {
    const message = violation(rel);
    if (message) addError(1, message);
  },
};
