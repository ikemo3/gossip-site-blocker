import fs from "fs";
import { JSDOM } from "jsdom";
import path from "path";
import { beforeEach, describe, expect, it } from "vitest";

import { GoogleSearchResult } from "../apps/block/google_search_result";
import DocumentURL from "../apps/values/document_url";

describe("GoogleSearchResult", () => {
  let dom: JSDOM;
  let document: Document;
  let documentURL: DocumentURL;

  beforeEach(() => {
    const fixtureHtml = fs.readFileSync(
      path.join(__dirname, "fixtures", "google-search-hatsune-miku.html"),
      "utf-8",
    );
    dom = new JSDOM(fixtureHtml, {
      url: "https://www.google.com/search?q=test",
    });
    document = dom.window.document;
    documentURL = new DocumentURL("https://www.google.com/search?q=test");
    global.document = document;
  });

  describe("isCandidate", () => {
    it("should return true for valid search result elements on search page", () => {
      const elements = document.querySelectorAll("[data-rpos]");
      // Google typically shows multiple search results (at least 5 on a standard page)
      expect(elements.length).toBeGreaterThanOrEqual(5);

      const firstElement = elements[0];
      const result = GoogleSearchResult.isCandidate(firstElement, documentURL);
      expect(result).toBe(true);
    });
  });

  describe("constructor", () => {
    it("should create valid GoogleSearchResult with URL and title", () => {
      const elements = document.querySelectorAll("[data-rpos]");
      // Google typically shows multiple search results (at least 5 on a standard page)
      expect(elements.length).toBeGreaterThanOrEqual(5);

      const firstElement = elements[0];
      const searchResult = new GoogleSearchResult(firstElement);

      expect(searchResult.canBlock()).toBe(true);
      // URL should be a valid http/https URL
      expect(searchResult.getUrl()).toMatch(/^https?:\/\/.+/);
      // Title should be a non-empty string
      expect(searchResult.getTitle()).toBeTruthy();
    });
  });
});
