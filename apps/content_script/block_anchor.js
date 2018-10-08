class BlockAnchor {
    constructor(mediator, div, targetId, state, url, reason) {
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
    setState(newState) {
        this.state = newState;
        this.anchor.setAttribute("data-blocker-state", newState);
        this.setHandler();
        this.updateText();
    }
    setHandler() {
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
    updateText() {
        switch (this.state) {
            case "none":
                this.anchor.textContent = chrome.i18n.getMessage("blockThisPage");
                break;
            case "soft":
                this.anchor.textContent = chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(this.reason)]);
                break;
            case "hard":
                this.anchor.textContent = "";
                break;
            case "unhide":
                this.anchor.textContent = chrome.i18n.getMessage("unhideThisPage");
                break;
        }
    }
    setReason(reason) {
        this.reason = reason;
        this.updateText();
    }
    unhide() {
        // show block temporarily.
        this.setState("unhide");
    }
    hide() {
        this.setState("soft");
    }
    block(url, blockType) {
        this.setState(blockType);
        this.setReason(url);
    }
}
//# sourceMappingURL=block_anchor.js.map