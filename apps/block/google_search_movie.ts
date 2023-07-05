import { SearchResultToBlock } from "./block";
import DocumentURL from "../values/document_url";
import { Logger } from "../common";

export class GoogleSearchMovie extends SearchResultToBlock {
  private readonly element: Element;

  private readonly valid: boolean;

  private readonly url: string;

  private readonly title: string;

  private readonly compactMenuInsertElement: Element;

  static isCandidate(element: Element, documentURL: DocumentURL): boolean {
    return (
      element.matches("div.mLmaBd") && !documentURL.isGoogleSearchNewsTab()
    );
  }

  // noinspection DuplicatedCode
  constructor(element: Element) {
    super();
    this.element = element;

    const anchor = element.querySelector(
      "a:not(.vGvPJe)"
    ) as HTMLAnchorElement | null;
    if (anchor === null) {
      Logger.debug("movie: anchor not found", element);
      this.valid = false;
      return;
    }

    const { href } = anchor;
    if (href === "") {
      Logger.debug("movie: anchor.href is empty", element);
      this.valid = false;
      return;
    }

    const titleDiv = anchor.querySelector(".cHaqb");
    if (titleDiv === null) {
      Logger.debug("movie: title not found", element);
      this.valid = false;
      return;
    }

    const title = titleDiv.textContent !== null ? titleDiv.textContent : "";
    Logger.debug("movie: valid", anchor, href, title);

    element.setAttribute("data-gsb-element-type", "google-search-movie");
    this.compactMenuInsertElement = anchor;
    this.valid = true;
    this.url = href;
    this.title = title;
  }

  public canRetry(): boolean {
    return true;
  }

  public canBlock(): boolean {
    return this.valid;
  }

  public getElement(): Element {
    return this.element;
  }

  public getCompactMenuInsertElement(): Element {
    return this.compactMenuInsertElement;
  }

  public getPosition(): string {
    return "relative";
  }

  public getUrl(): string {
    return this.url;
  }

  public getCssClass(): string {
    return "block-google-movie";
  }

  public getTitle(): string {
    return this.title;
  }

  public getContents(): string {
    return "";
  }
}
