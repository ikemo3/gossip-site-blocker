/**
 * Delete button
 */
class BlockedSiteDeleteButton {
    public element: HTMLInputElement;
    public mediator: BlockedSiteOption;

    /**
     *
     * @param {BlockedSiteOption} mediator
     * @param {string} state
     */
    constructor(mediator, state) {
        this.mediator = mediator;

        const input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("value", chrome.i18n.getMessage("deleteUrl"));
        input.addEventListener("click", this.onclick.bind(this));
        this.element = input;

        this.setState(state);
    }

    public async onclick(ignore) {
        await this.mediator.deleteUrl();
    }

    public getElement() {
        return this.element;
    }

    public setState(state) {
        if (state === "hard") {
            this.toHard();
        } else {
            this.toSoft();
        }
    }

    public toHard() {
        // disable button.
        this.element.setAttribute("disabled", "true");
    }

    public toSoft() {
        // enable button.
        this.element.removeAttribute("disabled");
    }
}
