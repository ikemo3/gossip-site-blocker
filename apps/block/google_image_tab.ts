import { Logger } from "../libs/logger";
import { MenuPositionType } from "../storage/enums";
import DocumentURL from "../values/document_url";
import { SearchResultToBlock } from "./contents";

export class GoogleImageTab extends SearchResultToBlock {
  private readonly valid: boolean;

  private readonly _canRetry: boolean;

  private readonly title: string;

  private readonly url: string;

  private readonly element: Element;

  private readonly compactMenuInsertElement: Element;

  static isCandidate(element: Element, documentURL: DocumentURL): boolean {
    const hasClass = element.classList.contains("eA0Zlc");
    const isImageTab = documentURL.isGoogleSearchImageTab();

    if (hasClass && isImageTab) {
      Logger.debug(
        "[GSB] GoogleImageTab.isCandidate: TRUE - class:",
        hasClass,
        "imageTab:",
        isImageTab,
      );
    } else if (hasClass || isImageTab) {
      Logger.debug(
        "[GSB] GoogleImageTab.isCandidate: FALSE - class:",
        hasClass,
        "imageTab:",
        isImageTab,
        "URL:",
        documentURL.toString(),
      );
    }

    return hasClass && isImageTab;
  }

  // noinspection DuplicatedCode
  constructor(element: Element) {
    super();
    this.element = element;

    const anchor = element.querySelector("a.EZAeBe");
    if (!anchor) {
      Logger.debug("image tab: anchor not found", element);
      this.valid = false;
      this._canRetry = true;
      return;
    }

    const href = anchor.getAttribute("href");
    if (!href) {
      Logger.debug("image tab: href not found", element);
      this.valid = false;
      this._canRetry = true;
      return;
    }

    const image = element.querySelector("img.YQ4gaf");
    if (!image) {
      Logger.debug("image tab: image not found", element);
      this.valid = false;
      this._canRetry = true;
      return;
    }

    const alt = image.getAttribute("alt");
    this.title = alt || "";
    this.url = href;
    this.valid = true;
    this._canRetry = true;
    this.compactMenuInsertElement = anchor;
  }

  canBlock(): boolean {
    return this.valid;
  }

  canRetry(): boolean {
    return this._canRetry;
  }

  getCompactMenuInsertElement(): Element {
    return this.compactMenuInsertElement;
  }

  getCssClass(): string {
    return "block-google-image-tab";
  }

  getElement(): Element {
    return this.element;
  }

  getPosition(): string {
    return "absolute";
  }

  getUrl(): string {
    return this.url;
  }

  getContents(): string {
    return "";
  }

  getTitle(): string {
    return this.title;
  }

  getMenuPosition(_: MenuPositionType): MenuPositionType {
    return MenuPositionType.COMPACT;
  }
}
