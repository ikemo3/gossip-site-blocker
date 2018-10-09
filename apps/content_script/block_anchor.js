class BlockAnchor {
    constructor(mediator, div, targetId) {
        this.mediator = mediator;
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.setAttribute("data-blocker-target-id", targetId);
        anchor.textContent = chrome.i18n.getMessage("blockThisPage");
        anchor.addEventListener("click", this.mediator.showBlockDialog.bind(this.mediator));
        div.appendChild(anchor);
        this.anchor = anchor;
    }
    none() {
        this.anchor.style.display = "inline";
    }
    unhide(blockReason) {
        if (blockReason.getType() !== BlockType.URL) {
            this.anchor.style.display = "inline";
        }
        else {
            this.anchor.style.display = "none";
        }
    }
    hide() {
        this.anchor.style.display = "none";
    }
    block() {
        this.anchor.style.display = "none";
    }
}
//# sourceMappingURL=block_anchor.js.map