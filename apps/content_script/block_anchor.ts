class BlockAnchor {
    public anchor: HTMLAnchorElement;
    public state: string;
    public handler: any;
    public url: string;
    private reason: string | null;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator,
                div: HTMLDivElement,
                targetId: string,
                state: string,
                url: string,
                reason: string | null) {
        this.mediator = mediator;

        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.setAttribute("data-blocker-target-id", targetId);
        div.appendChild(anchor);

        this.anchor = anchor;
        this.state = state;
        this.handler = null;
        this.reason = reason;
        this.url = url;

        this.updateText();
        this.setHandler();
    }

    public setState(newState: string) {
        this.state = newState;
        this.anchor.setAttribute("data-blocker-state", newState);

        this.setHandler();
        this.updateText();
    }

    public setHandler() {
        if (this.handler) {
            this.anchor.removeEventListener("click", this.handler);
            this.handler = null;
        }

        switch (this.state) {
            case "none":
                // set handler to block.
                this.handler = this.mediator.showBlockDialog.bind(this.mediator);
                break;

            case "soft":
                // set handler to unhide.
                this.handler = this.mediator.unhide.bind(this.mediator);
                break;

            case "hard":
                // do nothing.
                break;

            case "unhide":
                // set handler to hide.
                this.handler = this.mediator.hide.bind(this.mediator);
                break;
        }

        if (this.handler) {
            this.anchor.addEventListener("click", this.handler);
        }
    }

    public updateText() {
        switch (this.state) {
            case "none":
                this.anchor.textContent = chrome.i18n.getMessage("blockThisPage");
                break;
            case "soft":
                this.anchor.textContent = chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(this.reason!)]);
                break;
            case "hard":
                this.anchor.textContent = "";
                break;
            case "unhide":
                this.anchor.textContent = chrome.i18n.getMessage("unhideThisPage");
                break;
        }
    }

    public setReason(reason: string) {
        this.reason = reason;
        this.updateText();
    }

    public unhide() {
        // show block temporarily.
        this.setState("unhide");
    }

    public hide() {
        this.setState("soft");
    }

    public block(url: string, blockType: string) {
        this.setState(blockType);
        this.setReason(url);
    }
}
