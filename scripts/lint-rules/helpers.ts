import { readdirSync } from "node:fs";
import { join } from "node:path";
import { COMPONENTS_DIR, COMPONENTS_UI_DIR, STORE_DIR } from "./paths";

export function isComponentFile(rel: string): boolean {
  return rel.startsWith(COMPONENTS_DIR) && rel.endsWith(".tsx");
}

export function isUiPrimitive(rel: string): boolean {
  return rel.startsWith(COMPONENTS_UI_DIR);
}

export function isStoreFile(rel: string): boolean {
  return rel.startsWith(STORE_DIR) && rel.endsWith(".ts");
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
