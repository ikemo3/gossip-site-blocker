import { describe, expect, it } from "vitest";

import DocumentURL from "../apps/values/document_url";

const GOOGLE_SEARCH_URL =
  "https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j0i131i433i512l2j0i512j0i433i512l4j0i512j0i433i512.505j0j7&sourceid=chrome&ie=UTF-8";
const GOOGLE_SEARCH_NEWS_TAB_URL =
  "https://www.google.com/search?q=test&source=lnms&tbm=nws&sa=X&ved=2ahUKEwjJuafmmdH-AhWWdd4KHbaCCn4Q_AUoAXoECAEQAw&biw=1607&bih=806&dpr=2";
const GOOGLE_SEARCH_IMAGE_TAB_URL =
  "https://www.google.com/search?q=test&tbm=isch&source=lnms&sa=X&ved=2ahUKEwi8uLDtmdH-AhXEEXAKHRn8ACQQ_AUoAnoECAEQBA&biw=1607&bih=806&dpr=2";

describe("DocumentURL", () => {
  it("Google Search URL", () => {
    const documentUrl = new DocumentURL(GOOGLE_SEARCH_URL);

    expect(documentUrl.isGoogleSearch()).toBe(true);
    expect(documentUrl.isGoogleSearchNewsTab()).toBe(false);
    expect(documentUrl.isGoogleSearchImageTab()).toBe(false);
  });

  it("Google Search New Tab URL", () => {
    const documentUrl = new DocumentURL(GOOGLE_SEARCH_NEWS_TAB_URL);

    expect(documentUrl.isGoogleSearch()).toBe(false);
    expect(documentUrl.isGoogleSearchNewsTab()).toBe(true);
    expect(documentUrl.isGoogleSearchImageTab()).toBe(false);
  });

  it("Google Search Image Tab URL", () => {
    const documentUrl = new DocumentURL(GOOGLE_SEARCH_IMAGE_TAB_URL);

    expect(documentUrl.isGoogleSearch()).toBe(false);
    expect(documentUrl.isGoogleSearchNewsTab()).toBe(false);
    expect(documentUrl.isGoogleSearchImageTab()).toBe(true);
  });
});

describe("Search In English", () => {
  it("normal", () => {
    const documentUrl = new DocumentURL(GOOGLE_SEARCH_URL);
    const expected = GOOGLE_SEARCH_URL + "&gl=us&hl=en";

    expect(documentUrl.buildSearchInEnglishURL()).toBe(expected);
  });

  it("has fragment", () => {
    const documentUrl = new DocumentURL(
      "https://www.google.com/search?q=test&rlz=xxx&oq=test&aqs=yyy&sourceid=chrome&ie=UTF-8#bsht=zzz",
    );
    const expected =
      "https://www.google.com/search?q=test&rlz=xxx&oq=test&aqs=yyy&sourceid=chrome&ie=UTF-8&gl=us&hl=en#bsht=zzz";

    expect(documentUrl.buildSearchInEnglishURL()).toBe(expected);
  });
});
