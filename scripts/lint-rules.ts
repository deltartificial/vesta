#!/usr/bin/env bun
import { join } from "node:path";
import { loadConfig } from "./lint-rules/config";
import { walk } from "./lint-rules/helpers";
import { rules } from "./lint-rules/rules";
import { lintFile } from "./lint-rules/runner";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const config = loadConfig(ROOT);

let errorCount = 0;
let warnCount = 0;

for (const file of walk(SRC)) {
  for (const e of lintFile(ROOT, file, rules, config)) {
    const tag = e.severity === "error" ? "[error]" : "[warn] ";
    console.error(`${e.rel}:${e.line}  ${tag} [${e.rule}]  ${e.message}`);
    if (e.severity === "error") errorCount += 1;
    else warnCount += 1;
  }
}

if (errorCount === 0 && warnCount === 0) {
  console.log(`✓ Architecture rules pass on ${SRC}`);
} else {
  const parts: string[] = [];
  if (errorCount > 0) parts.push(`${errorCount} error${errorCount > 1 ? "s" : ""}`);
  if (warnCount > 0) parts.push(`${warnCount} warning${warnCount > 1 ? "s" : ""}`);
  console.error(`\n✖ ${parts.join(", ")}`);
}

if (errorCount > 0) process.exit(1);
