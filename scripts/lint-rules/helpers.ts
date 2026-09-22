import { readdirSync } from "node:fs";
import { join, sep } from "node:path";
import {
  COMPONENTS_DIR,
  COMPONENTS_UI_DIR,
  FEATURES_DIR,
  HOOKS_DIR,
  ROUTES_DIR,
  SERVICES_DIR,
} from "./paths";

export function featureName(rel: string): string | undefined {
  if (!rel.startsWith(FEATURES_DIR)) return undefined;
  return rel.slice(FEATURES_DIR.length).split(sep)[0];
}

export function featureLayer(rel: string): string | undefined {
  if (!rel.startsWith(FEATURES_DIR)) return undefined;
  const parts = rel.slice(FEATURES_DIR.length).split(sep);
  return parts.length > 2 ? parts[1] : undefined;
}

export function isComponentFile(rel: string): boolean {
  if (!rel.endsWith(".tsx")) return false;
  return rel.startsWith(COMPONENTS_DIR) || featureLayer(rel) === "components";
}

export function isUiPrimitive(rel: string): boolean {
  return rel.startsWith(COMPONENTS_UI_DIR);
}

export function isStoreFile(rel: string): boolean {
  return featureLayer(rel) === "store" && rel.endsWith(".ts");
}

export function isHookFile(rel: string): boolean {
  return rel.startsWith(HOOKS_DIR) || featureLayer(rel) === "hooks";
}

export function isServiceFile(rel: string): boolean {
  return rel.startsWith(SERVICES_DIR) || featureLayer(rel) === "services";
}

export function isRouteFile(rel: string): boolean {
  return rel.startsWith(ROUTES_DIR);
}

export function isTestFile(rel: string): boolean {
  return /\.(test|spec)\.tsx?$/.test(rel);
}

export function isInDir(rel: string, dirs: string[]): boolean {
  return dirs.some((d) => rel.startsWith(d));
}

export function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.d\.ts$/.test(entry.name)) {
      yield full;
    }
  }
}
