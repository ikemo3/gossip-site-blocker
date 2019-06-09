class BlockMediator {
    constructor(g, blockState, defaultBlockType, menuPosition) {
        const blockTarget = new BlockTarget(this, g.getElement());
        this.operationDiv = $.div("block-anchor");
        this.url = g.getUrl();
        this.blockReason = blockState.getReason();
        this.blockTarget = blockTarget;
        this.blockAnchor = new BlockAnchor(this);
        this.temporarilyUnblockAnchor = new TemporarilyUnblockAnchor(this);
        this.hideAnchor = new HideAnchor(this);
        this.changeAnchor = new BlockChangeAnchor(this);
        this.defaultBlockType = defaultBlockType;
        let operationsAnchor;
        switch (menuPosition) {
            case MenuPosition.COMPACT:
                // insert menu after action menu.
                operationsAnchor = new OperationsAnchor(this.hideAnchor, this.blockAnchor, this.changeAnchor, g.getPosition());
                DOMUtils.insertAfter(g.getOperationInsertPoint(), operationsAnchor.getElement());
                // insert links after block target.
                this.operationDiv.classList.add("block-anchor-tmp-unblock-only");
                this.operationDiv.classList.add(g.getCssClass());
                this.operationDiv.appendChild(this.temporarilyUnblockAnchor.getElement());
                DOMUtils.insertAfter(blockTarget.getDOMElement(), this.operationDiv);
                break;
            case MenuPosition.DEFAULT:
                // insert links after block target.
                this.operationDiv.appendChild(this.temporarilyUnblockAnchor.getElement());
                this.operationDiv.appendChild(this.hideAnchor.getElement());
                this.operationDiv.appendChild(this.blockAnchor.getElement());
                this.operationDiv.appendChild(this.changeAnchor.getElement());
                this.operationDiv.classList.add(g.getCssClass());
                DOMUtils.insertAfter(blockTarget.getDOMElement(), this.operationDiv);
                break;
            default:
                throw new ApplicationError("illegal menuPosition:" + menuPosition);
        }
        switch (blockState.getState()) {
            case "none":
                this.notBlocked();
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
    notBlocked() {
        this.blockAnchor.showBlockThisPage();
        this.blockTarget.show();
        this.temporarilyUnblockAnchor.hide();
        this.hideAnchor.hide();
        this.changeAnchor.hide();
    }
    hide() {
        this.blockAnchor.hide();
        this.blockTarget.hide();
        this.temporarilyUnblockAnchor.show(this.blockReason.getReason());
        this.hideAnchor.hide();
        this.changeAnchor.hide();
    }
    temporarilyUnblock() {
        switch (this.blockReason.getType()) {
            case BlockReasonType.URL_EXACTLY:
                this.blockAnchor.hide();
                this.changeAnchor.show();
                break;
            case BlockReasonType.URL:
                this.blockAnchor.showBlockExplicitly();
                this.changeAnchor.show();
                break;
            case BlockReasonType.IDN:
            case BlockReasonType.WORD:
                this.blockAnchor.showBlockExplicitly();
                this.changeAnchor.hide();
                break;
        }
        this.blockTarget.temporarilyUnblock();
        this.temporarilyUnblockAnchor.hide();
        this.hideAnchor.show();
    }
    async toHard(url) {
        await BlockedSitesRepository.toHard(url);
        this.blockTarget.remove();
        $.removeSelf(this.operationDiv);
    }
    async unblock(url) {
        await BlockedSitesRepository.del(url);
        this.notBlocked();
    }
    async block(url, blockType) {
        await BlockedSitesRepository.add(url, blockType);
        if (blockType === "hard") {
            this.blockTarget.remove();
            $.removeSelf(this.operationDiv);
            return;
        }
        if (DOMUtils.removeProtocol(this.url) === url) {
            this.blockReason = new BlockReason(BlockReasonType.URL_EXACTLY, this.url, url);
        }
        else {
            this.blockReason = new BlockReason(BlockReasonType.URL, this.url, url);
        }
        this.hide();
    }
    showChangeStateDialog() {
        // show dialog.
        this.changeStateDialog = new BlockChangeAnchorDialog(this, this.url, this.blockReason.getReason());
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