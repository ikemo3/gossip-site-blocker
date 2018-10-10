/**
 * Delete button
 */
class BlockedSiteDeleteButton {
    /**
     *
     * @param {BlockedSiteOption} mediator
     * @param {string} state
     */
    constructor(mediator, state) {
        this.mediator = mediator;
        const input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("value", chrome.i18n.getMessage("unblock"));
        input.addEventListener("click", this.onclick.bind(this));
        this.element = input;
        this.setState(state);
    }
    async onclick() {
        await this.mediator.deleteUrl();
    }
    getElement() {
        return this.element;
    }
    setState(state) {
        if (state === "hard") {
            this.toHard();
        }
        else {
            this.toSoft();
        }
    }
    toHard() {
        // disable button.
        this.element.setAttribute("disabled", "true");
    }
    toSoft() {
        // enable button.
        this.element.removeAttribute("disabled");
    }
}
//# sourceMappingURL=blocked_site_delete_button.js.map