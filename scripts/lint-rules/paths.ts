import { join, sep } from "node:path";

export const SRC_DIR = `src${sep}`;
export const FEATURES_DIR = join("src", "features") + sep;
export const ROUTES_DIR = join("src", "routes") + sep;
export const HOOKS_DIR = join("src", "hooks") + sep;
export const COMPONENTS_DIR = join("src", "components") + sep;
export const COMPONENTS_UI_DIR = join("src", "components", "ui") + sep;
export const SERVICES_DIR = join("src", "services") + sep;
export const REMOVED_DIRS = [join("src", "pages") + sep, join("src", "store") + sep];

export const FEATURE_LAYERS = [
  "components",
  "hooks",
  "store",
  "services",
  "schemas",
  "types",
  "constants",
  "utils",
];

export const GENERATED_FILES = new Set<string>([join("src", "route-tree.gen.ts")]);

export const NATIVE_DATE_ALLOWED_DIRS = [join("src", "utils", "date") + sep];
export const FETCH_ALLOWED_DIRS = [SERVICES_DIR];

export const BANNED_LIBS = [
  "lodash",
  "moment",
  "dayjs",
  "axios",
  "underscore",
  "request",
  "react-router",
  "react-router-dom",
];
