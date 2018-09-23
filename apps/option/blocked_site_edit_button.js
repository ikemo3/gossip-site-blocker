/**
 * Change URL button
 */
class BlockedSiteEditButton {
    /**
     *
     * @param {BlockedSiteOption} mediator
     */
    constructor(mediator) {
        this.mediator = mediator;
        const input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("value", chrome.i18n.getMessage("UpdateUrl"));
        input.addEventListener("click", this.onclick.bind(this));
        this.element = input;
    }
    async onclick(ignore) {
        await this.mediator.editUrl();
    }
    getElement() {
        return this.element;
    }
    toHard() {
        // do nothing
    }
    toSoft() {
        // do nothing
    }
}
//# sourceMappingURL=blocked_site_edit_button.js.map