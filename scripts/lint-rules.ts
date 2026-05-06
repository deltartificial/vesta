#!/usr/bin/env bun
import { join } from "node:path";
import { walk } from "./lint-rules/helpers";
import { rules } from "./lint-rules/rules";
import { lintFile } from "./lint-rules/runner";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

let count = 0;
for (const file of walk(SRC)) {
  for (const error of lintFile(ROOT, file, rules)) {
    console.error(`${error.rel}:${error.line}  [${error.rule}]  ${error.message}`);
    count += 1;
  }
}

if (count > 0) {
  console.error(`\n✖ ${count} architecture rule violation(s)`);
  process.exit(1);
}

console.log(`✓ Architecture rules pass on ${SRC}`);
