interface Directives {
  fileLevel: Set<string>;
  nextLine: Map<number, Set<string>>;
  blocks: Array<{ start: number; end: number; rules: Set<string> }>;
  meta: Array<{ line: number; reason: string }>;
}

const NEXT_LINE = /^\s*\/\/\s*vesta-disable-next-line\s+(.+?)\s*(?:--\s+(.*))?$/;
const FILE = /^\s*\/\/\s*vesta-disable-file\s+(.+?)\s*(?:--\s+(.*))?$/;
const DISABLE = /^\s*\/\/\s*vesta-disable\s+(.+?)\s*(?:--\s+(.*))?$/;
const ENABLE = /^\s*\/\/\s*vesta-enable\b\s*(.*)$/;

function parseRules(raw: string): Set<string> {
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  );
}

function appendNextLine(map: Map<number, Set<string>>, line: number, rules: Set<string>) {
  const existing = map.get(line);
  if (existing) for (const r of rules) existing.add(r);
  else map.set(line, new Set(rules));
}

interface ParseState {
  fileLevel: Set<string>;
  nextLine: Map<number, Set<string>>;
  blocks: Directives["blocks"];
  meta: Directives["meta"];
  openBlocks: Map<string, number>;
}

function handleFile(state: ParseState, line: string, lineNumber: number): boolean {
  const m = FILE.exec(line);
  if (!m) return false;
  const reason = (m[2] ?? "").trim();
  if (!reason) {
    state.meta.push({
      line: lineNumber,
      reason: "vesta-disable-file requires a reason after `--`",
    });
    return true;
  }
  for (const r of parseRules(m[1] ?? "")) state.fileLevel.add(r);
  return true;
}

function handleNextLine(state: ParseState, line: string, lineNumber: number): boolean {
  const m = NEXT_LINE.exec(line);
  if (!m) return false;
  const reason = (m[2] ?? "").trim();
  if (!reason) {
    state.meta.push({
      line: lineNumber,
      reason: "vesta-disable-next-line requires a reason after `--`",
    });
    return true;
  }
  appendNextLine(state.nextLine, lineNumber + 1, parseRules(m[1] ?? ""));
  return true;
}

function handleEnable(state: ParseState, line: string, lineNumber: number): boolean {
  const m = ENABLE.exec(line);
  if (!m) return false;
  const rules = parseRules(m[1] ?? "");
  const closing = rules.size === 0 ? new Set(state.openBlocks.keys()) : rules;
  for (const r of closing) {
    const start = state.openBlocks.get(r);
    if (start === undefined) continue;
    state.blocks.push({ start, end: lineNumber - 1, rules: new Set([r]) });
    state.openBlocks.delete(r);
  }
  return true;
}

function handleDisable(state: ParseState, line: string, lineNumber: number): boolean {
  const m = DISABLE.exec(line);
  if (!m) return false;
  const reason = (m[2] ?? "").trim();
  if (!reason) {
    state.meta.push({ line: lineNumber, reason: "vesta-disable requires a reason after `--`" });
    return true;
  }
  for (const r of parseRules(m[1] ?? "")) state.openBlocks.set(r, lineNumber + 1);
  return true;
}

export function parseDirectives(lines: string[]): Directives {
  const state: ParseState = {
    fileLevel: new Set(),
    nextLine: new Map(),
    blocks: [],
    meta: [],
    openBlocks: new Map(),
  };
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (handleFile(state, line, lineNumber)) return;
    if (handleNextLine(state, line, lineNumber)) return;
    if (handleEnable(state, line, lineNumber)) return;
    handleDisable(state, line, lineNumber);
  });
  for (const [rule, start] of state.openBlocks) {
    state.blocks.push({ start, end: lines.length, rules: new Set([rule]) });
  }
  return {
    fileLevel: state.fileLevel,
    nextLine: state.nextLine,
    blocks: state.blocks,
    meta: state.meta,
  };
}

export function isDisabled(line: number, ruleName: string, directives: Directives): boolean {
  if (directives.fileLevel.has(ruleName)) return true;
  if (directives.nextLine.get(line)?.has(ruleName)) return true;
  for (const block of directives.blocks) {
    if (line >= block.start && line <= block.end && block.rules.has(ruleName)) return true;
  }
  return false;
}
