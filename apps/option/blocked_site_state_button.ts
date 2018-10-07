class BlockedSiteStateButton {
    public element: HTMLInputElement;
    public mediator: BlockedSiteOption;
    public state: string;
    public handler: any;

    /**
     *
     * @param {BlockedSiteOption} mediator
     * @param {string} state
     */
    constructor(mediator: BlockedSiteOption, state: string) {
        this.mediator = mediator;

        const input = document.createElement("input");
        input.setAttribute("type", "button");
        this.element = input;

        this.setState(state);
    }

    public getState() {
        return this.state;
    }

    public setState(state: string) {
        this.state = state;

        this.updateLabel(state);

        this.updateBlockTypeHandler();
    }

    public updateBlockTypeHandler() {
        // remove handler
        if (this.handler) {
            this.element.removeEventListener("click", this.handler);
            this.handler = null;
        }

        if (this.state === "soft") {
            this.handler = this.mediator.toHard.bind(this.mediator);
        } else {
            this.handler = this.mediator.toSoft.bind(this.mediator);
        }

        // set handler
        if (this.handler) {
            this.element.addEventListener("click", this.handler);
        }
    }

    public updateLabel(state: string) {
        if (state === "soft") {
            this.element.setAttribute("value", chrome.i18n.getMessage("changeToHardBlock"));
        } else {
            this.element.setAttribute("value", chrome.i18n.getMessage("changeToSoftBlock"));
        }
    }

    public toHard() {
        this.setState("hard");
    }

    public toSoft() {
        this.setState("soft");
    }

    public getElement() {
        return this.element;
    }
}
