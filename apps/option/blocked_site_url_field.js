/**
 * URL field
 */
class BlockedSiteUrlField {
    /**
     *
     * @param {BlockedSiteOption} mediator
     * @param {string} url
     */
    constructor(mediator, url) {
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("size", "100");
        this.element = input;
        this.setUrl(url);
    }
    getElement() {
        return this.element;
    }
    value() {
        return this.element.getAttribute("data-value");
    }
    getInputValue() {
        return this.element.value;
    }
    toHard() {
        // do nothing
    }
    toSoft() {
        // do nothing
    }
    setUrl(url) {
        this.element.setAttribute("data-value", url);
        this.element.value = url;
    }
}
//# sourceMappingURL=blocked_site_url_field.js.map