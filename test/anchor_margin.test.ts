import { describe, expect, it, vi } from "vitest";

import {
  adjustAnchorMargin,
  computeAnchorMargins,
} from "../apps/content_script/anchor_margin";

describe("computeAnchorMargins", () => {
  it("returns margins that cancel the gap", () => {
    expect(computeAnchorMargins(30)).toEqual({ top: "-30px", bottom: "30px" });
  });

  it("returns null when the gap is zero", () => {
    expect(computeAnchorMargins(0)).toBeNull();
  });

  it("returns null for sub-pixel gaps", () => {
    expect(computeAnchorMargins(0.5)).toBeNull();
  });

  it("returns null for NaN", () => {
    expect(computeAnchorMargins(Number.NaN)).toBeNull();
  });
});

describe("adjustAnchorMargin", () => {
  function stubBottom(element: Element, bottom: number): void {
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
      bottom,
      top: 0,
    } as DOMRect);
  }

  function stubTop(element: Element, top: number): void {
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
      bottom: 0,
      top,
    } as DOMRect);
  }

  function createSearchResult(): HTMLDivElement {
    const element = document.createElement("div");
    element.setAttribute("data-gsb-element-type", "google-search-result");
    return element;
  }

  it("pulls the anchor up by the rendered gap", () => {
    const target = createSearchResult();
    const anchor = document.createElement("div");
    stubBottom(target, 100);
    stubTop(anchor, 130);

    adjustAnchorMargin(target, anchor);

    expect(anchor.style.marginTop).toBe("-30px");
    expect(anchor.style.marginBottom).toBe("30px");
  });

  it("leaves margins untouched when there is no gap", () => {
    const target = createSearchResult();
    const anchor = document.createElement("div");
    stubBottom(target, 100);
    stubTop(anchor, 100);

    adjustAnchorMargin(target, anchor);

    expect(anchor.style.marginTop).toBe("");
    expect(anchor.style.marginBottom).toBe("");
  });

  it("ignores elements other than search results", () => {
    const target = document.createElement("div");
    target.setAttribute("data-gsb-element-type", "google-news-card");
    const anchor = document.createElement("div");
    stubBottom(target, 100);
    stubTop(anchor, 130);

    adjustAnchorMargin(target, anchor);

    expect(anchor.style.marginTop).toBe("");
    expect(anchor.style.marginBottom).toBe("");
  });
});
