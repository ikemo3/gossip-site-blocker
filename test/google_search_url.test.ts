import { describe, expect, it } from "vitest";

import GoogleSearchURL from "../apps/values/google_search_url";

describe("GoogleSearchURL", () => {
  it("getURLParameter", () => {
    const url = new GoogleSearchURL(
      "/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=def&url=https%3A%2F%2Fexample.com%2Ffoo&usg=abc",
    );
    expect(url.getURLParameter()).toBe("https://example.com/foo");
  });

  it("getURLParameter(no usg)", () => {
    const url = new GoogleSearchURL(
      "/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=def&url=https%3A%2F%2Fexample.com%2Ffoo",
    );
    expect(url.getURLParameter()).toBe("https://example.com/foo");
  });

  it("getURLParameter(no url)", () => {
    const url = new GoogleSearchURL(
      "/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=def&urx=https%3A%2F%2Fexample.com%2Ffoo&usg=abc",
    );
    expect(url.getURLParameter()).toBe(null);
  });
});
