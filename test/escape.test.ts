import { $ } from "../apps/libs/dom";
import { describe, it, expect } from "vitest";

describe("escape", () => {
  it("space", () => {
    expect($.escape(" ")).toBe("+");
  });

  it("+", () => {
    expect($.escape("+")).toBe("\\+");
  });

  it("\\", () => {
    expect($.escape("\\")).toBe("\\\\");
  });

  it(" +\\", () => {
    expect($.escape(" +\\")).toBe("+\\+\\\\");
  });
});

describe("unescape", () => {
  it("+", () => {
    expect($.unescape("+")).toBe(" ");
  });

  it("\\+", () => {
    expect($.unescape("\\+")).toBe("+");
  });

  it("\\\\", () => {
    expect($.unescape("\\\\")).toBe("\\");
  });

  it("\\\\+", () => {
    expect($.unescape("\\\\+")).toBe("\\ ");
  });

  it("+\\++\\++", () => {
    expect($.unescape("+\\++\\++")).toBe(" + + ");
  });
});
