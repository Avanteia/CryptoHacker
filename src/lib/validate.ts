export type ValidationRule =
  | { type: "contains"; pattern: string; message: string; line?: number }
  | { type: "not_contains"; pattern: string; message: string; line?: number }
  | { type: "regex"; pattern: string; flags?: string; message: string; line?: number }
  | { type: "order"; before: string; after: string; message: string; line?: number };

export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string; line?: number };

function normalize(code: string) {
  return code.replace(/\r\n/g, "\n");
}

function collapseWhitespace(s: string) {
  return s.replace(/\s+/g, "");
}

export function validateCode(code: string, rules: ValidationRule[]): ValidationResult {
  const src = normalize(code);
  const collapsed = collapseWhitespace(src);

  for (const rule of rules) {
    switch (rule.type) {
      case "contains": {
        const needle = collapseWhitespace(rule.pattern);
        if (!collapsed.includes(needle)) {
          return { ok: false, message: rule.message, line: rule.line };
        }
        break;
      }
      case "not_contains": {
        const needle = collapseWhitespace(rule.pattern);
        if (collapsed.includes(needle)) {
          return { ok: false, message: rule.message, line: rule.line };
        }
        break;
      }
      case "regex": {
        const re = new RegExp(rule.pattern, rule.flags ?? "m");
        if (!re.test(src)) {
          return { ok: false, message: rule.message, line: rule.line };
        }
        break;
      }
      case "order": {
        const beforeIdx = collapsed.indexOf(collapseWhitespace(rule.before));
        const afterIdx = collapsed.indexOf(collapseWhitespace(rule.after));
        if (beforeIdx === -1 || afterIdx === -1 || beforeIdx > afterIdx) {
          return { ok: false, message: rule.message, line: rule.line };
        }
        break;
      }
    }
  }
  return { ok: true };
}
