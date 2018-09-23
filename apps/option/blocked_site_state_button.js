class BlockedSiteStateButton {
    /**
     *
     * @param {BlockedSiteOption} mediator
     * @param {string} state
     */
    constructor(mediator, state) {
        this.mediator = mediator;
        const input = document.createElement("input");
        input.setAttribute("type", "button");
        this.element = input;
        this.setState(state);
    }
    getState() {
        return this.state;
    }
    setState(state) {
        this.state = state;
        this.updateLabel(state);
        this.updateBlockTypeHandler();
    }
    updateBlockTypeHandler() {
        // remove handler
        if (this.handler) {
            this.element.removeEventListener("click", this.handler);
            this.handler = null;
        }
        if (this.state === "soft") {
            this.handler = this.mediator.toHard.bind(this.mediator);
        }
        else {
            this.handler = this.mediator.toSoft.bind(this.mediator);
        }
        // set handler
        if (this.handler) {
            this.element.addEventListener("click", this.handler);
        }
    }
    updateLabel(state) {
        if (state === "soft") {
            this.element.setAttribute("value", chrome.i18n.getMessage("changeToHardBlock"));
        }
        else {
            this.element.setAttribute("value", chrome.i18n.getMessage("changeToSoftBlock"));
        }
    }
    toHard() {
        this.setState("hard");
    }
    toSoft() {
        this.setState("soft");
    }
    getElement() {
        return this.element;
    }
}
//# sourceMappingURL=blocked_site_state_button.js.map