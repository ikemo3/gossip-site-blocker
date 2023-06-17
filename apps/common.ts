import { BannedTarget, BlockType } from "./repository/enums";

export const ChromeStorage = {
  async load<T>(keys: T): Promise<T> {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      chrome.storage.local.get(keys, resolve);
    });
  },

  // eslint-disable-next-line @typescript-eslint/ban-types
  async save(items: object): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, resolve);
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get(keys: any): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, resolve);
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(items: any): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, resolve);
    });
  },
};

export const Logger = {
  developerMode: false,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: any, ...params: any[]): void {
    if (this.developerMode) {
      // eslint-disable-next-line no-console
      console.log(message, ...params);
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: any, ...params: any[]): void {
    // eslint-disable-next-line no-console
    console.log(message, ...params);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: any, ...params: any[]): void {
    // eslint-disable-next-line no-console
    console.error(message, ...params);
  },
};

export const DOMUtils = {
  /**
   * add element later.
   *
   * @param element
   * @param insertElement element to add.
   */
  insertAfter(element: Element, insertElement: Element): void {
    element.parentElement!.insertBefore(insertElement, element.nextSibling);
  },

  /**
   * get hostname from URL string.
   *
   * example: https://example.com/path -> example.com
   * @param {string} url URL string
   * @return {string} hostname
   */
  getHostName(url: string): string {
    const tmp = document.createElement("a");
    tmp.href = url;
    return tmp.hostname;
  },

  /**
   * delete protocol(scheme) and fragment from URL string.
   *
   * @param {string} url URL string
   * @return {string} string without protocol(scheme) and fragment
   */
  removeProtocol(url: string): string {
    return url.replace(/^\w+:\/\//, "").replace(/#.*/, "");
  },
};

export interface TextAreaParams {
  id?: string;
  cols?: number;
  rows?: number;
}

export const $ = {
  anchor(text?: string): HTMLAnchorElement {
    const anchor = document.createElement("a");
    // eslint-disable-next-line no-script-url
    anchor.removeAttribute("href");
    anchor.classList.add("gsb-anchor");

    if (text !== undefined) {
      anchor.textContent = text;
    }

    return anchor;
  },

  br(): HTMLBRElement {
    return document.createElement("br");
  },

  button(value: string, clazz?: string): HTMLInputElement {
    const button = document.createElement("input");
    button.type = "button";
    button.value = value;

    if (clazz) {
      button.classList.add(clazz);
    }

    return button;
  },

  decodeURI(encodedURI: string): string {
    try {
      return decodeURI(encodedURI);
    } catch (e) {
      return encodedURI;
    }
  },

  div(clazz?: string): HTMLDivElement {
    const div = document.createElement("div");

    if (clazz !== undefined) {
      div.classList.add(clazz);
    }

    return div;
  },

  escape(str: string): string {
    return str.replace(/\\/g, "\\\\").replace(/\+/g, "\\+").replace(/ /g, "+");
  },

  escapeRegExp(str: string): string {
    return str.replace(/[.*+?^=!:${}()|[\]/\\]/g, "\\$&");
  },

  hide(element: HTMLElement): void {
    // eslint-disable-next-line no-param-reassign
    element.style.display = "none";
  },

  insertBefore(element: HTMLElement, afterElement: HTMLElement): void {
    afterElement.parentElement!.insertBefore(element, afterElement);
  },

  async isGoogleSearch(url: string): Promise<boolean> {
    const manifestUrl = chrome.runtime.getURL("manifest.json");

    const response = await fetch(manifestUrl);
    const manifest = await response.json();
    const { matches } = manifest.content_scripts[0];

    for (const match of matches) {
      // remove last '*' of pattern.
      const pattern = match.replace("*", "");

      if (url.startsWith(pattern)) {
        return true;
      }
    }

    return false;
  },

  label(text: string, htmlFor: string): HTMLLabelElement {
    const label = document.createElement("label");
    label.htmlFor = htmlFor;
    label.textContent = text;
    return label;
  },

  message(messageName: string, substitutions?: string): string {
    return chrome.i18n.getMessage(messageName, substitutions);
  },

  onclick(
    element: HTMLElement,
    listener: EventListenerOrEventListenerObject
  ): void {
    element.addEventListener("click", listener);
  },

  option(value: string, text: string): HTMLOptionElement {
    const option = document.createElement("option");
    option.setAttribute("value", value);
    option.textContent = text;
    return option;
  },

  radio(name: string, value: string, id: string): HTMLInputElement {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = name;
    radio.value = value;
    radio.id = id;
    return radio;
  },

  regexp(pattern: string): RegExp | null {
    try {
      return new RegExp(pattern);
    } catch (e) {
      return null;
    }
  },

  removeSelf(element: Element): void {
    element.parentElement!.removeChild(element);
  },

  show(element: HTMLElement): void {
    // eslint-disable-next-line no-param-reassign
    element.style.display = "inline";
  },

  showBlock(element: HTMLElement): void {
    // eslint-disable-next-line no-param-reassign
    element.style.display = "block";
  },

  span(text: string, clazz?: string): HTMLSpanElement {
    const span = document.createElement("span");
    span.textContent = text;

    if (clazz !== undefined) {
      span.classList.add(clazz);
    }

    return span;
  },

  text(element: HTMLElement, text: string): void {
    // eslint-disable-next-line no-param-reassign
    element.textContent = text;
  },

  textarea(value: string, params: TextAreaParams): HTMLTextAreaElement {
    const textarea = document.createElement("textarea");
    textarea.textContent = value;

    if (params.cols) {
      textarea.cols = params.cols;
    }

    if (params.id) {
      textarea.id = params.id;
    }

    if (params.rows) {
      textarea.rows = params.rows;
    }

    return textarea;
  },

  textField(value: string, size?: number): HTMLInputElement {
    const textField = document.createElement("input");
    textField.type = "text";
    textField.value = value;

    if (size !== undefined) {
      textField.size = size;
    }

    return textField;
  },

  toBlockType(value: string): BlockType {
    switch (value) {
      case "hard":
        return BlockType.HARD;
      case "soft":
      default:
        return BlockType.SOFT;
    }
  },

  toBannedTarget(value: string): BannedTarget {
    switch (value) {
      case "titleOnly":
        return BannedTarget.TITLE_ONLY;
      case "titleAndContents":
      default:
        return BannedTarget.TITLE_AND_CONTENTS;
    }
  },

  unescape(str: string): string {
    return str.replace(/(\\\\|\\\+|\+)/g, (matched) => {
      if (matched === "\\\\") {
        return "\\";
      }
      if (matched === "\\+") {
        return "+";
      }
      if (matched === "+") {
        return " ";
      }
      return matched;
    });
  },
};

export class ApplicationError implements Error {
  public message: string;

  public name = "Application Error";

  constructor(message: string) {
    this.message = message;
  }

  public toString(): string {
    return `${this.name}: ${this.message}`;
  }
}
