// localize HTML
function localizeHtmlPage() {
    document.querySelectorAll("[data-i18n-text]").forEach((element) => {
        const key = element.getAttribute("data-i18n-text");
        element.textContent = chrome.i18n.getMessage(key);
    });
    document.querySelectorAll("[data-i18n-value]").forEach((element) => {
        if (element instanceof HTMLInputElement) {
            const key = element.getAttribute("data-i18n-value");
            element.value = chrome.i18n.getMessage(key);
        }
        else {
            Logger.error("[ERROR] element is not HTMLInputElement!", element);
        }
    });
}
localizeHtmlPage();
//# sourceMappingURL=l10n.js.map