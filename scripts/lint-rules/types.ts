export interface LintError {
  rel: string;
  line: number;
  rule: string;
  message: string;
}

export interface RuleContext {
  rel: string;
  content: string;
  lines: string[];
  addError: (line: number, override?: string) => void;
}

export interface Rule {
  name: string;
  message: string;
  match?: (rel: string) => boolean;
  check: (ctx: RuleContext) => void;
}
