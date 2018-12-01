class BlockChangeAnchor {
    constructor(mediator, parent) {
        this.mediator = mediator;
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.textContent = chrome.i18n.getMessage("changeBlockState");
        anchor.addEventListener("click", this.mediator.showChangeStateDialog.bind(this));
        parent.appendChild(anchor);
        this.anchor = anchor;
    }
    changeState(state) {
        switch (state) {
            case "unhide":
                this.anchor.style.display = "inline";
                break;
            default:
                this.anchor.style.display = "none";
                break;
        }
    }
    none() {
        this.anchor.style.display = "none";
    }
    hide() {
        this.anchor.style.display = "none";
    }
    unhide(blockReason) {
        if (blockReason.getType() === BlockType.URL_EXACTLY) {
            this.anchor.style.display = "inline";
        }
        else {
            this.anchor.style.display = "none";
        }
    }
    block() {
        this.anchor.style.display = "none";
    }
}
//# sourceMappingURL=block_change_anchor.js.map