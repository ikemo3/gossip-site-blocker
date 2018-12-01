class BlockAnchor {
    constructor(mediator, div) {
        this.mediator = mediator;
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.textContent = chrome.i18n.getMessage("blockThisPage");
        anchor.addEventListener("click", this.mediator.showBlockDialog.bind(this.mediator));
        const br = document.createElement("br");
        div.appendChild(anchor);
        div.appendChild(br);
        this.anchor = anchor;
        this.br = br;
    }
    none() {
        this.anchor.style.display = "inline";
        this.br.style.display = "inline";
        this.anchor.textContent = chrome.i18n.getMessage("blockThisPage");
    }
    unhide(blockReason) {
        if (blockReason.getType() !== BlockType.URL_EXACTLY) {
            this.anchor.style.display = "inline";
            this.br.style.display = "inline";
            this.anchor.textContent = chrome.i18n.getMessage("blockThisPageExplicitly");
        }
        else {
            this.anchor.style.display = "none";
            this.br.style.display = "none";
        }
    }
    hide() {
        this.anchor.style.display = "none";
        this.br.style.display = "none";
    }
    block() {
        this.anchor.style.display = "none";
        this.br.style.display = "none";
    }
}
//# sourceMappingURL=block_anchor.js.map