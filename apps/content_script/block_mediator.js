class BlockMediator {
    constructor(g, blockState, id) {
        const operationDiv = document.createElement("div");
        operationDiv.classList.add("block-anchor");
        const blockTarget = new BlockTarget(this, g.getElement(), g.getUrl(), id, blockState.state);
        const blockAnchor = new BlockAnchor(this, operationDiv, id, blockState.state, g.getUrl(), blockState.reason);
        const changeAnchor = new BlockChangeAnchor(operationDiv, g.getUrl(), blockState.reason);
        changeAnchor.changeState(blockState.state);
        this.blockTarget = blockTarget;
        this.blockAnchor = blockAnchor;
        this.operationDiv = operationDiv;
        this.changeAnchor = changeAnchor;
        // insert anchor after target.
        DOMUtils.insertAfter(blockTarget.getDOMElement(), blockAnchor.getDOMElement());
    }
    setWrappable(width) {
        this.blockAnchor.setWrappable(width);
    }
    hide() {
        this.blockAnchor.hide();
        this.blockTarget.hide();
        this.changeAnchor.hide();
    }
    unhide() {
        this.blockAnchor.unhide();
        this.blockTarget.unhide();
        this.changeAnchor.unhide();
    }
    async block(url, blockType) {
        await BlockedSitesRepository.add(url, blockType);
        this.blockAnchor.block(url, blockType);
        this.blockTarget.block(url);
        this.changeAnchor.block();
    }
}
//# sourceMappingURL=block_mediator.js.map