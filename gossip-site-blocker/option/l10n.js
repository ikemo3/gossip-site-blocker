// localize HTML
function localizeHtmlPage() {
    document.querySelectorAll("[data-i18n-text]").forEach(element => {
        const key = element.getAttribute("data-i18n-text");
        element.textContent = chrome.i18n.getMessage(key);
    });

    document.querySelectorAll("[data-i18n-value]").forEach(element => {
        const key = element.getAttribute("data-i18n-value");
        element.value = chrome.i18n.getMessage(key);
    });
}

localizeHtmlPage();
