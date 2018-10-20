/**
 * Block target element.
 */
class BlockTarget {
    constructor(mediator, element, url, state) {
        this.mediator = mediator;
        this.element = element;
        this.setUrl(url);
        this.setState(state);
    }
    remove() {
        this.element.parentElement.removeChild(this.element);
    }
    getDOMElement() {
        return this.element;
    }
    setUrl(url) {
        this.element.setAttribute("data-blocker-url", url);
    }
    getUrl() {
        return this.element.getAttribute("data-blocker-url");
    }
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
                this.none();
                break;
        }
    }
    block(url) {
        this.setUrl(url);
        this.hide();
    }
    none() {
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