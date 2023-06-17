import { Logger } from "../common";

// localize HTML
export default function localizeHtmlPage(): void {
  document.querySelectorAll("[data-i18n-text]").forEach((element: Element) => {
    const key = element.getAttribute("data-i18n-text")!;
    // eslint-disable-next-line no-param-reassign
    element.textContent = chrome.i18n.getMessage(key);
  });

  document.querySelectorAll("[data-i18n-value]").forEach((element: Element) => {
    if (element instanceof HTMLInputElement) {
      const key = element.getAttribute("data-i18n-value")!;
      // eslint-disable-next-line no-param-reassign
      element.value = chrome.i18n.getMessage(key);
    } else {
      Logger.error("[ERROR] element is not HTMLInputElement!", element);
    }
  });
}
