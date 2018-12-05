class OperationsBlock {
    constructor(temporarilyUnblockAnchor, hideAnchor, blockAnchor, changeAnchor) {
        this.operationDiv = $.div("block-anchor");
        this.operationDiv.appendChild(temporarilyUnblockAnchor.getElement());
        this.operationDiv.appendChild(hideAnchor.getElement());
        this.operationDiv.appendChild(blockAnchor.getElement());
        this.operationDiv.appendChild(changeAnchor.getElement());
    }
    getElement() {
        return this.operationDiv;
    }
}
//# sourceMappingURL=operations_block.js.map