class BlockMediator {
    private readonly blockTarget: BlockTarget;
    private readonly blockAnchor: BlockAnchor;
    private readonly operationDiv: HTMLDivElement;
    private readonly changeAnchor: BlockChangeAnchor;

    constructor(g: IBlockable,
                blockState: BlockState,
                id: string) {
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

    public setWrappable(width: string) {
        this.blockAnchor.setWrappable(width);
    }

    public hide() {
        this.blockAnchor.hide();
        this.blockTarget.hide();
        this.changeAnchor.hide();
    }

    public unhide() {
        this.blockAnchor.unhide();
        this.blockTarget.unhide();
        this.changeAnchor.unhide();
    }

    public async block(url: string, blockType: string) {
        await BlockedSitesRepository.add(url, blockType);
        this.blockAnchor.block(url, blockType);
        this.blockTarget.block(url);
        this.changeAnchor.block();
    }
}
