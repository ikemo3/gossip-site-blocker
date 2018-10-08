class BlockMediator {
    constructor(g, blockState, id) {
        const operationDiv = document.createElement("div");
        operationDiv.classList.add("block-anchor");
        const blockTarget = new BlockTarget(this, g.getElement(), g.getUrl(), id, blockState.state);
        const blockAnchor = new BlockAnchor(this, operationDiv, id);
        const unhideAnchor = new UnhideAnchor(this, operationDiv, id);
        const hideAnchor = new HideAnchor(this, operationDiv, id);
        this.url = g.getUrl();
        this.reason = blockState.reason;
        this.blockTarget = blockTarget;
        this.blockAnchor = blockAnchor;
        this.operationDiv = operationDiv;
        this.unhideAnchor = unhideAnchor;
        this.hideAnchor = hideAnchor;
        // insert anchor after target.
        DOMUtils.insertAfter(blockTarget.getDOMElement(), this.operationDiv);
        switch (blockState.state) {
            case "none":
                this.none();
                break;
            case "soft":
                this.hide();
                break;
        }
    }
    setWrappable(width) {
        this.operationDiv.style.width = width;
        this.operationDiv.style.whiteSpace = "normal";
    }
    none() {
        this.blockAnchor.none();
        this.blockTarget.none();
        this.unhideAnchor.none();
        this.hideAnchor.none();
    }
    hide() {
        this.blockAnchor.hide();
        this.blockTarget.hide();
        this.unhideAnchor.hide(this.reason);
        this.hideAnchor.hide();
    }
    unhide() {
        this.blockAnchor.unhide();
        this.blockTarget.unhide();
        this.unhideAnchor.unhide();
        this.hideAnchor.unhide();
    }
    async block(url, blockType) {
        await BlockedSitesRepository.add(url, blockType);
        this.blockAnchor.block();
        this.blockTarget.block(url);
        this.unhideAnchor.block(url);
        this.hideAnchor.block();
    }
    showBlockDialog() {
        // show dialog.
        new BlockDialog(this, this.url);
    }
    async blockPage(url, blockType) {
        await this.block(url, blockType);
    }
}
//# sourceMappingURL=block_mediator.js.map