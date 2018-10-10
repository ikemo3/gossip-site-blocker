class BlockMediator {
    constructor(g, blockState, id, defaultBlockType) {
        const operationDiv = document.createElement("div");
        operationDiv.classList.add("block-anchor");
        const blockTarget = new BlockTarget(this, g.getElement(), g.getUrl(), id, blockState.getState());
        const hideAnchor = new HideAnchor(this, operationDiv, id);
        const blockAnchor = new BlockAnchor(this, operationDiv, id);
        const unhideAnchor = new UnhideAnchor(this, operationDiv, id);
        this.url = g.getUrl();
        this.blockReason = blockState.getReason();
        this.blockTarget = blockTarget;
        this.blockAnchor = blockAnchor;
        this.operationDiv = operationDiv;
        this.unhideAnchor = unhideAnchor;
        this.hideAnchor = hideAnchor;
        this.defaultBlockType = defaultBlockType;
        // insert anchor after target.
        DOMUtils.insertAfter(blockTarget.getDOMElement(), this.operationDiv);
        switch (blockState.getState()) {
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
        this.unhideAnchor.hide(this.blockReason.getWord());
        this.hideAnchor.hide();
    }
    unhide() {
        this.blockAnchor.unhide(this.blockReason);
        this.blockTarget.unhide();
        this.unhideAnchor.unhide();
        this.hideAnchor.unhide();
    }
    async block(url, blockType) {
        await BlockedSitesRepository.add(url, blockType);
        if (blockType === "hard") {
            this.blockTarget.remove();
            this.operationDiv.parentElement.removeChild(this.operationDiv);
            return;
        }
        this.blockReason = new BlockReason(BlockType.URL, url);
        this.blockAnchor.block();
        this.blockTarget.block(url);
        this.unhideAnchor.block(url);
        this.hideAnchor.block();
    }
    showBlockDialog() {
        // show dialog.
        this.blockDialog = new BlockDialog(this, this.url, this.defaultBlockType);
    }
    async blockPage(url, blockType) {
        await this.block(url, blockType);
    }
}
//# sourceMappingURL=block_mediator.js.map