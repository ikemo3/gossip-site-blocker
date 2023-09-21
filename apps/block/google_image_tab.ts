import { SearchResultToBlock } from "./contents";
import DocumentURL from "../values/document_url";
import { MenuPositionType } from "../storage/enums";
import { Logger } from "../libs/logger";

export class GoogleImageTab extends SearchResultToBlock {
  private readonly valid: boolean;

  private readonly _canRetry: boolean;

  private readonly title: string;

  private readonly url: string;

  private readonly element: Element;

  private readonly compactMenuInsertElement: Element;

  static isCandidate(element: Element, documentURL: DocumentURL): boolean {
    return (
      element.classList.contains("PNCib") &&
      documentURL.isGoogleSearchImageTab()
    );
  }

  // noinspection DuplicatedCode
  constructor(element: Element) {
    super();
    this.element = element;

    const anchor = element.querySelector("a.iGVLpd");
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

    const image = element.querySelector("img.Q4LuWd");
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
