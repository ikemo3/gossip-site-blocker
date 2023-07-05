import { SearchResultToBlock } from "./block";
import DocumentURL from "../values/document_url";
import { Logger } from "../common";

export class GoogleNewsResult extends SearchResultToBlock {
  private readonly valid: boolean;

  private readonly _canRetry: boolean;

  private readonly url: string;

  private readonly element: Element;

  private readonly title: string;

  private readonly contents: string;

  private readonly compactMenuInsertElement: Element;

  static isCandidate(element: Element, documentURL: DocumentURL): boolean {
    return element.matches("div.SoaBEf") && documentURL.isGoogleSearchNewsTab();
  }

  // noinspection DuplicatedCode
  constructor(element: Element) {
    super();
    this.element = element;

    const anchor = this.getElement().querySelector("a");
    if (anchor === null) {
      Logger.debug("news top: anchor not found", this.getElement());
      this.valid = false;
      this._canRetry = true;
      return;
    }

    let href = anchor.getAttribute("href") as string;

    // firefox, coccoc, ...
    if (href.startsWith("/url?")) {
      const matchData = href.match("&url=(.*)&");
      if (matchData !== null) {
        [href] = matchData;
      }
    }

    const titleElement = this.getElement().querySelector("[role='heading']");

    // ignore if no titleElement(ex. Google Translate)
    if (titleElement === null) {
      Logger.debug(
        "news top: no title element(ex. Google Translate)",
        this.getElement(),
      );
      this.valid = false;
      this._canRetry = false;
      return;
    }

    const title = titleElement.textContent ? titleElement.textContent : "";
    const st: HTMLSpanElement | null = this.getElement().querySelector(".st");
    const contents = st ? st.textContent! : "";

    this.getElement().setAttribute(
      "data-gsb-element-type",
      "google-news-tab-top",
    );
    this.valid = true;
    this._canRetry = true;
    this.url = href;
    this.title = title;
    this.contents = contents;

    // operation insert point
    const actionMenu = this.element.querySelector(".action-menu");

    if (actionMenu !== null) {
      this.compactMenuInsertElement = actionMenu;
    } else {
      this.compactMenuInsertElement = this.getElement().querySelector("a")!;
    }
  }

  public canRetry(): boolean {
    return this._canRetry;
  }

  public canBlock(): boolean {
    return this.valid;
  }

  public getUrl(): string {
    return this.url;
  }

  public getElement(): Element {
    return this.element.firstElementChild || this.element;
  }

  public getCompactMenuInsertElement(): Element {
    return this.compactMenuInsertElement;
  }

  public deleteElement(): void {
    const imageLink = this.element.previousSibling;
    if (imageLink instanceof HTMLAnchorElement) {
      imageLink.removeAttribute("href");
    }

    this.element.parentElement!.removeChild(this.element);
  }

  public getPosition(): string {
    return "absolute";
  }

  public getCssClass(): string {
    return "block-google-news-top";
  }

  public getTitle(): string {
    return this.title;
  }

  public getContents(): string {
    return this.contents;
  }
}
