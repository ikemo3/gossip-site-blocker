/**
 * @property element Div element wrapping the anchor
 * @property anchor Anchor element
 * @property state blocked state
 * @property url URL to block
 */
class BlockAnchor {
    /**
     *
     * @param targetId target element's id
     * @param state
     * @param targetObject
     * @param url URL to block
     * @param reason reason to block.
     */
    constructor(mediator, targetId, state, targetObject, url, reason) {
        this.mediator = mediator;
        const div = document.createElement("div");
        div.classList.add("block-anchor");
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.setAttribute("data-blocker-target-id", targetId);
        div.appendChild(anchor);
        this.element = div;
        this.anchor = anchor;
        this.state = state;
        this.targetObject = targetObject;
        this.handler = null;
        this.reason = reason;
        this.url = url;
        this.updateText();
        this.setHandler();
        this.changeAnchor = new BlockChangeAnchor(div, url, reason);
        this.changeAnchor.changeState(state);
    }
    getDOMElement() {
        return this.element;
    }
    setWrappable(width) {
        this.element.style.width = width;
        this.element.style.whiteSpace = "normal";
    }
    setState(newState) {
        this.state = newState;
        this.anchor.setAttribute("data-blocker-state", newState);
        this.changeAnchor.changeState(newState);
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
                this.handler = this.showBlockDialog.bind(this);
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
    showBlockDialog() {
        // show dialog.
        new BlockDialog(this, this.url);
    }
    async blockPage(url, blockType) {
        // hide element.
        this.targetObject.block(url);
        this.setState(blockType);
        // add URL to block.
        await BlockedSitesRepository.add(url, blockType);
        this.setReason(url);
    }
    unhide() {
        // show block temporarily.
        this.setState("unhide");
    }
    hide() {
        this.setState("soft");
    }
}
//# sourceMappingURL=block_anchor.js.map