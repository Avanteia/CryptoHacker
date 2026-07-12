import { describe, it, expect } from "vitest";
import { validateCode } from "./validate";

describe("validateCode", () => {
  it("passes when all rules are satisfied", () => {
    const result = validateCode(
      `pragma solidity >=0.5.0 <0.9.0;\n\ncontract HackerFactory {\n  uint dna;\n}\n`,
      [
        { type: "contains", pattern: "pragma solidity", message: "missing pragma" },
        { type: "regex", pattern: "contract\\s+HackerFactory\\s*\\{", message: "missing contract" },
      ]
    );
    expect(result.ok).toBe(true);
  });

  it("fails with the rule's message when a contains rule doesn't match", () => {
    const result = validateCode("contract Foo {}", [
      { type: "contains", pattern: "uint dna;", message: "declare dna" },
    ]);
    expect(result).toEqual({ ok: false, message: "declare dna", line: undefined });
  });

  it("ignores whitespace differences for contains rules", () => {
    const result = validateCode("uint    dna  ;", [
      { type: "contains", pattern: "uint dna;", message: "declare dna" },
    ]);
    expect(result.ok).toBe(true);
  });

  it("fails a not_contains rule when the banned pattern is present", () => {
    const result = validateCode("require(tx.origin == owner);", [
      { type: "not_contains", pattern: "tx.origin", message: "do not use tx.origin" },
    ]);
    expect(result).toEqual({ ok: false, message: "do not use tx.origin", line: undefined });
  });

  it("evaluates regex rules against the raw source", () => {
    const result = validateCode("function foo() public {}", [
      { type: "regex", pattern: "function\\s+foo\\s*\\(\\s*\\)\\s+public", message: "bad signature" },
    ]);
    expect(result.ok).toBe(true);
  });

  it("enforces ordering rules", () => {
    const codeWrongOrder = "b(); a();";
    const result = validateCode(codeWrongOrder, [
      { type: "order", before: "a();", after: "b();", message: "a must come before b" },
    ]);
    expect(result).toEqual({ ok: false, message: "a must come before b", line: undefined });

    const codeRightOrder = "a(); b();";
    const result2 = validateCode(codeRightOrder, [
      { type: "order", before: "a();", after: "b();", message: "a must come before b" },
    ]);
    expect(result2.ok).toBe(true);
  });

  it("stops at the first failing rule", () => {
    const result = validateCode("", [
      { type: "contains", pattern: "first", message: "first missing" },
      { type: "contains", pattern: "second", message: "second missing" },
    ]);
    expect(result).toEqual({ ok: false, message: "first missing", line: undefined });
  });
});
