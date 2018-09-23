/**
 * Block target element.
 *
 * @property element {Element}
 * @property id {string}
 */
class BlockTarget {
    /**
     *
     * @param element {Element} block target element
     * @param url {string}
     * @param id {string}
     * @param state {"none"|"soft"|"hard"}
     */
    constructor(element, url, id, state) {
        this.element = element;
        this.setUrl(url);
        // set id.
        this.id = id;
        this.element.setAttribute("id", id);
        this.setState(state);
    }
    getDOMElement() {
        return this.element;
    }
    /**
     * @private
     * @param url {string}
     */
    setUrl(url) {
        this.element.setAttribute("data-blocker-url", url);
    }
    /**
     * @returns {string}
     */
    getUrl() {
        return this.element.getAttribute("data-blocker-url");
    }
    /**
     *
     * @param state {"none"|"soft"|"hard"}
     */
    setState(state) {
        this.element.setAttribute("data-blocker-state", state);
        switch (state) {
            case "hard":
                // When it is hard it should not reach here.
                // noinspection TsLint
                console.error("Program Error, state=hard");
                break;
            case "soft":
                this.hide();
                break;
            default:
                this.show();
                break;
        }
    }
    block(url) {
        this.setUrl(url);
        this.hide();
    }
    show() {
        this.element.removeAttribute("data-blocker-display");
    }
    hide() {
        this.element.setAttribute("data-blocker-display", "none");
    }
    unhide() {
        this.element.setAttribute("data-blocker-display", "unhide");
    }
}
//# sourceMappingURL=block_target.js.map