/* global $ */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class OperationsBlock {
    private readonly operationDiv: HTMLDivElement;

    constructor(temporarilyUnblockAnchor: TemporarilyUnblockAnchor,
        hideAnchor: HideAnchor,
        blockAnchor: BlockAnchor,
        changeAnchor: BlockChangeAnchor) {
        this.operationDiv = $.div('block-anchor');

        this.operationDiv.appendChild(temporarilyUnblockAnchor.getElement());
        this.operationDiv.appendChild(hideAnchor.getElement());
        this.operationDiv.appendChild(blockAnchor.getElement());
        this.operationDiv.appendChild(changeAnchor.getElement());
    }

    public getElement(): Element {
        return this.operationDiv;
    }
}
