import { containsInTitleOrContents } from "../apps/block/libs";
import { containsInTitle } from "../apps/block/libs";
import { KeywordType } from "../apps/storage/enums";
import { describe, it, expect } from "vitest";

describe("containsInTitle", () => {
  it("keyword in title", () => {
    expect(containsInTitle(KeywordType.STRING, "def", "abc def ghi")).toBe(
      true,
    );
  });

  it("keyword not in title", () => {
    expect(containsInTitle(KeywordType.STRING, "defg", "abc def ghi")).toBe(
      false,
    );
  });
});

describe("containsInTitleAndContents", () => {
  it("keyword in title", () => {
    expect(
      containsInTitleOrContents(KeywordType.STRING, "def", "abc def ghi", ""),
    ).toBe(true);
  });

  it("keyword in contents", () => {
    expect(
      containsInTitleOrContents(
        KeywordType.STRING,
        "jkl",
        "abc def ghi",
        "jkl",
      ),
    ).toBe(true);
  });

  it("keyword not in title and contents", () => {
    expect(
      containsInTitleOrContents(KeywordType.STRING, "defg", "abc def ghi", ""),
    ).toBe(false);
  });
});
