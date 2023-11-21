import DocumentURL from "../values/document_url";
import { SearchResultToBlock } from "./contents";

export class GoogleNewsCard extends SearchResultToBlock {
  public valid: boolean;

  public url: string;

  public element: Element;

  private readonly title: string;

  static isCandidate(element: Element, documentURL: DocumentURL): boolean {
    return element.matches(".Cq2QEe") && documentURL.isGoogleSearchNewsTab();
  }

  // noinspection DuplicatedCode
  constructor(element: Element) {
    super();
    this.element = element;

    const anchorList = element.getElementsByTagName("a");

    const urlList = [];
    for (const anchor of anchorList) {
      const href = anchor.getAttribute("href");

      if (href === null) {
        continue;
      }

      urlList.push(href);
    }

    // ignore if no anchor.
    if (urlList.length === 0) {
      this.valid = false;
      return;
    }

    const heading = element.querySelector(".nDgy9d");
    if (heading) {
      this.title = heading.textContent ? heading.textContent : "";
    } else {
      // fallback
      this.title = "";
    }

    element.setAttribute("data-gsb-element-type", "google-news-card");
    this.valid = true;
    [this.url] = urlList;
  }

  public canRetry(): boolean {
    return true;
  }

  public canBlock(): boolean {
    return this.valid;
  }

  public getUrl(): string {
    return this.url;
  }

  public getElement(): Element {
    return this.element;
  }

  public getCompactMenuInsertElement(): Element {
    const div = this.element.querySelector(":scope > div");
    if (div !== null) {
      return div;
    }
    return this.element;
  }

  public getPosition(): string {
    return "relative";
  }

  public getCssClass(): string {
    return "block-google-card";
  }

  public getTitle(): string {
    return this.title;
  }

  public getContents(): string {
    return "";
  }
}
