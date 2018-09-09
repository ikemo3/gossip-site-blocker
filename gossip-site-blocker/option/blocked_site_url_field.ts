/**
 * URL field
 */
class BlockedSiteUrlField {
    public element: HTMLInputElement;

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

    public getElement() {
        return this.element;
    }

    public value() {
        return this.element.getAttribute("data-value");
    }

    public getInputValue() {
        return this.element.value;
    }

    public toHard() {
        // do nothing
    }

    public toSoft() {
        // do nothing
    }

    public setUrl(url) {
        this.element.setAttribute("data-value", url);
        this.element.value = url;
    }
}
