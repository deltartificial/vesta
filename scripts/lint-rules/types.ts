export type Severity = "off" | "warn" | "error";

export interface LintError {
  rel: string;
  line: number;
  rule: string;
  message: string;
  severity: Exclude<Severity, "off">;
}

export interface RuleContext {
  rel: string;
  content: string;
  lines: string[];
  options: Record<string, unknown>;
  addError: (line: number, override?: string) => void;
}

export interface Rule {
  name: string;
  message: string;
  defaultOptions?: Record<string, unknown>;
  match?: (rel: string) => boolean;
  check: (ctx: RuleContext) => void;
}

export function numOption(options: Record<string, unknown>, key: string, fallback: number): number {
  const v = options[key];
  return typeof v === "number" ? v : fallback;
}
