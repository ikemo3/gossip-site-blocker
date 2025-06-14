import fs from "fs";
import { JSDOM } from "jsdom";
import path from "path";
import { beforeEach, describe, expect, it } from "vitest";

import { GoogleImageTab } from "../apps/block/google_image_tab";
import DocumentURL from "../apps/values/document_url";

describe("GoogleImageTab", () => {
  let dom: JSDOM;
  let document: Document;
  let documentURL: DocumentURL;

  beforeEach(() => {
    const fixtureHtml = fs.readFileSync(
      path.join(__dirname, "fixtures", "google-image-search-hatsune-miku.html"),
      "utf-8",
    );
    dom = new JSDOM(fixtureHtml, {
      url: "https://www.google.com/search?q=hatsune+miku&tbm=isch",
    });
    document = dom.window.document;
    documentURL = new DocumentURL(
      "https://www.google.com/search?q=hatsune+miku&tbm=isch",
    );
    global.document = document;
  });

  describe("isCandidate", () => {
    it("should return true for valid image tab elements on image search page", () => {
      const elements = document.querySelectorAll(".eA0Zlc");
      expect(elements.length).toBeGreaterThan(0);

      const firstElement = elements[0];
      const result = GoogleImageTab.isCandidate(firstElement, documentURL);
      expect(result).toBe(true);
    });

    it("should return false for non-image search page", () => {
      const regularDocumentURL = new DocumentURL(
        "https://www.google.com/search?q=test",
      );
      const elements = document.querySelectorAll(".eA0Zlc");

      if (elements.length > 0) {
        const result = GoogleImageTab.isCandidate(
          elements[0],
          regularDocumentURL,
        );
        expect(result).toBe(false);
      }
    });
  });

  describe("constructor and methods", () => {
    it("should create valid GoogleImageTab instance from fixture element", () => {
      const elements = document.querySelectorAll(".eA0Zlc");
      expect(elements.length).toBeGreaterThan(0);

      const firstElement = elements[0];
      const googleImageTab = new GoogleImageTab(firstElement);

      expect(googleImageTab.canBlock()).toBe(true);
      expect(googleImageTab.canRetry()).toBe(true);
      expect(googleImageTab.getCssClass()).toBe("block-google-image-tab");
      expect(googleImageTab.getPosition()).toBe("absolute");
      expect(googleImageTab.getContents()).toBe("");
    });

    it("should extract title from image alt attribute", () => {
      const elements = document.querySelectorAll(".eA0Zlc");

      if (elements.length > 0) {
        const firstElement = elements[0];
        const googleImageTab = new GoogleImageTab(firstElement);

        if (googleImageTab.canBlock()) {
          const title = googleImageTab.getTitle();
          expect(typeof title).toBe("string");
        }
      }
    });

    it("should extract URL from anchor href", () => {
      const elements = document.querySelectorAll(".eA0Zlc");

      if (elements.length > 0) {
        const firstElement = elements[0];
        const googleImageTab = new GoogleImageTab(firstElement);

        if (googleImageTab.canBlock()) {
          const url = googleImageTab.getUrl();
          expect(url).toBeTruthy();
          expect(typeof url).toBe("string");
        }
      }
    });
  });
});
